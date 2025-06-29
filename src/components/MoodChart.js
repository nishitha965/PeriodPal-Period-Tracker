import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function MoodChart() {
  const [chartData, setChartData] = useState({});

  // Mapping mood strings to numeric scores
  const moodMap = {
    'very happy': 10,
    'happy': 8,
    'good': 6,
    'neutral': 5,
    'sad': 3,
    'very sad': 1,
    'angry': 2,
    'anxious': 4,
    'stressed': 2,
  };

  useEffect(() => {
    const fetchMoodData = async () => {
      const snapshot = await getDocs(collection(db, 'periodEntries'));
      const sortedEntries = snapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const labels = sortedEntries.map(entry => new Date(entry.date).toLocaleDateString());

      const moodScores = sortedEntries.map(entry => {
        const mood = entry.mood?.toLowerCase();
        return moodMap[mood] ?? 0; // Default to 0 if mood not found
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Mood Score',
            data: moodScores,
            borderColor: '#7e57c2',
            backgroundColor: '#d1c4e9',
            tension: 0.3,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#7e57c2',
          }
        ]
      });
    };

    fetchMoodData();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>📈 Mood Tracker Over Time</h2>
      {chartData.labels && chartData.labels.length > 0 ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Mood Trends During Cycle' }
            },
            scales: {
              y: {
                min: 0,
                max: 10,
                title: { display: true, text: 'Mood (0–10)' }
              },
              x: {
                title: { display: true, text: 'Date' }
              }
            }
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default MoodChart;
