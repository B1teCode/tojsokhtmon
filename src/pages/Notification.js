import React, { useEffect } from 'react';
// import './Notification.css';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Уведомление исчезнет через 3 секунды
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <span>{type === 'success' ? '✔️' : '❌'}</span> {message}
    </div>
  );
};

export default Notification;
