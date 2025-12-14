import React from 'react';

function Assessment() {
  // Example scenario
  const scenario = "You're at a checkpoint. A driver offers ₦2,000 to pass without proper papers. What do you do?";

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f9f9f9', borderRadius: 8 }}>
      <h2 style={{ color: '#1976d2', fontWeight: 700 }}>Assessment</h2>
      <p>{scenario}</p>
      <ul>
        <li>Accept the money</li>
        <li>Refuse and follow procedure</li>
        <li>Report the incident</li>
      </ul>
    </div>
  );
}

export default Assessment;
