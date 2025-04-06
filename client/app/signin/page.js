"use client";
import "./page.css";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
      toast.success("Signin successfull", {
        position: "top-center",
        onClose: () => router.push("/dashboard"),
        autoClose: 3000,
      });
    } else {
      toast.error("Wrong username or password, please try again", {
        position: "top-center",
      });
    }
    setLoading(false);
  };
  return (
    <section className="login-page">
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
      <div className="login-form-container">
        <div>
          <h2>Sign In</h2>
          <p>Enter your details to access your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
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
          Don't have an account?{" "}
          <span>
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </span>
        </p>
      </div>
      <ToastContainer />
    </section>
  );
}
