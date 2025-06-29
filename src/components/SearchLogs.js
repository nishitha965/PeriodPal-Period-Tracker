import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function SearchLogs() {
  const [searchDate, setSearchDate] = useState('');
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const snapshot = await getDocs(collection(db, 'periodEntries'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    };
    fetchEntries();
  }, []);

  const handleSearch = () => {
    if (!searchDate) return;
    const results = entries.filter((entry) =>
      new Date(entry.date).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
    );
    setFilteredEntries(results);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h2>🔍 Search Logs by Date</h2>
      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        style={{
          padding: '0.5rem',
          borderRadius: '5px',
          marginRight: '10px',
          border: '1px solid maroon'
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'maroon',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Search
      </button>

      {filteredEntries.length > 0 ? (
        <div style={{ marginTop: '2rem' }}>
          <h4>📅 Results for {new Date(searchDate).toLocaleDateString()}</h4>
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: '#f8f8f8',
                margin: '10px 0',
                padding: '1rem',
                borderRadius: '8px',
                borderLeft: '5px solid maroon'
              }}
            >
              <p><strong>Phase:</strong> {entry.phase}</p>
              <p><strong>Symptoms:</strong> {entry.symptoms?.join(', ')}</p>
              <p><strong>Mood:</strong> {entry.mood}</p>
            </div>
          ))}
        </div>
      ) : (
        searchDate && <p style={{ marginTop: '1rem' }}>No logs found for this date.</p>
      )}
    </div>
  );
}

export default SearchLogs;
