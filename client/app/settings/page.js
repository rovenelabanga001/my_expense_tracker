"use client";
import { useEffect, useState } from "react";
import PrivateRoute from "../components/PrivateRoute";
import "./page.css";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

export default function Settings() {
  const { data: session, status } = useSession();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isUsernameLoading, setIsUsernameLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");

  const userId = session?.user?.id;

  //prepopulate firstname and lastname fields
  useEffect(() => {
    if (session?.user) {
      console.log("Session user:", session.user);
      const fName = session.user.firstname || "";
      const lName = session.user.lastname || "";
      setFirstName(fName);
      setLastName(lName);
      setOriginalFirstName(fName);
      setOriginalLastName(lName);
    }
  }, [session]);
  //username update logic
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();

    if (
      firstName.trim() === originalFirstName.trim() &&
      lastName.trim() === originalLastName.trim()
    ) {
      toast("No changes detected");
      return;
    }
    if (status !== "authenticated" || !session?.user?.accessToken) {
      toast.error("Not authorized. Please log in again.");
      return;
    }

    setIsUsernameLoading(true);
    try {
      const res = await fetch(`${baseURL}/change-username`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`, //send token
        },
        body: JSON.stringify({ firstname: firstName, lastname: lastName }),
      });

      if (!res.ok) {
        throw new Error("Failed to update username");
      }
      toast.success("Username updated successfully. Log out to see changes");
    } catch (error) {
      console.error("Failed to update username");
      toast.error("Failed! Please try again");
    } finally {
      setIsUsernameLoading(false);
    }
  };
  //password update logic
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const res = await fetch(`${baseURL}/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`, //send token
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (res.status === 401) {
        toast.error("Old password is incorrect");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to change password");
      }
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password");
      toast.error("Failed! Please try again");
    } finally {
      setIsPasswordLoading(false);
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
            <button type="submit" disabled={isUsernameLoading}>
              {isUsernameLoading ? "Loading..." : "Update"}
            </button>
          </form>
        </div>
        <div className="password-container settings-div">
          <h1>Password</h1>
          <form onSubmit={handlePasswordUpdate}>
            <div className="input-container">
              <label>Old Password</label>
              <input
                type="password"
                name="old_password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
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
            <button type="submit" disabled={isPasswordLoading}>
              {isPasswordLoading ? "Loading..." : "Change"}
            </button>
          </form>
        </div>
      </section>
    </PrivateRoute>
  );
}
