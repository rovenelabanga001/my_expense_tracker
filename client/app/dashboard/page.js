"use client";
import "./page.css";
import { IoIosNotifications } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Dashboard() {
  return (
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
            <p>14 transactions</p>
            <h2>1500.00</h2>
          </div>
          <div className="type-percentage">
            <p className="balance-percentage">72%</p>
          </div>
        </div>
        <div className="type-summary widget">
          <div className="type-info">
            <h3>Expense</h3>
            <p>9 transactions</p>
            <h2>600.00</h2>
          </div>
          <div className="type-percentage">
            <p className="expense-percentage">28%</p>
          </div>
        </div>
        <div className="type-summary widget">
          <div className="type-info">
            <h3>Income</h3>
            <p>3 transactions</p>
            <h2>2180.00</h2>
          </div>
          <div className="type-percentage">
            <p className="income-percentage">100%</p>
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
            <div className="reminder-info">
              <h2>Today 11 March</h2>
              <div>
                <input type="radio" />
                <p>Pay monthly loan</p>
              </div>
            </div>
            <div className="reminder-info">
              <h2>Today 11 March</h2>
              <div>
                <input type="radio" />
                <p>Pay monthly loan</p>
              </div>
            </div>
            <div className="reminder-info">
              <h2>Today 11 March</h2>
              <div>
                <input type="radio" />
                <p>Pay monthly loan</p>
              </div>
              <div>
                <input type="radio" />
                <p>Send money to Dad</p>
              </div>
            </div>
          </div>
        </div>
        <div className="shortcuts widget">
          <div className="reminders-heading">
            <div className="svg-container">
              <GiMoneyStack />
              <p>Transactions</p>
            </div>
            <button>
              See All
              <FaLongArrowAltRight />
            </button>
          </div>
          <div className="shortcut-body">
            <div className="transactions-info">
              <div className="transaction-heading">
                <h2>Today 11 March</h2>
                <h2>800.00</h2>
              </div>
              <div className="transaction-body">
                <div className="description">
                  <h5>March Electricity Bill</h5>
                  <p>Utilities</p>
                </div>
                <h5>50</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="shortcuts widget"></div>
      </div>
    </section>
  );
}
