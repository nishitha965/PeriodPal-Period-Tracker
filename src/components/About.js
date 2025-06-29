// src/components/About.js
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>About PeriodPal</h2>
      <p>
        PeriodPal is a user-friendly menstrual tracking app designed to help you monitor your cycle, moods, and symptoms with ease.
      </p>
      <ul>
        <li><strong>Tracker:</strong> Log daily symptoms and moods.</li>
        <li><strong>History:</strong> View your past cycle logs.</li>
        <li><strong>Calendar:</strong> Get a monthly overview of your periods and symptoms.</li>
        <li><strong>Insights:</strong> Visual trends like mood and symptom charts.</li>
        <li><strong>PMS Prediction:</strong> AI-based prediction of premenstrual syndrome based on inputs.</li>
        <li><strong>Notifications:</strong> Get reminders and health tips.</li>
        <li><strong>Recommendations:</strong> Get cycle-based self-care tips.</li>
      </ul>
    </div>
  );
};

export default About;