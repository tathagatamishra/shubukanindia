import React, { useState, useEffect } from "react";
import "./AdminAuth.scss";
import { use } from "react";

export default function AdminAuth({ setShowNav, setShowFoot }) {
  useEffect(() => {
    setShowNav(false);
    setShowFoot(false);
  }, []);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // if input is on focus or value is not empty then line width will be 100%
  useEffect(() => {
    if (userName) {
      document.querySelectorAll(".line1").forEach((line) => {
        line.style.width = "100%";
      });
    }
    if (password) {
      document.querySelectorAll(".line2").forEach((line) => {
        line.style.width = "100%";
      });
    }
  });

  useEffect(() => {
    document.querySelector(".username").addEventListener("focus", () => {
      document.querySelector(".line1").style.width = "100%";
    });
    document.querySelector(".password").addEventListener("focus", () => {
      document.querySelector(".line2").style.width = "100%";
    });
  });

  return (
    <div className="AdminAuth">
      <form className="popup-container" autoComplete="off">
        <p>Admin Auth</p>
        <div className="input-div">
          <input
            type="text"
            autocomplete="false"
            className="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <div className="line1"></div>
        </div>

        <div className="input-div">
          <input
            type="password"
            autocomplete="false"
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="line2"></div>
        </div>
      </form>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        height="0"
        width="0"
      >
        <defs>
          <filter id="wobble">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".06"
              numOctaves="4"
            />
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
        </defs>
      </svg>

      <div className="overlay"></div>
    </div>
  );
}
