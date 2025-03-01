import React from "react";
import PropTypes from "prop-types";
import "./Popup.scss";
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";

const Popup = ({ isOpen, onBtnClick, title, notices }) => {
  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-container">
        <button onClick={onBtnClick}>
          <IonIcon icon={close} className="label" />
        </button>

        <h1>{title}</h1>

        <div className="content">
          {notices.map((notice, index) => (
            <React.Fragment key={index}>
              <div className="notice-line"></div>
              <p>{notice}</p>
            </React.Fragment>
          ))}
        </div>
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

      <div className="overlay" onClick={onBtnClick}></div>
    </div>
  );
};

export default Popup;
