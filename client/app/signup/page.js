"use client";
import "./page.css";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
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
        <form>
          <input type="text" placeholder="First Name" required />
          <input type="text" placeholder="Last Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" />
          <button type="submit">Sign Up</button>
        </form>
        <p className="link-section">
          Don't have an account?{" "}
          <span>
            <Link href="/signin" >
              Sign In
            </Link>
          </span>
        </p>
      </div>
    </section>
  );
}
