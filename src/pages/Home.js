// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Your Cycle Companion </h1>

      <div className="circle-wrapper">
        <div className="circle-button" onClick={() => navigate('/tracker')}>
          Track Today
        </div>
      </div>

      <div className="dashboard-links">
        <button onClick={() => navigate('/calendar')}>📅 Calendar</button>
        <button onClick={() => navigate('/history')}>📖 History & Insights</button>
        <button onClick={() => navigate('/recommendations')}>💡 Recommendations</button>
        <button onClick={() => navigate('/notifications')}>🔔 Notifications</button>
        <button onClick={() => navigate('/insights')}>📊 Cycle Insights</button>
        <button onClick={() => navigate('/tips')}>🧘‍♀️ Phase Tips</button>
        <button onClick={() => navigate('/mood-chart')}>📈 Mood Chart</button>
        <button onClick={() => navigate('/search')}>🔍 Search Logs</button>
        <button onClick={() => navigate('/pms-form')}>🩺 Track Symptoms</button>

      </div>
    </div>
  );
}

export default Home;
