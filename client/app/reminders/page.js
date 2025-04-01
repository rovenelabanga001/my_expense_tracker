import "./page.css";
import { MdPushPin } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import reminders from "@/public/reminders";
export default function Reminders() {
  return (
    <section className="reminders-section">
      <h1>My Reminders</h1>
      <div className="search-reminder">
        <button>
          <FaPlus /> Add New
        </button>
        <input type="text" placeholder="search for reminder" />
        <input type="date" />
      </div>
      <div className="reminders-container">
        <p className="pinned">Pinned</p>
        <div className="reminder-card pinned-card">
          <div className="card-header">
            <p>Send Money to Kate</p>
            <label>
              <input type="checkbox" />
            </label>
          </div>
          <div className="card-footer">
            <h6>
              2025-03-16 <span>5:00 pm</span>
            </h6>
            <div className="footer-buttons">
              <button>
                <MdPushPin />
              </button>
              <button>
                <MdModeEditOutline />
              </button>
              <button>
                <MdDelete />
              </button>
            </div>
          </div>
        </div>
        <p className="pinned">Upcoming</p>
        {reminders.map((reminder, index) => (
          <div className="reminder-card">
            <div className="card-header">
              <p>{reminder.name}</p>
              <label>
                <input type="checkbox" />
              </label>
            </div>
            <div className="card-footer">
              <h6>
                {reminder.date} <span>{reminder.time}</span>
              </h6>
              <div className="footer-buttons">
                <button>
                  <MdPushPin />
                </button>
                <button>
                  <MdModeEditOutline />
                </button>
                <button>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
