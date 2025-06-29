import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import './History.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function History() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [cycleLength, setCycleLength] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const q = query(collection(db, 'periodEntries'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        let readableDate = '';
        if (data.timestamp && data.timestamp.toDate) {
          readableDate = data.timestamp.toDate().toLocaleString();
        }

        let predictedNextPeriod = '';
        if (data.predictedNextPeriod && data.predictedNextPeriod.toDate) {
          predictedNextPeriod = data.predictedNextPeriod.toDate().toISOString().split('T')[0];
        }

        let date = '';
        if (data.date instanceof Object && data.date.seconds) {
          date = new Date(data.date.seconds * 1000).toISOString().split('T')[0];
        } else {
          date = data.date;
        }

        return {
          id: doc.id,
          ...data,
          date,
          predictedNextPeriod,
          readableDate,
        };
      });

      setEntries(fetched);
      setFilteredEntries(fetched);
      calculateCycleLength(fetched);
    };

    fetchEntries();
  }, []);

  const calculateCycleLength = (data) => {
    const periodDates = data
      .filter((entry) => entry.periodStarted && entry.date)
      .map((entry) => new Date(entry.date));

    if (periodDates.length < 2) {
      setCycleLength(null);
      return;
    }

    const gaps = [];
    for (let i = 1; i < periodDates.length; i++) {
      const diff = (periodDates[i] - periodDates[i - 1]) / (1000 * 60 * 60 * 24);
      gaps.push(diff);
    }

    const avgCycle = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    setCycleLength(avgCycle);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchDate(value);

    if (value === '') {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter((entry) => entry.date === value);
      setFilteredEntries(filtered);
    }
  };

  const chartData = {
    labels: entries.map((e) => e.date),
    datasets: [
      {
        label: 'Mood Score (if numeric)',
        data: entries.map((e) =>
          typeof e.mood === 'number' ? e.mood : null
        ),
        borderColor: '#f06292',
        backgroundColor: '#f8bbd0',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="history-container">
      <h2>📜 Your Period History</h2>

      {cycleLength !== null && (
        <p><strong>🔄 Avg. Cycle Length:</strong> {cycleLength} days</p>
      )}

      <input
        type="date"
        value={searchDate}
        onChange={handleSearch}
        placeholder="Search by date"
        className="date-search-input"
      />

      {filteredEntries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>🩸 Period</th>
                <th>🧠 Mood</th>
                <th>📝 Symptoms</th>
                <th>📓 Notes</th>
                <th>🔮 Predicted</th>
                <th>⏱ Logged At</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.periodStarted ? 'Yes' : 'No'}</td>
                  <td>{entry.mood || 'N/A'}</td>
                  <td>{entry.symptoms?.join(', ') || 'None'}</td>
                  <td>{entry.notes || 'None'}</td>
                  <td>{entry.predictedNextPeriod || 'N/A'}</td>
                  <td>{entry.readableDate || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>📊 Mood Trends (If Numeric)</h3>
      <Line data={chartData} />
    </div>
  );
}

export default History;
