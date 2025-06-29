import React from 'react';
import './Notifications.css';

function Notifications() {
  // Example notification data
  const notifications = [
    {
      id: 1,
      message: "It's time to log today’s period symptoms.",
      timestamp: 'Today at 9:00 AM'
    },
    {
      id: 2,
      message: "Ovulation is predicted in 2 days!",
      timestamp: 'Yesterday at 8:30 PM'
    },
    {
      id: 3,
      message: "Stay hydrated and get rest 🌸",
      timestamp: '2 days ago'
    }
  ];

  return (
    <div className="notifications-container">
      <h2>🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="empty-message">No new notifications</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((note) => (
            <li key={note.id} className="notification-item">
              <div className="message">{note.message}</div>
              <div className="timestamp">{note.timestamp}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
