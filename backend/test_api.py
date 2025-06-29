import requests

data = {
    "cycle_length": 28,
    "flow_intensity": 3,
    "cramps": 1,
    "mood_swings": 1,
    "headache": 0,
    "fatigue": 1,
    "previous_pms": 1
}

res = requests.post("http://127.0.0.1:5000/predict", json=data)
print("Prediction:", res.json())
