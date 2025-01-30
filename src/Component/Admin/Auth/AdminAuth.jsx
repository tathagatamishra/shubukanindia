import React, { useEffect } from "react";
import "./AdminAuth.scss";

export default function AdminAuth({ setShowNav, setShowFoot }) {
  useEffect(() => {
    setShowNav(false);
    setShowFoot(false);
  }, []);

  return (
    <div className="AdminAuth">
      <form className="popup-container" autoComplete="off">
        <div className="input-div">
          <input type="text" className="username" autocomplete="false" />
          <div className="line"></div>
        </div>

        <div className="input-div">
          <input type="password" className="password" autocomplete="false" />
          <div className="line"></div>
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
