"use client";
import "./page.css";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    const res = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      }),
    });
    if (res.ok) {
      toast.success("Signup successfull!", {
        position: "top-center",
        onClose: () => router.push("/signin"),
        autoClose: 3000,
      });
    } else {
      toast.error("Signup failed, Please try again", {
        position: "top-center",
      });
    }
    setLoading(false);
  };
  return (
    <section className="signup-page">
      <div className="welcome">
        <p>
          Welcome! <br /> Start managing your funds with us
        </p>
        <div className="media-icons">
          <a
            href="https://www.instagram.com/rovenel_abanga?igsh=MWJkaG1td2VsbDg3cA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/rovenel-abanga-4ba8b3203?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://x.com/rovenelabanga?s=21"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
          </a>
        </div>
      </div>
      <div className="signup-form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? (
              <span className="flex items-center gap-2">
                <FaSpinner className="animate-spin" /> Loading...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="link-section">
          Already have an account?{" "}
          <span>
            <Link href="/signin">Sign In</Link>
          </span>
        </p>
        <ToastContainer />
      </div>
    </section>
  );
}
