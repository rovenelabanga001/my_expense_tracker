import { useState } from "react";
import "./BudgetForm.css";
import toast from "react-hot-toast";
export default function AddBudgetForm({ onClose, onAddBudget, userId }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString();
    const newBudget = {
      name: formData.name,
      category: formData.category,
      amount: formData.amount,
      spent_amount: 0,
      start_date: formData.start_date,
      end_date: formData.end_date,
      created_at: today,
      status: "active",
      user_id: userId
    };

    console.log(newBudget)

    try {
      const response = await fetch("http://127.0.0.1:5000/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBudget),
      });

      if (!response.ok) throw new Error("Failed to create new budget");
      toast.success("Budget added successfully");
      onAddBudget(newBudget);
      onClose();
    } catch (error) {
      console.error(error.message);
      toast.error("Failed, Please try again");
    }
  };
  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <h3>Add Budget</h3>
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
      <button type="submit">Add</button>
    </form>
  );
}
