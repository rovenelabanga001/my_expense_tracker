"use client";
import "./page.css";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import Loadingsvg from "../components/Loadingsvg";
import Noresults from "../components/Noresults";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Modal from "../components/Modal";
import AddTransactionForm from "../components/AddTransactionForm";
import toast from "react-hot-toast";
import EditTransactionForm from "../components/EditTransactionForm";

export default function Transactions() {
  const magnifySvg = "assets/magnify.svg";
  const today = new Date().toISOString().split("T")[0];

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  //protect route
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" && !session) {
      router.push("/signin");
    }
  }, [status, session]);

  //fetch transactions
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchTransactions = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(
            `${baseURL}/users/${session.user.id}/transactions`
          );
          if (!response.ok)
            throw new Error(`HTTP error! Status ${response.status}`);

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
    }
  }, [session, status]);

  //handle type filtering
  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.toString().includes(searchQuery);

    const matchesType =
      selectedType === "All" ||
      t.type.toLowerCase() === selectedType.toLowerCase();
    const matchesDate = selectedDate ? t.date === selectedDate : true;
    return matchesSearch && matchesDate && matchesType;
  });

  //add transaction function
  const handleAddTransaction = (newTransaction) => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);
  };

  //update transaction function
  const handleUpdate = (updatedTransction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransction.id ? updatedTransction : t))
    );
  };

  //DELETE reequest handling
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${baseURL}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete transaction");

      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error(error.message);
      toast.error("Failed! Please try again");
    }
  };

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
          <Modal
            trigger={
              <button>
                <FaPlus />
                Add New
              </button>
            }
          >
            {({ close }) => (
              <AddTransactionForm
                onClose={close}
                onAddTransaction={handleAddTransaction}
              />
            )}
          </Modal>
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
              <div>
                {" "}
                {new Date(tx.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                {/* {tx.date} */}
              </div>
              <div>
                <Modal
                  trigger={
                    <button>
                      <MdEdit />
                    </button>
                  }
                >
                  {({ close }) => (
                    <EditTransactionForm
                      onClose={close}
                      transaction={tx}
                      onUpdate={handleUpdate}
                    />
                  )}
                </Modal>
              </div>
              <div>
                <button onClick={() => handleDelete(tx.id)}>
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
