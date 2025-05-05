# server/app.py
#/usr/bin/env python3

from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import Api, Resource
from flask_cors import CORS
from datetime import datetime
from dateutil.parser import isoparse

from models import db, User, Transaction, Budget, Reminder

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = True

CORS(app, origins=["http://localhost:3000"])

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)


# get users
class Users(Resource):
    def get(self):
        response_dict_list = [u.to_dict() for u in User.query.all()]

        response = make_response(
            response_dict_list, 
            200
        )

        return response

api.add_resource(Users, '/users')

#signup
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

#signin
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

#get/post transactions
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
            date_obj = datetime.strptime(data["date"], "%Y-%m-%d").date()
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
#delete/patch transactions
class TransactionById(Resource):
    def patch(self, id):
        data = request.get_json()
        transaction = Transaction.query.get(id)

        if not transaction:
            return make_response({"error": "Transaction not found"}, 404)

        try:
            if "name" in data:
                transaction.name = data["name"]
            if "amount" in data:
                transaction.amount = data["amount"]
            if "transaction_type" in data:
                transaction.transaction_type = data["transaction_type"]
            if "date" in data:
                transaction.date = datetime.strptime(data["date"], "%Y-%m-%d").date()

            db.session.commit()
            return make_response(transaction.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 400)


    def delete(self, id):
        transaction = Transaction.query.get(id)

        if not transaction:
            return make_response({"error" : "Transaction not founc"}, 404)

        try:
            db.session.delete(transaction)
            db.session.commit()
            return make_response({}, 204)

        except Exception as e:
            return make_response({"error": str(e)}, 400)

api.add_resource(TransactionById, "/transactions/<int:id>")

#get transactions by user_id
class UserTransactions(Resource):
    def get(self, user_id):
        transactions = Transaction.query.filter_by(user_id = user_id).all()
        response_dict_list = [t.to_dict() for t in transactions]

        return make_response(response_dict_list, 200)

api.add_resource(UserTransactions, "/users/<int:user_id>/transactions")


class Budgets(Resource):
    def get(self):
        response_dict_list = [b.to_dict() for b in Budget.query.all()]

        response = make_response(response_dict_list, 200)
        return response

    def post(self):
        data = request.get_json()

        try:
            start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
            end_date = datetime.strptime(data["end_date"], "%Y-%m-%d").date()
            created_at = isoparse(data["created_at"]).date()
            new_budget = Budget(
                name = data["name"],
                category = data["category"],
                amount = data["amount"],
                spent_amount = data["spent_amount"],
                start_date = start_date,
                end_date = end_date,
                created_at = created_at,
                status = data["status"],
                user_id = data["user_id"]
            )

            db.session.add(new_budget)
            db.session.commit()

            return make_response(new_budget.to_dict(), 201)

        except Exception as e:
            return make_response({"error": str(e)}, 400)
api.add_resource(Budgets, "/budgets")

class BudgetById(Resource):
    def patch(self, id):
        budget = Budget.query.get(id)
        if not budget:
            return({"error": "Budget not found"}, 404)

        data = request.get_json()

        if "name" in data:
            budget.name = data["name"]
        if "category" in data:
            budget.category = data["category"]
        if "amount" in data:
            budget.amount = data["amount"]
        if "spent_amount" in data:
            budget.spent_amount = data["spent_amount"]
        if "status" in data:
            budget.status = data["status"]
        if "start_date" in data:
            try:
                budget.start_date = datetime.fromisoformat(data["start_date"].replace("Z", "")).date()
            except ValueError:
                return ({"error": "Invalid start_date format. Use ISO format"}, 400)

        if "end_date" in data:
            try:
                budget.end_date = datetime.fromisoformat(data["end_date"].replace("Z", "")).date()
            except ValueError:
                return ({"error" : "Invalid end_date format. Use Use ISO format"})

        db.session.commit()
        return budget.to_dict(), 200

    def delete(self, id):
        budget = Budget.query.get(id)
        if not budget:
            return {"error" : "Budget not found"}, 404

        db.session.delete(budget)
        db.session.commit()
        
        return ({"Message": "Budget deleted successfully"}, 204)
            
api.add_resource(BudgetById, "/budgets/<int:id>")

class UserBudgets(Resource):
    def get(self, user_id):
        budgets = Budget.query.filter_by(user_id = user_id).all()
        response_dict_list = [b.to_dict() for b in budgets]

        return make_response(response_dict_list, 200)
api.add_resource(UserBudgets, "/users/<int:user_id>/budgets")

class Reminders(Resource):
    def get(self):
        response_dict_list = [r.to_dict() for r in Reminder.query.all()]
        
        response = make_response(response_dict_list, 200)
        return response

    def post(self):
        data = request.get_json()
        try:
            date_str = data.get("date")
            time_str = data.get("time")

            parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
            parsed_time = datetime.strptime(time_str, "%H:%M").time() if time_str else None
            new_reminder = Reminder(
                name = data.get("name"),
                date = parsed_date,
                time = parsed_time,
                status = data.get("status"),
                pinned = data.get("pinned"),
                user_id = data.get("user_id")
            )

            db.session.add(new_reminder)
            db.session.commit()

            return make_response(new_reminder.to_dict(), 201)

        except Exception as e:
            return make_response({"error": str(e)}, 400)
api.add_resource(Reminders, "/reminders")

class ReminderById(Resource):
    def patch(self, id):
        reminder = Reminder.query.get(id)
        if not reminder:
            return make_response({"error": "Reminder not found"}, 404)

        data = request.get_json()

        if "name" in data:
            reminder.name = data["name"]
        
        if "status" in data:
            reminder.status = data["status"]

        if "pinned" in data:
            reminder.pinned = data["pinned"]
        
        if "date" in data:
            try:
                reminder.date = datetime.fromisoformat(data["date"]).date()
            except ValueError:
                return {"error" : "Invalid date format, Use ISO format (YYYY-MM-DD)"}, 400

        if "time" in data:
            time_str = data["time"]
            parsed_time = None

            for fmt in ("%I:%M %p", "%H:%M", "%H:%M:%S"): #12-hour format then 24-hour format
                try:
                    parsed_time = datetime.strptime(time_str, fmt).time()
                    break
                except ValueError:
                    continue

            if not parsed_time:
                return {"error": "Invalid time format, Use 'HH:MM' (24hr) or 'HH:MM AM/PM' (12hr)"}, 400

            reminder.time = parsed_time
        db.session.commit()

        return make_response(reminder.to_dict(), 200)

    def delete(self, id):
        reminder = Reminder.query.get(id)

        if not reminder:
            return make_response({"error": "Reminder not found"}, 404)

        db.session.delete(reminder)
        db.session.commit()

        return make_response({"message": "Reminder deleted"}, 200)

api.add_resource(ReminderById, "/reminders/<int:id>")

class UserReminders(Resource):
    def get(self, user_id):
        reminders = Reminder.query.filter_by(user_id = user_id).all()
        response_dict_list = [r.to_dict() for r in reminders]

        return make_response(response_dict_list, 200)
api.add_resource(UserReminders, "/users/<int:user_id>/reminders")
if __name__ == '__main__':
    app.run(port = 5000, debug = True)
