// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Tracker from './pages/Tracker';
import History from './pages/History'; 
import CalendarPage from './pages/CalendarPage';
import CalendarView from './components/CalendarView';
import InsightsDashboard from './components/InsightsDashboard';
import PhaseTips from './components/PhaseTips';
import MoodChart from './components/MoodChart';
import SearchLogs from './components/SearchLogs';
import Notifications from './components/Notifications';
import Recommendations from './components/Recommendations';
import PMSForm from "./components/PMSForm";
import About from './components/About';


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/history" element={<History />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/calendar-view" element={<CalendarView />} />
          <Route path="/insights" element={<InsightsDashboard />} />
          <Route path="/tips" element={<PhaseTips />} />
          <Route path="/dashboard" element={<InsightsDashboard />} />
          <Route path="/mood-chart" element={<MoodChart />} />
          <Route path="/search" element={<SearchLogs />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/pms-form" element={<PMSForm />} />
          <Route path="/about" element={<About />} />
       

          



        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
