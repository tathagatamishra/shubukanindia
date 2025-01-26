import React from "react";
import PropTypes from "prop-types";
import "./Popup.scss";
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";

const Popup = ({ isOpen, onClose, title, notices, ...props }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-main">
      <div className="popup-container">
        <button onClick={onClose}>
          <IonIcon
            icon={close}
            className="label"
            onClick={() => {
              props.setIsOpen(false);
              props.setShowNav(true);
            }}
          />
        </button>

        <h1>{title}</h1>
        
        <div className="content">
          {notices.map((notice, index) => (
            <React.Fragment key={index}>
              <hr />
              <p>{notice}</p>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="overlay" onClick={onClose}></div>
    </div>
  );
};

Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notices: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Popup;
