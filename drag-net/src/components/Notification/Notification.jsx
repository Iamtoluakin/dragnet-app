import React from 'react';

function Notification() {
  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', background: '#f9f9f9', borderRadius: 8 }}>
      <h2 style={{ color: '#1976d2', fontWeight: 700 }}>Notifications</h2>
      <ul>
        <li>Quarterly scenario test assigned</li>
        <li>New compliance module available</li>
      </ul>
    </div>
  );
}

export default Notification;
