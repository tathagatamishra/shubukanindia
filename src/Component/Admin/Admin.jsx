import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Admin.scss";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  // authenticating admin
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setIsAdmin(false);
      window.location.href = "/admin/auth";
    } else {
      const decodeToken = jwtDecode(token);
      console.log(decodeToken);
      
      if (decodeToken.exp * 1000 < Date.now()) {
        setIsAdmin(false);
        window.location.href = "/admin/auth";
      } else {
        setIsAdmin(true);
      }
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
