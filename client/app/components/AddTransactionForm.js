"use client";
import { useState } from "react";
import "./Form.css";
import toast from "react-hot-toast";
export default function AddTransactionForm({ onClose, onAddTransaction }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Expense",
    amount: "",
    date: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTransaction = {
      name: formData.name,
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: formData.date,
    };

    try {
      const res = await fetch("http://localhost:3001/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      if (!res.ok) throw new Error("Failed to create transaction");
      toast.success("Transaction added successfully");
      onAddTransaction(newTransaction);
      onClose();
    } catch (error) {
      console.error(error.message);
      toast.error("Failed, Please try again");
    }
  };
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        name="name"
        onChange={handleChange}
        required
      />
      <select
        id="transaction-type"
        value={formData.type}
        name="type"
        onChange={handleChange}
        required
      >
        <option value="" disabled hidden>
          Type
        </option>
        <option value="Expense">Expense</option>
        <option value="Income">Income</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        name="amount"
        onChange={handleChange}
        required
      />
      <input
        type="date"
        value={formData.date}
        name="date"
        onChange={handleChange}
        max={today}
        required
      />
      <button type="submit" className="add-btn">
        Add 
      </button>
    </form>
  );
}
