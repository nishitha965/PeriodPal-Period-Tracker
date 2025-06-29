import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Tracker.css';

function Tracker() {
  const [date, setDate] = useState('');
  const [periodStarted, setPeriodStarted] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customSymptom, setCustomSymptom] = useState('');

  const symptomOptions = [
    'Muscle aches', 'Joint pain', 'Headaches', 'Acne', 'Abdominal cramps',
    'Lower back pain', 'Trouble sleeping', 'Low energy, fatigue',
    'Bloating, fluid retention', 'Crying'
  ];

  const moodOptions = ['Happy', 'Sad', 'Irritated', 'Anxious', 'Insecure', 'Confident'];

  const handleSymptomToggle = (value) => {
    setSymptoms((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const handleCustomSymptomAdd = () => {
    const trimmed = customSymptom.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
      setCustomSymptom('');
    }
  };

  const handleMoodChange = (emotion, value) => {
    setMood(prev => ({
      ...prev,
      [emotion]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date(date);
    const nextPredictedPeriod = new Date(currentDate);
    nextPredictedPeriod.setDate(currentDate.getDate() + 28);

    const entry = {
      date,
      periodStarted,
      symptoms,
      notes,
      mood,
      createdAt: new Date(),
      readableDate: new Date().toLocaleString(),
      predictedNextPeriod: nextPredictedPeriod.toISOString(),
    };

    try {
      setLoading(true);
      await addDoc(collection(db, 'periodEntries'), entry);
      alert('✅ Entry saved!');
      setDate('');
      setPeriodStarted(false);
      setSymptoms([]);
      setNotes('');
      setMood({});
    } catch (error) {
      console.error('❌ Error saving entry:', error);
      alert('Something went wrong while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracker-container">
      <h2>Track Your Cycle</h2>

      <form className="tracker-form" onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div>
          <label>Period Started?</label>
          <input
            type="checkbox"
            checked={periodStarted}
            onChange={() => setPeriodStarted(!periodStarted)}
          />
        </div>

        <div className="dropdown-wrapper">
          <label>Symptoms:</label>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="dropdown-toggle"
          >
            Select Symptoms ▼
          </button>
          {showDropdown && (
            <div className="dropdown-list">
              {symptomOptions.map((symptom) => (
                <label key={symptom}>
                  <input
                    type="checkbox"
                    value={symptom}
                    checked={symptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                  />
                  {symptom}
                </label>
              ))}
            </div>
          )}

          <div className="custom-symptom">
            <input
              type="text"
              placeholder="Add custom symptom"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
            />
            <button type="button" className="add-btn" onClick={handleCustomSymptomAdd}>
              Add
            </button>
          </div>

          {symptoms.length > 0 && (
            <div className="selected-symptoms">
              <strong>Selected:</strong> {symptoms.join(', ')}
            </div>
          )}
        </div>

        <div>
          <label>Mood:</label>
          <div className="mood-slider-wrapper">
            {moodOptions.map((m) => (
              <div key={m} className="mood-slider">
                <span>{m}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={mood[m] || 1}
                  onChange={(e) => handleMoodChange(m, Number(e.target.value))}
                  className="slider"
                />
                <span>{mood[m] || 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            cols="40"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}

export default Tracker;
