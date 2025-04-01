import budgets from "@/public/budgets";
import "./page.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
export default function Budgets() {
  return (
    <section className="budgets-page">
      <h1>My Budgets</h1>
      <div className="search-container">
        <button>
          <FaPlus /> Add New
        </button>
        <input type="text" placeholder="search for budgets"/>
        <div className="buttons-container">
          <button>All</button>
          <button>Active</button>
          <button>Inactive</button>
        </div>
      </div>
      <div className="budget-cards-container">
        {budgets.map((budget, index) => (
          <div className="budget-card">
            <div className="budget-card-header">
              <div className="budget-name">
                <p>
                  {budget.name} <span>{budget.category}</span>
                </p>
              </div>
              <div className="budget-amount">
                <p>
                  Amount: <span>{budget.amount}</span>
                </p>
                <p>
                  Spent: <span>{budget.spent_amount}</span>
                </p>
              </div>
            </div>
            <div className="budget-card-header">
              <div className="checkbox-container">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
                <p>{budget.status}</p>
              </div>
              <div>
                <button>
                  <IoMdInformationCircleOutline />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
