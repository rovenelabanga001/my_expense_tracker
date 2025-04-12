"use client";
import PrivateRoute from "../components/PrivateRoute";
import "./page.css";
import { useSession } from "next-auth/react";
export default function Settings() {
  const { data: session, status } = useSession();
  return (
    <PrivateRoute>
      <section className="settings-section">
        <h1>Personal Settings</h1>
        <div className="details-container settings-div">
          <h1>User Details</h1>
          <form>
            <div className="input-container">
              <label>First Name</label>
              <input name="first_name" placeholder="First Name" />
            </div>
            <div className="input-container">
              <label>Last Name</label>
              <input name="last_name" placeholder="Last Name" />
            </div>
            <button type="submit">Update</button>
          </form>
        </div>
        <div className="password-container settings-div">
          <h1>Password</h1>
          <form>
            <div className="input-container">
              <label>New Password</label>
              <input name="new_password" placeholder="New Password" required />
            </div>
            <div className="input-container">
              <label>Confirm Password</label>
              <input
                name="confrim_password"
                placeholder="Confirm Password"
                required
              />
            </div>
            <button type="submit">Change</button>
          </form>
        </div>
      </section>
    </PrivateRoute>
  );
}
