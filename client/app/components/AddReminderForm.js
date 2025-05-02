import { useState } from "react";
import "./ReminderForm.css";
import toast from "react-hot-toast";
export default function AddReminderForm({ onClose, onAddReminder, userId, baseURL }) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReminder = {
      name: formData.name,
      date: formData.date,
      time: formData.time,
      status: "incomplete",
      pinned: false,
      user_id: userId
    };

    try {
      const response = await fetch(`${baseURL}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReminder),
      });

      if (!response.ok) {
        throw new Error("Failed to create reminder");
      }

      const savedReminder = await response.json();
      toast.success("Reminder created successfully");
      onAddReminder(savedReminder);
      onClose();
    } catch (error) {
      console.error("Error creating reminder", error);
      toast.error("Failed, Please try again");
    }
  };

  
  return (
    <form className="reminder-form" onSubmit={handleSubmit}>
      <h3>Add Reminder</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <label>Date:</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <label>Time:</label>
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
      />
      <button type="submit"> Add</button>
    </form>
  );
}
