import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

function SymptomChart({ logs }) {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const symptomCount = {};

    logs.forEach((log) => {
      const date = log.date;
      log.symptoms.forEach((symptom) => {
        if (!symptomCount[symptom]) {
          symptomCount[symptom] = [];
        }
        symptomCount[symptom].push(date);
      });
    });

    const datasets = Object.keys(symptomCount).map((symptom, i) => ({
      label: symptom,
      data: symptomCount[symptom].map((d) => ({
        x: d,
        y: 1,
      })),
      borderColor: `hsl(${i * 40}, 70%, 50%)`,
      fill: false,
    }));

    setChartData({
      datasets: datasets,
    });
  }, [logs]);

  const options = {
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h3>Symptom Trends</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default SymptomChart;
