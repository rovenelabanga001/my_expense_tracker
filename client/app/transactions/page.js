"use client";
import "./page.css";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import Loadingsvg from "../components/Loadingsvg";
import Noresults from "../components/Noresults";

export default function Transactions() {
  const magnifySvg = "assets/magnify.svg";
  const today = new Date().toISOString().split("T")[0];

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3001/transactions");

        if (!response.ok) {
          throw new Error(`HTTP error! Status ${response.status}`);
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions", error);
        setError("Failed to load transactions. Please try again later");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  //handle type filtering
  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.includes(searchQuery);

    const matchesType =
      selectedType === "All" ||
      t.type.toLowerCase() === selectedType.toLowerCase();
    const matchesDate = selectedDate ? t.date === selectedDate : true;
    return matchesSearch && matchesDate && matchesType;
  });
  return loading ? (
    <Loadingsvg />
  ) : (
    <section className="transactions-page">
      <div className="page-header">
        <h1>My Transactions</h1>
        <h5>
          Today,{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h5>
      </div>
      <div className="add-transaction">
        <div className="add">
          <button>
            <FaPlus />
            Add New
          </button>
        </div>
        <div className="search-transactions">
          <input
            type="text"
            placeholder="search by name, type, amount"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-date">
          <input
            type="date"
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="filter-type">
          {["All", "Income", "Expense"].map((type) => (
            <button
              key={type}
              className={selectedType === type ? "active" : ""}
              onClick={() => handleTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="transactions-container">
        <div className="transaction-row header">
          <div>Name</div>
          <div>Type</div>
          <div>Amount</div>
          <div>Date</div>
        </div>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, index) => (
            <div className="transaction-row" key={index}>
              <div>{tx.name}</div>
              <div className={tx.type === "Income" ? "income" : "expense"}>
                {tx.type}
              </div>
              <div>{tx.amount}</div>
              <div>{tx.date}</div>
              <div>
                <button>
                  <MdEdit />
                </button>
              </div>
              <div>
                <button>
                  <MdDelete />
                </button>
              </div>
            </div>
          ))
        ) : (
          <Noresults />
        )}
      </div>
    </section>
  );
}
