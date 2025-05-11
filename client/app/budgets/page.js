"use client";
import "./page.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PrivateRoute from "../components/PrivateRoute";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import AddBudgetForm from "../components/AddBudgetForm";
import Noresults from "../components/Noresults";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  //fetch budgets
  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchBudgets = async () => {
      try {
        const response = await fetch(
          `${baseURL}/users/${session?.user?.id}/budgets`
        );

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
  }, [status, session]);

  const filteredBudgets = budgets.filter((budget) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      budget.name.toLowerCase().includes(term) ||
      budget.category.toLowerCase().includes(term) ||
      budget.amount.toString().includes(term);

    const matchesStatus =
      statusFilter === "all" || budget.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  //add budget function
  const handleAddBudget = (newBudget) => {
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
  };

  //handle card toggle
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(` ${baseURL}/budgets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update budget status");
      }

      const updatedBudget = await response.json();

      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
          budget.id === id
            ? { ...budget, status: updatedBudget.status }
            : budget
        )
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  //Delete card logic
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${baseURL}/budgets/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }

      toast.success("Budget deleted successfully");

      setBudgets((prevBudgets) =>
        prevBudgets.filter((budget) => budget.id !== id)
      );
    } catch (error) {
      console.error("Error deleting budget", error);
      toast.error("Failed, Please try again");
    }
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
              <AddBudgetForm
                onClose={close}
                onAddBudget={handleAddBudget}
                userId={userId}
                baseURL={baseURL}
              />
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
            <button
              className={statusFilter === "all" ? "active" : ""}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              className={statusFilter === "active" ? "active" : ""}
              onClick={() => setStatusFilter("active")}
            >
              Active
            </button>
            <button
              className={statusFilter === "active" ? "inactive" : ""}
              onClick={() => setStatusFilter("inactive")}
            >
              Inactive
            </button>
          </div>
        </div>
        <div className="budget-cards-container">
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((budget, index) => (
              <div
                className={`budget-card ${
                  budget.status === "inactive" ? "inactive-card" : ""
                }`}
                key={index}
              >
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
                      <input
                        type="checkbox"
                        checked={budget.status === "active"}
                        onChange={() =>
                          handleToggleStatus(budget.id, budget.status)
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <p>{budget.status}</p>
                  </div>
                  <div className="card-buttons-container">
                    <button onClick={() => handleDelete(budget.id)}>
                      <MdDelete />
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
