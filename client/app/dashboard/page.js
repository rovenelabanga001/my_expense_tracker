"use client";
import "./page.css";
import { IoIosNotifications } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { FaLongArrowAltRight } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loadingsvg from "../components/Loadingsvg";

export default function Dashboard() {
  const router = useRouter();
  const loadingSvg = "assets/loading.svg";

  const [transactions, setTransactions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selected, setSelected] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionDate, setTransactionDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  //fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3001/transactions");

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  //fetch reminders
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3001/reminders");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const today = new Date();

        //Get today's date, tommorow and the day after tommorrow
        const nextThreeDays = [0, 1, 2].map((offset) => {
          const date = new Date();
          date.setDate(today.getDate() + offset);
          return date.toISOString().split("T")[0]; //Format YYYY-MM-DD
        });

        //Filter reminders for today, tomorrow and the day after tomorrow
        const upcomingReminders = data.filter((reminder) => {
          nextThreeDays.includes(reminder.date);
        });

        //If there are no reminders for today, tomorrow or the day after tomorrow, get the three closest reminders
        if (upcomingReminders.length === 0) {
          const closestReminder = data
            .sort(
              (a, b) =>
                Math.abs(new Date(a.date) - today) -
                Math.abs(new Date(b.date) - today)
            ) //sort by approximity to today
            .slice(0, 3); // Get the three closest reminders

          setReminders(closestReminder);
        } else {
          setReminders(upcomingReminders);
        }
      } catch (error) {
        console.error("Error fetching reminders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const toggleReminder = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  //transactions widget logic
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    const today = new Date().toISOString().split("T")[0];

    //group transactions by date
    const transactionsByDate = transactions.reduce((acc, transaction) => {
      acc[transaction.date] = acc[transaction.date] || [];
      acc[transaction.date].push(transaction);
      return acc;
    }, {});

    //get the latest date with transactions
    const availableDates = Object.keys(transactionsByDate).sort(
      (a, b) => new Date(b) - new Date(a)
    );
    const targetDate = availableDates.includes(today)
      ? today
      : availableDates[0];

    //get transactions for the chosen dates(today or latest available)
    const latestTransactions = transactionsByDate[targetDate] || [];
    const lastThreeTransactions = latestTransactions.slice(-3);

    const total = latestTransactions.reduce((sum, t) => sum + t.amount, 0);

    setFilteredTransactions(lastThreeTransactions);
    setTransactionDate(targetDate);
    setTotalAmount(total);
  }, [transactions]);

  const parseAmount = (amount) => {
    return parseFloat(amount);
  };

  //calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  //calculate balance
  const balance = totalIncome - totalExpenses;

  //count transactions
  const totalTransactions = transactions.length;
  const incomeCount = transactions.filter((t) => t.type === "Income").length;
  const expenseCount = transactions.filter((t) => t.type === "Expense").length;

  //calculate percentages
  const balancePercentage =
    totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(2) : 0;
  const expensePercentage =
    totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(2) : 0;
  const incomePercentage = 100;
  return loading ? (
    <Loadingsvg />
  ) : (
    <section className="dashboard-section">
      <div className="user-info">
        <div className="user-info-icon">
          <FaRegUserCircle />
        </div>
        <h3>John Doe</h3>
      </div>
      <div className="transactions-summary widgets-container">
        <div className="type-summary widget">
          <div className="type-info">
            <h3>Balance</h3>
            <p>{totalTransactions} transactions</p>
            <h2>{balance.toFixed(2)}</h2>
          </div>
          <div className="type-percentage">
            <p className="balance-percentage">{balancePercentage} %</p>
          </div>
        </div>
        <div className="type-summary widget">
          <div className="type-info">
            <h3>Expense</h3>
            <p>{expenseCount} transactions</p>
            <h2>{totalExpenses}</h2>
          </div>
          <div className="type-percentage">
            <p className="expense-percentage">{expensePercentage} %</p>
          </div>
        </div>
        <div className="type-summary widget">
          <div className="type-info">
            <h3>Income</h3>
            <p>{incomeCount} transactions</p>
            <h2>{totalIncome}</h2>
          </div>
          <div className="type-percentage">
            <p className="income-percentage">{incomePercentage} %</p>
          </div>
        </div>
      </div>
      <div className="reminder-section widgets-container">
        <div className="shortcuts widget">
          <div className="reminders-heading">
            <div className="svg-container">
              <IoIosNotifications />
              <p>Reminders</p>
            </div>
            <button>
              <FaPlus />
            </button>
          </div>
          <div className="shortcut-body">
            <div className="reminders-container">
              {reminders.length > 0 ? (
                reminders.map((reminder) => (
                  <div key={reminder.id} className="reminder-info">
                    <h2>{new Date(reminder.date).toDateString()}</h2>
                    <div className="reminder-item">
                      <input
                        type="checkbox"
                        onChange={() => toggleReminder(reminder.id)}
                        checked={selected[reminder.id] || false}
                      />
                      <p
                        style={{
                          textDecoration: selected[reminder.id]
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {reminder.name} - {reminder.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No upcoming reminders</p>
              )}
            </div>
          </div>
        </div>
        <div className="shortcuts widget">
          <div className="reminders-heading">
            <div className="svg-container">
              <GiMoneyStack />
              <p>Transactions</p>
            </div>
            <button onClick={() => router.push("/transactions")}>
              See All
              <FaLongArrowAltRight />
            </button>
          </div>
          <div className="shortcut-body">
            <div className="transactions-info">
              <div className="transaction-heading">
                <h2>
                  {transactionDate
                    ? new Date(transactionDate).toDateString()
                    : "No Transactions"}
                </h2>
                <h2>{totalAmount.toFixed(2)}</h2>
              </div>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <div key={t.id} className="transaction-body">
                    <div className="description">
                      <h5>
                        {t.name}
                        {""}
                      </h5>
                      <span>
                        <p>{t.type}</p>
                        {/* should be category */}
                      </span>
                    </div>
                    <h5>{t.amount.toFixed(2)}</h5>
                  </div>
                ))
              ) : (
                <p>No transactions available</p>
              )}
            </div>
          </div>
        </div>
        {/* <div className="shortcuts widget">
          <div className="reminders-heading">
            <div className="svg-container">
              <AiFillSchedule />
              <p>Budgets</p>
            </div>
            <button>
              <FaPlus />
            </button>
          </div>
          <div className="shortcut-body">
            <div className="transactions-info">
              <div className="transaction-heading">
                <h2>Today 11 March</h2>
              </div>
              <div className="transaction-body">
                <div className="description">
                  <h5>
                    Electricity Bill{" "}
                    <span>
                      <p>Active</p>
                    </span>
                  </h5>
                </div>
                <h5>50.00</h5>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
