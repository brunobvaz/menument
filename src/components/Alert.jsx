import React, { useEffect } from 'react';

const Alert = ({ message, type = 'info', onClose, autoClose = 3000 }) => {
  useEffect(() => {
    if (message && autoClose) {
      const timer = setTimeout(() => onClose(), autoClose);
      return () => clearTimeout(timer);
    }
  }, [message, autoClose, onClose]);

  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={onClose}
        aria-label="Close"
      ></button>
    </div>
  );
};

export default Alert;


