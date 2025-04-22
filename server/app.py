# server/app.py
#/usr/bin/env python3

from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import Api, Resource
from flask_cors import CORS
from datetime import datetime

from models import db, User, Transaction

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = True

CORS(app, origins=["http://localhost:3000"])

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

class Users(Resource):
    def get(self):
        response_dict_list = [u.to_dict() for u in User.query.all()]

        response = make_response(
            response_dict_list, 
            200
        )

        return response

api.add_resource(Users, '/users')

class Signup(Resource):
    def post(self):
        data = request.get_json()

        firstname = data.get("firstname")
        lastname = data.get("lastname")
        email = data.get("email")
        password = data.get("password")

        if not all([firstname, lastname, email, password]):
            return {"error" : "All fields are required"}, 400

        hashed_password = generate_password_hash(password)

        new_user = User(
            firstname = firstname,
            lastname = lastname,
            email = email,
            password = hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        user_data = new_user.to_dict()
        user_data.pop("password", None)

        return make_response(user_data, 201)

api.add_resource(Signup, "/signup")

class Signin(Resource):
    def post(self):
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"error" : "Email and password are required"}, 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return{"error" : "Invalid email or password"}, 401

        user_data = user.to_dict()
        user_data.pop("password", None)

        return make_response(user_data, 200)

api.add_resource(Signin, "/signin")

class Transactions(Resource):
    def get(self):
        response_dict_list = [t.to_dict() for t in Transaction.query.all()]

        response = make_response(
            response_dict_list, 
            200
        )

        return response

    def post(self):
        data = request.get_json()

        try:
            date_obj = datetime.strptime(data["date"], "%a, %d %b %Y %H:%M:%S %Z").date()
            new_transaction = Transaction(
                name = data["name"],
                amount = data["amount"],
                transaction_type = data["transaction_type"],
                date = date_obj ,
                user_id = data["user_id"]
            )

            db.session.add(new_transaction)
            db.session.commit()

            return make_response(new_transaction.to_dict(), 201)

        except Exception as e:
            return make_response({"error": str(e)}, 400)

api.add_resource(Transactions, "/transactions")

class UserTransactions(Resource):
    def get(self, user_id):
        transactions = Transaction.query.filter_by(user_id = user_id).all()
        response_dict_list = [t.to_dict() for t in transactions]

        return make_response(response_dict_list, 200)

api.add_resource(UserTransactions, "/users/<int:user_id>/transactions")

if __name__ == '__main__':
    app.run(port = 5000, debug = True)
