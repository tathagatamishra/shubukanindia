import { useEffect, useState } from "react";
import "./Toast.scss";

// Custom Toast Component
export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`custom-toast ${type}`}>
      <div className="toast-content">
        <span>{message}</span>
        <button onClick={onClose} className="toast-close">
          ×
        </button>
      </div>
    </div>
  );
}
