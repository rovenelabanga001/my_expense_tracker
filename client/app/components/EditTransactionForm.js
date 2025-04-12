import { useEffect, useState } from "react";
import "./Form.css";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
export default function EditTransactionForm({
  transaction,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 //autofill the input fields
  useEffect(() => {
    if (transaction) {
      setFormData({
        name: transaction.name || "",
        type: transaction.type || "",
        amount: transaction.amount || "",
        date: transaction.date || "",
      });
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/transactions/${transaction.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      const updatedTransaction = await response.json();
      onUpdate(updatedTransaction);
      onClose();
    } catch (error) {
      console.error("Failed to update budget", error);
      toast.error("Failed! Please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Edit Transaction</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <select
        name="type"
        value={formData.type}
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
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <button type="submit" className="add-btn" disabled={loading}>
        Update
        {loading && <Spinner />}
      </button>
    </form>
  );
}
