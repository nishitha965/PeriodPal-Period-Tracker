import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './CalendarView.css';

function CalendarView() {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const querySnapshot = await getDocs(collection(db, 'periodEntries'));
      const fetched = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(fetched);
    };
    fetchEntries();
  }, []);

  const tileClassName = ({ date }) => {
    const formatted = date.toISOString().split('T')[0];
    const matched = entries.some((e) => e.date === formatted && e.periodStarted);
    return matched ? 'highlight' : null;
  };

  const handleDateClick = (date) => {
    const formatted = date.toISOString().split('T')[0];
    const entry = entries.find((e) => e.date === formatted);
    setSelectedDate(formatted);
    setInfo(entry || null);
  };

  return (
    <div className="calendar-view-container">
      <h2>🗓 Calendar Overview</h2>
      <Calendar onClickDay={handleDateClick} tileClassName={tileClassName} />

      {info && (
        <div className="calendar-info-card">
          <h3>📅 {selectedDate}</h3>
          <p><strong>Period:</strong> {info.periodStarted ? 'Yes' : 'No'}</p>
          <p><strong>Mood:</strong> {info.mood || 'N/A'}</p>
          <p><strong>Symptoms:</strong> {info.symptoms?.join(', ') || 'None'}</p>
          <p><strong>Notes:</strong> {info.notes || 'None'}</p>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
