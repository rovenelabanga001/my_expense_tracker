"use client";
import "./Noresults.css";
export default function () {
  const magnifySvg = "assets/magnify.svg";
  return (
    <div className="no-results">
      <img src={magnifySvg} alt="Search" />
      <p>No results found, try something else</p>
    </div>
  );
}
