"use client";
import "./page.css";
import features from "@/public/features";
export default function Home() {
  return (
    <section>
      <header>
        <nav>
          <div className="logo-container">
            <h1>LOGO</h1>
          </div>
          <div className="nav-links">
            <ul>
              <li>Link 1</li>
              <li>Link 2</li>
              <li>Link 3</li>
            </ul>
          </div>
          <div className="nav-buttons">
            <button className="log-btn">Login</button>
            <button className="log-btn">Sign Up</button>
          </div>
        </nav>
      </header>
      <div className="body">
        <div className="introduction div-padding">
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
        <div className="features div-padding">
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
            {features.map((feature) => (
              <div className="app-feature">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-info">
                  <h5>{feature.title}</h5>
                  <p className="div-paragraph">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="contact-us div-padding">
          <h5 className="heading">Contact Us</h5>
          <form>
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
            <input type="email" placeholder="Email Adress" required />
            <input type="number" placeholder="Phone Number(Optional)" />
            <input
              type="text"
              placeholder="Description"
              id="description"
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}
