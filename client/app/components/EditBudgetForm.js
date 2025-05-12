import PrivateRoute from "./PrivateRoute";
import "./BudgetForm.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditBudgetForm({ budget, onClose, onUpdate, baseURL }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    amount: "",
    spent_amount: "",
    start_date: "",
    end_date: "",
    created_at: "",
    status: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //autofill the input fields
  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name || "",
        category: budget.category || "",
        amount: budget.amount || "",
        spent_amount: budget.spent_amount || "",
        start_date: budget.start_date || "",
        end_date: budget.end_date || "",
        created_at: budget.created_at || "",
        status: budget.status || "",
      });
    }
  }, [budget]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseURL}/budgets/${budget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update reminder");
      }

      const updatedBudget = await res.json();
      onUpdate(updatedBudget);
      onClose();
    } catch (error) {
      console.error("Failed to update budget", error);
      toast.error("Failed, Please try again");
    }
  };
  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <h3>Edit Budget</h3>
      <div>
        <label className="date-label">Name:</label>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="date-label">Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden>
            Category
          </option>
          <option value="Food">Food</option>
          <option value="Housing">Housing</option>
          <option value="Transport">Transport</option>
          <option value="Leisure">Leisure</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="date-label">Amount:</label>
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
      </div>
      <div>
        <label className="date-label">Spent Amount:</label>
        <input
          name="spent_amount"
          type="number"
          value={formData.spent_amount}
          onChange={handleChange}
          placeholder="Spent Amount"
          required
        />
      </div>
      <div>
        <label className="date-label">Start Date:</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="date-label">End Date:</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Update</button>
    </form>
  );
}
