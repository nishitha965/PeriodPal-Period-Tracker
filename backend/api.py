# api.py

from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # to allow frontend to access this backend

# Load the trained model
model = joblib.load("pms_predictor_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Extract features in the same order used during training
    features = [
        data['cycle_length'],
        data['flow_intensity'],
        data['cramps'],
        data['mood_swings'],
        data['headache'],
        data['fatigue'],
        data['previous_pms']
    ]

    # Convert to 2D array for model
    prediction = model.predict([features])[0]

    return jsonify({'pms_prediction': int(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
