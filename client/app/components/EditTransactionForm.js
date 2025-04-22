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
    transaction_type: "",
    amount: "",
    date: "",
  });

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
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
      const formattedDate = transaction.date
      ? new Date(transaction.date).toISOString().split("T")[0]
      : "";
      setFormData({
        name: transaction.name || "",
        transaction_type: transaction.type || "",
        amount: transaction.amount || "",
        date: formattedDate,
      });
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataWithNumberAmount = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString().split("T")[0],
    };

    try {
      const response = await fetch(
        `${baseURL}/transactions/${transaction.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataWithNumberAmount),
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
      />
      <select
        name="transaction_type"
        value={formData.transaction_type}
        onChange={handleChange}
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
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <button type="submit" className="add-btn" disabled={loading}>
        Update
        {loading && <Spinner />}
      </button>
    </form>
  );
}
