"use client";
import React, { useState, useEffect } from "react";
import "./AdminAuth.scss";
import axios from "axios";
import { shubukan_api } from "../../../config";

export default function AdminAuth() {
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

  // adminLogin
  const adminLogin = (e) => {
    e.preventDefault();

    shubukan_api
      .post(
        `/admin/auth`,
        {
          id: userName,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          localStorage.setItem("adminToken", res.data.token);
          window.location.href = "/admin";
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="AdminAuth">
      <form className="popup-container" autoComplete="off">
        <div className="input-div">
          <input
            type="text"
            autoComplete="false"
            className="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <div className="line1"></div>
        </div>

        <div className="input-div">
          <input
            type="password"
            autoComplete="false"
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="line2"></div>
        </div>

        {userName && password && (
          <button type="submit" onClick={(e) => adminLogin(e)}>
            LOGIN
          </button>
        )}
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

      {/* <div className="overlay"></div> */}
    </div>
  );
}
