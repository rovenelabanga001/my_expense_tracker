from datetime import date, time
from app import app
from models import db, User, Budget, Transaction, Reminder

with app.app_context():
    # Drop all tables and recreate (WARNING: will delete existing data)
    db.drop_all()
    db.create_all()

    # Create users
    user1 = User(
        firstname="Alice",
        lastname="Johnson",
        email="alice@example.com",
        password="password123"
    )

    user2 = User(
        firstname="Bob",
        lastname="Smith",
        email="bob@example.com",
        password="securepass"
    )

    user3 = User(
        firstname="Charlie",
        lastname="Davis",
        email="charlie@example.com",
        password="charliespassword"
    )

    user4 = User(
        firstname="Diana",
        lastname="Evans",
        email="diana@example.com",
        password="dianaspwd"
    )

    db.session.add_all([user1, user2, user3, user4])
    db.session.commit()

    # Create budgets for user1 (Alice)
    budget1 = Budget(
        name="Groceries",
        category="Food",
        amount=5000,
        spent_amount=1000,
        start_date=date(2025, 4, 1),
        end_date=date(2025, 4, 30),
        created_at=date.today(),
        status="active",
        user=user1
    )

    budget2 = Budget(
        name="Rent",
        category="Housing",
        amount=15000,
        spent_amount=15000,
        start_date=date(2025, 4, 1),
        end_date=date(2025, 4, 30),
        created_at=date.today(),
        status="completed",
        user=user1
    )

    # Create budgets for user2 (Bob)
    budget3 = Budget(
        name="Entertainment",
        category="Leisure",
        amount=2000,
        spent_amount=1200,
        start_date=date(2025, 4, 1),
        end_date=date(2025, 4, 30),
        created_at=date.today(),
        status="active",
        user=user2
    )

    budget4 = Budget(
        name="Health Insurance",
        category="Insurance",
        amount=3000,
        spent_amount=500,
        start_date=date(2025, 4, 1),
        end_date=date(2025, 4, 30),
        created_at=date.today(),
        status="active",
        user=user2
    )

    # Create budgets for user3 (Charlie)
    budget5 = Budget(
        name="Vacation Fund",
        category="Travel",
        amount=8000,
        spent_amount=1000,
        start_date=date(2025, 4, 1),
        end_date=date(2025, 12, 31),
        created_at=date.today(),
        status="active",
        user=user3
    )

    budget6 = Budget(
        name="Car Repair",
        category="Automobile",
        amount=3000,
        spent_amount=500,
        start_date=date(2025, 4, 1),
        end_date=date(2025, 4, 30),
        created_at=date.today(),
        status="active",
        user=user3
    )

    # Create budgets for user4 (Diana)
    budget7 = Budget(
        name="Savings",
        category="Personal",
        amount=10000,
        spent_amount=2000,
        start_date=date(2025, 4, 1),
        end_date=date(2025, 4, 30),
        created_at=date.today(),
        status="active",
        user=user4
    )

    budget8 = Budget(
        name="Business Expenses",
        category="Business",
        amount=15000,
        spent_amount=5000,
        start_date=date(2025, 4, 1),
        end_date=date(2025, 4, 30),
        created_at=date.today(),
        status="active",
        user=user4
    )

    db.session.add_all([budget1, budget2, budget3, budget4, budget5, budget6, budget7, budget8])
    db.session.commit()

    # Create transactions for user1 (Alice)
    transaction1 = Transaction(
        name="Buy Milk",
        transaction_type="Expense",
        amount=200,
        date=date(2025, 4, 2),
        user=user1,
        budget=budget1
    )

    transaction2 = Transaction(
        name="Pay Rent",
        transaction_type="Expense",
        amount=15000,
        date=date(2025, 4, 3),
        user=user1,
        budget=budget2
    )

    transaction3 = Transaction(
        name="Purchase Laptop",
        transaction_type="Expense",
        amount=3000,
        date=date(2025, 4, 5),
        user=user1,
        budget=budget2
    )

    # Create transactions for user2 (Bob)
    transaction4 = Transaction(
        name="Movie Night",
        transaction_type="Expense",
        amount=800,
        date=date(2025, 4, 4),
        user=user2,
        budget=budget3
    )

    transaction5 = Transaction(
        name="Gym Membership",
        transaction_type="Expense",
        amount=100,
        date=date(2025, 4, 6),
        user=user2,
        budget=budget4
    )

    # Create transactions for user3 (Charlie)
    transaction6 = Transaction(
        name="Flight to Paris",
        transaction_type="Expense",
        amount=2000,
        date=date(2025, 4, 8),
        user=user3,
        budget=budget5
    )

    transaction7 = Transaction(
        name="Car Repair",
        transaction_type="Expense",
        amount=500,
        date=date(2025, 4, 10),
        user=user3,
        budget=budget6
    )

    # Create transactions for user4 (Diana)
    transaction8 = Transaction(
        name="Office Supplies",
        transaction_type="Expense",
        amount=500,
        date=date(2025, 4, 9),
        user=user4,
        budget=budget7
    )

    transaction9 = Transaction(
        name="Business Lunch",
        transaction_type="Expense",
        amount=300,
        date=date(2025, 4, 11),
        user=user4,
        budget=budget8
    )

    db.session.add_all([transaction1, transaction2, transaction3, transaction4, transaction5, transaction6, transaction7, transaction8, transaction9])
    db.session.commit()

    # Create reminders for users
    reminder1 = Reminder(
        name="Pay Internet Bill",
        date=date(2025, 4, 10),
        time=time(9, 0),
        status="pending",
        pinned=True,
        user=user1
    )

    reminder2 = Reminder(
        name="Submit Report",
        date=date(2025, 4, 12),
        time=time(14, 30),
        status="done",
        pinned=False,
        user=user2
    )

    reminder3 = Reminder(
        name="Book Travel Tickets",
        date=date(2025, 4, 15),
        time=time(10, 0),
        status="pending",
        pinned=False,
        user=user3
    )

    reminder4 = Reminder(
        name="Buy Office Supplies",
        date=date(2025, 4, 14),
        time=time(13, 0),
        status="done",
        pinned=True,
        user=user4
    )

    db.session.add_all([reminder1, reminder2, reminder3, reminder4])
    db.session.commit()

    print("✅ Seed data inserted successfully!")
