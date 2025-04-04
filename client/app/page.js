"use client";
import "./page.css";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { TiTick } from "react-icons/ti";
import features from "@/public/features";

export default function Home() {
  const [message, setMessage] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [showError, setShowError] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const maxWords = 150;
  const form = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["introduction", "features", "contact-us"];

      let currentSection = "";

      sections.forEach((section) => {
        const element = document.getElementById(section);
        const rect = element.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= 0) {
          currentSection = section;
        }
      });

      setActiveLink(currentSection);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e, section) => {
    e.preventDefault();
    setActiveLink(section);
    const element = document.getElementById(section);
    window.scrollTo({
      top: element.offsetTop,
      behavior: "smooth",
    });
  };
  const handleMessageChange = (e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= maxWords || e.target.value.endsWith(" ")) {
      setMessage(e.target.value);
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_bvxljos", //service_id
        "template_0wvurka", //template_id
        form.current,
        "3va47kJUm5_KFLR65" //user_id
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
          setShowPopUp(true);
          form.current.reset();
          setMessage("");
          setTimeout(() => setShowPopUp(false), 3000);
        },
        (error) => {
          console.error("Failed to send Email", error);
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      );
  };
  return (
    <section>
      <header>
        <nav>
          <div className="logo-container">
            <h1>LOGO</h1>
          </div>
          <div className="nav-links">
            <ul>
              <li>
                <a
                  href="#introduction"
                  className={activeLink === "introduction" ? "active" : ""}
                  onClick={(e) => handleLinkClick(e, "introduction")}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className={activeLink === "features" ? "active" : ""}
                  onClick={(e) => handleLinkClick(e, "features")}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact-us"
                  className={activeLink === "contact-us" ? "active" : ""}
                  onClick={(e) => handleLinkClick(e, "contact-us")}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="nav-buttons">
            <button className="log-btn">Login</button>
            <button className="log-btn">Sign Up</button>
          </div>
        </nav>
      </header>
      <div className="body">
        <div className="introduction div-padding" id="introduction">
          <h5 className="heading">Track. Save. Grow</h5>
          <h2>
            Track your expenses, save smarter, and grow your financial future
            with ease
          </h2>
          <p className="div-paragraph">
            Our expense tracker helps you manage your finances by tracking{" "}
            <br />
            income and expenses and gaining insights into your spending habits.{" "}
            <br />
            Stay organized and in control effortlessly
          </p>
          <button className="log-btn">Sign Up</button>
        </div>
        <div className="features div-padding" id="features">
          <div className="features-header ">
            <h5 className="heading">Why Us?</h5>
            <p className="div-paragraph">
              Take control of your finances with ease!
              <br /> Our expense tracker helps you track spending, analyze
              trends, and set budgets—all in one simple app.
              <br /> With real-time updates, secure data, and a user-friendly
              interface, managing your money has never been easier.
              <br /> Stay organized, make smarter financial decisions, and
              achieve your savings goals effortlessly.
            </p>
          </div>
          <div className="features-body">
            {features.map((feature, index) => (
              <div className="app-feature" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-info">
                  <h5>{feature.title}</h5>
                  <p className="div-paragraph">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="contact-us div-padding" id="contact-us">
          <h5 className="heading">Contact Us</h5>
          <form ref={form} onSubmit={sendEmail}>
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              required
            />
            <input
              type="email"
              placeholder="Email Adress"
              name="email"
              required
            />
            <input
              type="number"
              placeholder="Phone Number(Optional)"
              name="phone"
            />
            <textarea
              id="description"
              placeholder="Type your message here..."
              name="message"
              value={message}
              onChange={handleMessageChange}
              required
            ></textarea>
            <p>
              {message.trim().split(/\s+/).filter(Boolean).length} / {maxWords}{" "}
              words
            </p>
            <button type="submit" className="log-btn">
              Send
            </button>
          </form>
          {/*SUCCESS POP UP */}
          {showPopUp && (
            <div className="sent-popup">
              <TiTick />
              <p>Message sent successfully!</p>
            </div>
          )}
          {/* ERROR POPUP */}
          {showError && (
            <div className="sent-popup error">
              <p>Failed, please try again</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
