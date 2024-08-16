import React, { useEffect } from 'react';
import './NotificationList.css';

const NotificationList = ({ notifications, setNotifications }) => {
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(notifications.slice(1)); // Удаляем первое сообщение
      }, 3000);

      return () => clearTimeout(timer); // Очищаем таймер при размонтировании
    }
  }, [notifications, setNotifications]);

  return (
    <div className="notification-list">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <span>{notification.type === 'success' ? '✔️' : '❎'}</span> {notification.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
