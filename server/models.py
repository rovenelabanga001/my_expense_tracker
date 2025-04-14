# server/models.py

from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy import MetaData

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key = True)
    firstname = db.Column(db.String)
    lastname = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)

    transactions = db.relationship("Transaction", back_populates = "user", cascade = "all, delete-orphan")
    budgets = db.relationship("Budget", back_populates = "user", cascade = "all, delete-orphan")
    reminders = db.relationship("Reminder", back_populates = "user", cascade = "all, delete-orphan")

    def __repr__(self):
        return f'<User {self.id}, Name: {self.firstname} {self.lastname}, Email: {self.email}>'

class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    transaction_type = db.Column(db.String)
    amount = db.Column(db.Integer)
    date = db.Column(db.Date)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    budget_id = db.Column(db.Integer, db.ForeignKey("budgets.id"))

    user = db.relationship("User", back_populates="transactions")
    budget = db.relationship("Budget", back_populates="transactions")

    def __repr__(self):
        return f'<Transaction {self.id}, Name: {self.name}, Type: {self.transaction_type}, Amount: {self.amount}, Date: {self.date}>'

class Budget(db.Model):
    __tablename__ = "budgets"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    category = db.Column(db.String)
    amount = db.Column(db.Integer)
    spent_amount = db.Column(db.Integer)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.Date)
    status = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("User", back_populates = "budgets")
    transactions = db.relationship("Transaction", back_populates="budget", cascade = "all, delete-orphan")

    def __repr__(self):
        return f'<Budget {self.id}, Name: {self.name}, Category: {self.category}, Amount: {self.amount}, Spent: {self.spent_amount}>'

class Reminder(db.Model):
    __tablename__ = "reminders"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    date = db.Column(db.Date)
    time = db.Column(db.Time)
    status = db.Column(db.String)
    pinned = db.Column(db.Boolean)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("User", back_populates = "reminders")

    def __repr__(self):
        return f'<Reminder: {self.id}, Name: {self.name}, Date: {self.date}, Time: {self.time}, Status: {self.status}>'
