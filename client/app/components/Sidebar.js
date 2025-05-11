"use client";
import Link from "next/link";
import "./Sidebar.css";
import { usePathname } from "next/navigation";
import { MdSpaceDashboard } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { AiFillSchedule } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogOut = () => {
    toast(
      (t) => (
        <div className="logout-toast">
          <p>Are you sure you want to logout?</p>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                signOut({ callbackUrl: "/signin" });
              }}
              style={{
                backgroundColor: "rgb(19, 1, 63)",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                backgroundColor: "rgb(19, 1, 63)",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };
  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <MdMenu />
      </button>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="user"></div>
        <button className="close" onClick={() => setSidebarOpen(false)}>
        <IoIosCloseCircleOutline />
        </button>
        <ul className="nav-links">
          <li>
            <Link
              href="/dashboard"
              className={pathname === "/dashboard" ? "active" : ""}
            >
              <MdSpaceDashboard />
              <p>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link
              href="/transactions"
              className={pathname === "/transactions" ? "active" : ""}
            >
              <GiMoneyStack />
              <p>Transactions</p>
            </Link>
          </li>
          <li>
            <Link
              href="/budgets"
              className={pathname === "/budgets" ? "active" : ""}
            >
              <AiFillSchedule />
              <p>Budgets</p>
            </Link>
          </li>
          <li>
            <Link
              href="/reminders"
              className={pathname === "/reminders" ? "active" : ""}
            >
              <IoIosNotifications />
              <p>Reminders</p>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={pathname === "/settings" ? "active" : ""}
            >
              <IoSettings />
              <p>Settings</p>
            </Link>
          </li>
          <li>
            <button onClick={handleLogOut}>
              <CiLogout />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
