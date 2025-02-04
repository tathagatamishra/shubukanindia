import React, { useEffect, useState } from "react";
import "./Admin.scss";
import { shubukan_api } from "../../config";
import axios from "axios";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = (token) => {
    axios
      .post(
        `${shubukan_api}/admin/validate`,
        { token: token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          window.location.href = "/admin/auth";
          return;
        }
      })
      .catch((err) => {
        setIsAdmin(false);
        window.location.href = "/admin/auth";
        return;
      });
  };

  // authenticating admin
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      checkAdmin(token);
    } else {
      setIsAdmin(false);
      window.location.href = "/admin/auth";
    }
  }, []);

  return isAdmin ? (
    <div className="AdminDashboard">
      <div className="header">
        <p>Dashboard</p>
      </div>
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

      <div className="dashBoard"></div>
    </div>
  ) : null;
}
