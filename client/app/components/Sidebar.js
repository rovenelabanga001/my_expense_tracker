"use client";
import Link from "next/link";
import "./Sidebar.css";
import { usePathname } from "next/navigation";
import { MdSpaceDashboard } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { AiFillSchedule } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="user"></div>
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
          <button>
            <CiLogout />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
