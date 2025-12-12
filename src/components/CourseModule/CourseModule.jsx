import React from 'react';

function CourseModule() {
  // Example micro modules
  const courses = [
    'Bribery Awareness',
    'Harassment Prevention',
    'Abuse of Authority',
    'Data Privacy',
    'Conflicts of Interest',
    'Workplace Ethics'
  ];

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2rem', background: '#f9f9f9', borderRadius: 8 }}>
      <h2 style={{ color: '#1976d2', fontWeight: 700 }}>Micro Compliance Modules</h2>
      <ul>
        {courses.map((c, i) => (
          <li key={i} style={{ marginBottom: 8 }}>{c}</li>
        ))}
      </ul>
    </div>
  );
}

export default CourseModule;
