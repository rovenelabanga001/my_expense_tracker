"use client";
import "./page.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import PrivateRoute from "../components/PrivateRoute";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import AddBudgetForm from "../components/AddBudgetForm";
import Noresults from "../components/Noresults";
export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  //fetch budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch("http://localhost:3001/budgets");

        if (!response.ok) {
          throw new Error(`HTTP error! Status ${response.status}`);
        }

        const data = await response.json();
        setBudgets(data);
      } catch (error) {
        console.error("Error fetching budgets", error);
      }
    };
    fetchBudgets();
  }, []);

  const filteredBudgets = budgets.filter((budget) => {
    const term = searchTerm.toLowerCase();
    return (
      budget.name.toLowerCase().includes(term) ||
      budget.category.toLowerCase().includes(term) ||
      budget.amount.toString().includes(term)
    );
  });

  //add budget function
  const handleAddBudget = (newBudget) => {
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
  };
  return (
    <PrivateRoute>
      <section className="budgets-page">
        <h1>My Budgets</h1>
        <div className="search-container">
          <Modal
            trigger={
              <button>
                <FaPlus /> Add New
              </button>
            }
          >
            {({ close }) => (
              <AddBudgetForm onClose={close} onAddBudget={handleAddBudget} />
            )}
          </Modal>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="search by name, category, amount"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="buttons-container">
            <button>All</button>
            <button>Active</button>
            <button>Inactive</button>
          </div>
        </div>
        <div className="budget-cards-container">
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((budget, index) => (
              <div className="budget-card" key={index}>
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
            ))
          ) : (
            <Noresults />
          )}
        </div>
      </section>
    </PrivateRoute>
  );
}
