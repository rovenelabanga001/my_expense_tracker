import "./page.css";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import transactions from "@/public/data";
export default function Transactions() {
  return (
    <section className="transactions-page">
      <div className="page-header">
        <h1>My Transactions</h1>
        <h5>Today 11 March</h5>
      </div>
      <div className="add-transaction">
        <div className="add">
          <button>
            <FaPlus />
            Add New
          </button>
        </div>
        <div className="search-transactions">
          <input type="text" placeholder="search for transactions" />
        </div>
        <div className="filter-date">
          <input type="date" />
        </div>
        <div className="filter-type">
          <button>All</button>
          <button>Income</button>
          <button>Expense</button>
        </div>
      </div>
      <div className="transactions-container">
        <div className="transaction-row header">
          <div>Name</div>
          <div>Type</div>
          <div>Amount</div>
          <div>Date</div>
        </div>
        {transactions.map((tx, index) => (
          <div className="transaction-row" key={index}>
            <div>{tx.name}</div>
            <div className={tx.type === "Income" ? "income" : "expense"}>
              {tx.type}
            </div>
            <div>{tx.amount}</div>
            <div>{tx.date}</div>
            <div>
              <button>
                <MdEdit />
              </button>
            </div>
            <div>
              <button>
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
