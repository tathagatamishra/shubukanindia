import React from 'react';
import PropTypes from 'prop-types';
import './Popup.scss';

const Popup = ({ isOpen, onClose, notices }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-container">
      <button onClick={onClose}>X</button>
      <h1>Notice</h1>
      <div className="content">
        {notices.map((notice, index) => (
          <React.Fragment key={index}>
            <hr />
            <p>{notice}</p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  notices: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Popup;
