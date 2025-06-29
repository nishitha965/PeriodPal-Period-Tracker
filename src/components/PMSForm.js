import React, { useState } from "react";

const PMSForm = () => {
  const [formData, setFormData] = useState({
    cycle_length: 28,
    flow_intensity: 5,
    cramps: 5,
    mood_swings: 5,
    headache: 5,
    fatigue: 5,
    previous_pms: 0,
    cycle_day: 15, // for phase detection
    symptoms: [],  // for phase detection
  });

  const [mlPrediction, setMlPrediction] = useState(null);
  const [phasePrediction, setPhasePrediction] = useState(null);

  const allSymptoms = [
    "Mood swings", "Crying", "Fatigue", "Bloating", "Cravings", "Low energy",
    "Ovulation pain", "Increased libido", "Cervical mucus", "Breast tenderness"
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "previous_pms") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else if (name === "symptoms") {
      const selected = Array.from(e.target.selectedOptions, opt => opt.value);
      setFormData({ ...formData, symptoms: selected });
    } else {
      setFormData({ ...formData, [name]: Number(value) });
    }
  };

  const predictPhase = (symptoms, cycleDay) => {
    const pmsSymptoms = ["Mood swings", "Crying", "Fatigue", "Bloating", "Cravings", "Low energy"];
    const ovulationSymptoms = ["Ovulation pain", "Increased libido", "Cervical mucus", "Breast tenderness"];

    const matchedPMS = symptoms.filter(s => pmsSymptoms.includes(s)).length;
    const matchedOvulation = symptoms.filter(s => ovulationSymptoms.includes(s)).length;

    if (matchedPMS >= 2 && cycleDay >= 21 && cycleDay <= 28) {
      return "Likely PMS";
    } else if (matchedOvulation >= 2 && cycleDay >= 12 && cycleDay <= 16) {
      return "Likely Ovulation";
    } else {
      return "No PMS or Ovulation symptoms detected";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ML Prediction
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMlPrediction(data.pms_prediction === 1 ? "Likely PMS" : "Unlikely PMS");
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend.");
    }

    // Phase Detection Prediction
    const phase = predictPhase(formData.symptoms, formData.cycle_day);
    setPhasePrediction(phase);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2>PMS Predictor</h2>
      <form onSubmit={handleSubmit}>
        {/* Cycle Length */}
        <div>
          <label>Cycle Length (days):</label>
          <input
            type="number"
            name="cycle_length"
            min="1"
            max="40"
            value={formData.cycle_length}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sliders */}
        {["flow_intensity", "cramps", "mood_swings", "headache", "fatigue"].map((key) => (
          <div key={key}>
            <label>
              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} (1-10):
            </label>
            <input
              type="range"
              name={key}
              min="1"
              max="10"
              value={formData[key]}
              onChange={handleChange}
            />
            <span>{formData[key]}</span>
          </div>
        ))}

        {/* Previous PMS */}
        <div>
          <label>Previous PMS:</label>
          <div>
            <label>
              <input
                type="radio"
                name="previous_pms"
                value={1}
                checked={formData.previous_pms === 1}
                onChange={handleChange}
              />
              Yes
            </label>
            <label style={{ marginLeft: "15px" }}>
              <input
                type="radio"
                name="previous_pms"
                value={0}
                checked={formData.previous_pms === 0}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Cycle Day */}
        <div>
          <label>Current Day in Cycle (1-28):</label>
          <input
            type="number"
            name="cycle_day"
            min="1"
            max="28"
            value={formData.cycle_day}
            onChange={handleChange}
            required
          />
        </div>

        {/* Symptom Selector */}
        <div>
          <label>Select Symptoms:</label>
          <select
            name="symptoms"
            multiple
            value={formData.symptoms}
            onChange={handleChange}
            style={{ width: "100%", height: "120px" }}
          >
            {allSymptoms.map((symptom) => (
              <option key={symptom} value={symptom}>
                {symptom}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>Predict</button>
      </form>

      {mlPrediction && (
        <h3 style={{ marginTop: "20px" }}>ML Prediction: {mlPrediction}</h3>
      )}
      {phasePrediction && (
        <h3>Phase Detection: {phasePrediction}</h3>
      )}
    </div>
  );
};

export default PMSForm;
