import { useEffect, useState } from "react";
import "./EditReminderForm.css";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import Loadingsvg from "./Loadingsvg";
export default function EditReminderForm({
  onClose,
  onUpdate,
  reminder,
  baseURL,
}) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //autofill the input fields
  useEffect(() => {
    if (reminder) {
      setFormData({
        name: reminder.name || "",
        date: reminder.date || "",
        time: reminder.time || "",
      });
    }
  }, [reminder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/reminders/${reminder.id}`, {
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
      toast.error("Failed! Please try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="edit-reminder-form" onSubmit={handleSubmit}>
      <h3>Edit Reminder</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <label>Date:</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <label>Time:</label>
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
      />
      <button type="submit" id="edit">
        {loading ? <Spinner /> : "Update"}
      </button>
    </form>
  );
}
