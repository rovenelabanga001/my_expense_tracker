"use client";
import { useEffect, useState } from "react";
import PrivateRoute from "../components/PrivateRoute";
import "./page.css";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
export default function Settings() {
  const { data: session, status } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userId = session?.user?.id;
  console.log(userId);
  //prepopulate firstname and lastname fields
  useEffect(() => {
    if (session?.user) {
      setFirstName(session.user.firstname || "");
      setLastName(session.user.lastname || "");
    }
  }, [session]);
  //username update logic
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firtsname: firstName, lastname: lastName }),
      });

      if (!res.ok) {
        throw new Error("Failed to update username");
      }
      toast.success("Username updated successfully");
    } catch (error) {
      console.error("Failed to update username");
      toast.error("Failed! Please try again");
    }
  };
  //password update logic
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
    }

    try {
      const res = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) {
        throw new Error("Failed to change password");
      }
      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password");
      toast.error("Failed! Please try again");
    }
  };
  return (
    <PrivateRoute>
      <section className="settings-section">
        <h1>Personal Settings</h1>
        <div className="details-container settings-div">
          <h1>User Details</h1>
          <form onSubmit={handleUsernameUpdate}>
            <div className="input-container">
              <label>First Name</label>
              <input
                name="first_name"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label>Last Name</label>
              <input
                name="last_name"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <button type="submit">Update</button>
          </form>
        </div>
        <div className="password-container settings-div">
          <h1>Password</h1>
          <form onSubmit={handlePasswordUpdate}>
            <div className="input-container">
              <label>New Password</label>
              <input
                type="password"
                name="new_password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confrim_password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
