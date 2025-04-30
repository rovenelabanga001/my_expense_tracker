"use client";
import "./page.css";
import { MdPushPin } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { RiUnpinFill } from "react-icons/ri";
import Modal from "../components/Modal";
import AddReminderForm from "../components/AddReminderForm";
import { useEffect, useState } from "react";
import PrivateRoute from "../components/PrivateRoute";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import EditReminderForm from "../components/EditReminderForm";
export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const userId = session?.user?.id;
  console.log("User Id", userId);

  //fetch reminders
  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchReminders = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/users/${userId}/reminders`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status ${response.status}`);
        }

        const data = await response.json();
        setReminders(data);
      } catch (error) {
        console.error("Error fetching budgets", error);
      }
    };
    fetchReminders();
  }, [status, session]);

  const filteredReminders = reminders
    .filter((reminder) => {
      //search filter
      const term = searchTerm.toLowerCase();
      const matchesSearch = reminder.name.toLowerCase().includes(term);

      const matchesDate = selectedDate ? reminder.date === selectedDate : true;
      return matchesSearch && matchesDate;
    })
    .filter((reminder) => {
      //date, time filter
      const now = new Date();

      const parseReminderDateTime = (reminder) => {
        const isAllDay = reminder.time.toLowerCase() === "all day";
        const time = isAllDay ? "00:00" : reminder.time;
        return new Date(`${reminder.date}T${time}`);
      };

      const reminderDateTime = parseReminderDateTime(reminder);

      if (filter === "upcoming") {
        return reminderDateTime > now;
      } else if (filter === "expired") {
        return reminderDateTime < now;
      } else {
        return true; //"all"
      }
    });

  //add reminder function
  const handleAddReminder = (newReminder) => {
    setReminders((prevReminders) => [...prevReminders, newReminder]);
  };

  //handles reminder's status toggle
  const handleStatusToggle = async (reminder) => {
    const updatedStatus =
      reminder.status === "complete" ? "incomplete" : "complete";

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/reminders/${reminder.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: updatedStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update reminder status; ${response.statusText}`
        );
      }

      const updatedReminder = await response.json();

      setReminders((prevReminders) =>
        prevReminders.map((r) =>
          r.id === updatedReminder.id ? updatedReminder : r
        )
      );
    } catch (error) {
      console.error("Failed to update status", error.message);
      toast.error("Couldn't update status");
    } finally {
      setLoading(false);
    }
  };

  //pin reminders logic
  const handlePinToggle = async (reminder) => {
    const isPinned = reminder.pinned;

    if (!isPinned && reminders.filter((r) => r.pinned).length >= 3) {
      toast.error("You can only pin 3 reminders");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/reminders/${reminder.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pinned: !isPinned }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update pin status");
      }

      const updatedReminder = await response.json();
      setReminders((prev) =>
        prev.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
      );
    } catch (error) {
      console.error("Error pinning reminder");
    }
  };

  //sorting and seperating reminders(pinned and unpinned)
  const pinnedReminders = filteredReminders.filter((r) => r.pinned);
  const unpinnedReminders = filteredReminders.filter((r) => !r.pinned);

  //update reminder function
  const handleUpdateReminder = (updatedReminder) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    );
  };

  //DELETE request handling
  const handleDeleteReminder = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/reminders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete reminder");
      }

      setReminders((prevReminders) =>
        prevReminders.filter((reminder) => reminder.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete reminder");
      toast.error("Failed! Please try again");
    }
  };
  return (
    <PrivateRoute>
      <section className="reminders-section">
        <h1>My Reminders</h1>
        <div className="search-reminder">
          <Modal
            trigger={
              <button>
                <FaPlus /> Add New
              </button>
            }
          >
            {({ close }) => (
              <AddReminderForm
                onClose={close}
                onAddReminder={handleAddReminder}
                userId={userId}
              />
            )}
          </Modal>
          <div className="search-reminder-input">
            <input
              type="text"
              placeholder="search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-reminder-input">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "upcoming" ? "active" : ""}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={filter === "expired" ? "active" : ""}
              onClick={() => setFilter("expired")}
            >
              Expired
            </button>
          </div>
        </div>
        <div className="reminders-container">
          {pinnedReminders.length > 0 && <p className="pinned">Pinned</p>}
          {pinnedReminders.map((reminder, index) => (
            <div className="reminder-card pinned-card" key={index}>
              <div className="card-header">
                <p>{reminder.name}</p>
                <div className="card-status">
                  {loading && <FaSpinner className="spinner" />}
                  <p>{reminder.status}</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={reminder.status === "complete"}
                      onChange={() => handleStatusToggle(reminder)}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
              <div className="card-footer">
                <h6>
                  {reminder.date} <span>{reminder.time}</span>
                </h6>
                <div className="footer-buttons">
                  <button onClick={() => handlePinToggle(reminder)}>
                    {reminder.pinned ? <RiUnpinFill /> : <MdPushPin />}
                  </button>
                  <Modal
                    trigger={
                      <button>
                        <MdModeEditOutline />
                      </button>
                    }
                  >
                    {({ close }) => (
                      <EditReminderForm
                        onClose={close}
                        onUpdate={handleUpdateReminder}
                        reminder={reminder}
                      />
                    )}
                  </Modal>
                  <button>
                    <MdDelete
                      onClick={() => handleDeleteReminder(reminder.id)}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <p className="pinned">
            {filter === "all"
              ? "All Reminders"
              : filter === "expired"
              ? "Expired Reminders"
              : filter === "upcoming"
              ? "Upcoming Reminders"
              : ""}
          </p>
          {unpinnedReminders.map((reminder, index) => (
            <div className="reminder-card" key={index}>
              <div className="card-header">
                <p>{reminder.name}</p>
                <div className="card-status">
                  {loading && <FaSpinner className="spinner" />}
                  <p>{reminder.status}</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={reminder.status === "complete"}
                      onChange={() => handleStatusToggle(reminder)}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
              <div className="card-footer">
                <h6>
                  {reminder.date} <span>{reminder.time}</span>
                </h6>
                <div className="footer-buttons">
                  <button onClick={() => handlePinToggle(reminder)}>
                    {reminder.pinned ? <RiUnpinFill /> : <MdPushPin />}
                  </button>
                  <Modal
                    trigger={
                      <button>
                        <MdModeEditOutline />
                      </button>
                    }
                  >
                    {({ close }) => (
                      <EditReminderForm
                        onClose={close}
                        onUpdate={handleUpdateReminder}
                        reminder={reminder}
                      />
                    )}
                  </Modal>
                  <button onClick={() => handleDeleteReminder(reminder.id)}>
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PrivateRoute>
  );
}
