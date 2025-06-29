import React, { useEffect, useState } from 'react';
import './Recommendations.css';

function Recommendations() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/data/recommendations.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="recommendations-container">
      <h2>💡 Phase Recommendations</h2>
      <div className="tips-grid">
        {Object.entries(data).map(([phase, tips]) => (
          <div key={phase} className="tip-card">
            <h3>{phase} 🌀</h3>
            <ul>
              {tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
