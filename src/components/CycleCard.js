// src/components/CycleCard.js
import React from 'react';
import './CycleCard.css';

function CycleCard({ date, phase, symptoms }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: '#fff8fb',
      position: 'relative'
    }}>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Phase:</strong> {phase}</p>
      <p><strong>Symptoms:</strong> {symptoms}</p>
    </div>
  );
}

export default CycleCard;