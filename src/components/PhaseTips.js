import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './PhaseTips.css';

const tipsByPhase = {
  Menstrual: [
    '🧘 Rest and take it easy.',
    '🍵 Drink warm teas like ginger or chamomile.',
    '🩸 Use heating pads for cramps.',
  ],
  Follicular: [
    '🏃‍♀️ Great time for workouts!',
    '🧠 Plan and start new projects.',
    '🥗 Eat protein and fiber-rich foods.',
  ],
  Ovulation: [
    '💬 Social energy is high—schedule interviews or hangouts.',
    '🍳 Eat healthy fats and lean protein.',
    '💖 Practice self-confidence boosts.',
  ],
  Luteal: [
    '🧘 Calm exercises like yoga or walking.',
    '🥕 Eat magnesium-rich foods like leafy greens.',
    '🧁 Be kind to yourself—mood swings are normal.',
  ],
};

function getCycleDay(latestPeriodDate) {
  const today = new Date();
  const periodStart = new Date(latestPeriodDate);
  const diffTime = Math.abs(today - periodStart);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getPhase(cycleDay) {
  if (cycleDay <= 5) return 'Menstrual';
  if (cycleDay <= 13) return 'Follicular';
  if (cycleDay <= 16) return 'Ovulation';
  return 'Luteal';
}

function PhaseTips() {
  const [phase, setPhase] = useState('');
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchLatestPeriod = async () => {
      const snapshot = await getDocs(collection(db, 'periodEntries'));
      const entries = snapshot.docs
        .map((doc) => doc.data())
        .filter((entry) => entry.periodStarted)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (entries.length > 0) {
        const cycleDay = getCycleDay(entries[0].date);
        const currentPhase = getPhase(cycleDay);
        setPhase(currentPhase);
        setTips(tipsByPhase[currentPhase]);
      }
    };

    fetchLatestPeriod();
  }, []);

  return (
    <div className="phase-tips-container">
      <h2>💡 Personalized Tips</h2>
      {phase ? <h3>You’re in your <span>{phase}</span> phase</h3> : <p>Loading...</p>}
      <ul>
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

export default PhaseTips;
