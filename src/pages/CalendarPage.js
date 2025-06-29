// src/pages/CalendarPage.js
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

function CalendarPage() {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [entryForDate, setEntryForDate] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('periodEntries')) || [];
    setEntries(saved);
  }, []);

  const onDateChange = (date) => {
    setSelectedDate(date);
    const formatted = format(date, 'yyyy-MM-dd');

    const entry = entries.find(e => e.date === formatted);
    setEntryForDate(entry || null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Period Calendar View</h2>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        tileClassName={({ date }) => {
          const formatted = format(date, 'yyyy-MM-dd');
          return entries.some(e => e.date === formatted) ? 'highlight' : null;
        }}
      />
      {entryForDate && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#fff8fb'
        }}>
          <h3>Log for {entryForDate.date}</h3>
          <p><strong>Period Started:</strong> {entryForDate.periodStarted ? 'Yes' : 'No'}</p>
          <p><strong>Symptoms:</strong> {entryForDate.symptoms.join(', ') || 'None'}</p>
          <p><strong>Notes:</strong> {entryForDate.notes || 'No notes'}</p>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
