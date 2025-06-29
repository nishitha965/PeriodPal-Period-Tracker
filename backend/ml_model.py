# ml_model.py

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Step 1: Create fake data to simulate logs
np.random.seed(42)
n = 500  # Number of user records

# Features that could affect PMS
data = pd.DataFrame({
    'cycle_length': np.random.randint(25, 35, size=n),       # in days
    'flow_intensity': np.random.randint(1, 5, size=n),       # scale: 1 (light) to 4 (heavy)
    'cramps': np.random.randint(0, 2, size=n),               # binary: 0 (No), 1 (Yes)
    'mood_swings': np.random.randint(0, 2, size=n),
    'headache': np.random.randint(0, 2, size=n),
    'fatigue': np.random.randint(0, 2, size=n),
    'previous_pms': np.random.randint(0, 2, size=n)
})

# Step 2: Define target label - simulate PMS occurrence next cycle
# Heuristic: if >=2 symptoms + previous PMS → likely PMS
data['pms_next_cycle'] = (
    data[['cramps', 'mood_swings', 'headache', 'fatigue']].sum(axis=1) + data['previous_pms']
) >= 2
data['pms_next_cycle'] = data['pms_next_cycle'].astype(int)

# Step 3: Prepare data
X = data.drop('pms_next_cycle', axis=1)
y = data['pms_next_cycle']

# Step 4: Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 5: Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 6: Evaluate Model
y_pred = model.predict(X_test)
print("Model Accuracy:", accuracy_score(y_test, y_pred))

# Step 7: Save Model
joblib.dump(model, "pms_predictor_model.pkl")
print("✅ Model saved as pms_predictor_model.pkl")
