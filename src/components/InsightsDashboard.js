import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './InsightsDashboard.css';

const COLORS = ['#ad1457', '#6a1b9a', '#ef5350', '#f06292', '#ab47bc'];

function InsightsDashboard() {
  const [entries, setEntries] = useState([]);
  const [symptomData, setSymptomData] = useState([]);
  const [avgCycleLength, setAvgCycleLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'periodEntries'));
      const logs = snapshot.docs.map((doc) => ({ ...doc.data() }));
      setEntries(logs);
      analyzeData(logs);
    };

    const analyzeData = (logs) => {
      // --- Average Cycle Length ---
      const periodDates = logs
        .filter((log) => log.periodStarted)
        .map((log) => new Date(log.date))
        .sort((a, b) => a - b);

      const cycleLengths = [];
      for (let i = 1; i < periodDates.length; i++) {
        const diff = (periodDates[i] - periodDates[i - 1]) / (1000 * 60 * 60 * 24);
        cycleLengths.push(diff);
      }
      const avgCycle = cycleLengths.length
        ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
        : 0;
      setAvgCycleLength(avgCycle);

      // --- Symptom Frequency ---
      const allSymptoms = {};
      logs.forEach((log) => {
        log.symptoms?.forEach((symptom) => {
          allSymptoms[symptom] = (allSymptoms[symptom] || 0) + 1;
        });
      });

      const symptomArray = Object.keys(allSymptoms).map((s) => ({
        name: s,
        count: allSymptoms[s],
      }));
      setSymptomData(symptomArray);
    };

    fetchData();
  }, []);

  return (
    <div className="insights-container">
      <h2>📊 Personalized Cycle Insights</h2>

      <div className="metric-box">
        <h3>Avg Cycle Length: {avgCycleLength || 'N/A'} days</h3>
      </div>

      <div className="chart-section">
        <h4>Most Frequent Symptoms (Pie)</h4>
        <PieChart width={300} height={300}>
          <Pie
            data={symptomData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {symptomData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div className="chart-section">
        <h4>Symptom Count by Type (Bar)</h4>
        <BarChart width={500} height={300} data={symptomData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#ab47bc" />
        </BarChart>
      </div>
    </div>
  );
}

export default InsightsDashboard;
