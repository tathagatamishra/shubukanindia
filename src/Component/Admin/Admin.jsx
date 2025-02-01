import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.scss";

export default function Admin({ setShowNav, setShowFoot }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setShowNav(false);
    setShowFoot(false);
  }, []);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus === "true") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      navigate("/admin/auth");
    }
  }, [navigate]);

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
