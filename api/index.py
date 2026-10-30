"""
KrishiMitra (ಕೃಷಿಮಿತ್ರ) - Vercel Serverless Scikit-Learn ML Prediction Service
Runs directly on Vercel Python Runtime with scikit-learn RandomForestClassifier.
Department of Computer Science & Engineering, Malnad College of Engineering, Hassan.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import numpy as np
from sklearn.ensemble import RandomForestClassifier

app = FastAPI(
    title="KrishiMitra Scikit-Learn ML Service",
    description="Agro-Climatic Crop Recommendation Service powered by Scikit-Learn",
    version="2.0.0"
)

# Enable CORS for browser frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ICAR Agronomic Crop Knowledge Base & Benchmark Distributions ---
CROPS_DISTRIBUTIONS = {
    'Finger Millet (Ragi)': {
        'n': (35, 80), 'p': (20, 50), 'k': (20, 55),
        'temp': (23.0, 32.0), 'humidity': (55.0, 78.0), 'ph': (5.5, 7.5), 'rainfall': (40.0, 95.0),
        'kannada': 'ರಾಗಿ (Ragi)', 'category': 'Millets / Coarse Cereals'
    },
    'Red Gram (Tur / Pigeonpea)': {
        'n': (18, 38), 'p': (45, 75), 'k': (20, 45),
        'temp': (23.0, 35.0), 'humidity': (50.0, 75.0), 'ph': (6.5, 7.8), 'rainfall': (50.0, 95.0),
        'kannada': 'ತೊಗರಿ (Tur / Red Gram)', 'category': 'Pulses / Legumes'
    },
    'Paddy (Rice)': {
        'n': (75, 140), 'p': (35, 80), 'k': (35, 85),
        'temp': (22.0, 34.0), 'humidity': (75.0, 95.0), 'ph': (5.5, 7.2), 'rainfall': (140.0, 290.0),
        'kannada': 'ಭತ್ತ (Paddy / Rice)', 'category': 'Cereals'
    },
    'Maize (Corn)': {
        'n': (90, 150), 'p': (45, 80), 'k': (35, 65),
        'temp': (20.0, 30.0), 'humidity': (55.0, 75.0), 'ph': (6.0, 7.5), 'rainfall': (60.0, 125.0),
        'kannada': 'ಮೆಕ್ಕೆಜೋಳ (Maize / Corn)', 'category': 'Cereals'
    },
    'Cotton': {
        'n': (75, 130), 'p': (35, 65), 'k': (35, 75),
        'temp': (24.0, 35.0), 'humidity': (45.0, 70.0), 'ph': (6.5, 8.2), 'rainfall': (50.0, 105.0),
        'kannada': 'ಹತ್ತಿ (Cotton)', 'category': 'Commercial / Fiber'
    },
    'Chickpea (Bengal Gram)': {
        'n': (15, 45), 'p': (40, 80), 'k': (25, 60),
        'temp': (15.0, 28.0), 'humidity': (40.0, 65.0), 'ph': (6.0, 7.8), 'rainfall': (30.0, 70.0),
        'kannada': 'ಕಡಲೆ (Chickpea / Bengal Gram)', 'category': 'Pulses / Legumes'
    },
    'Groundnut (Peanut)': {
        'n': (15, 40), 'p': (35, 70), 'k': (25, 60),
        'temp': (22.0, 32.0), 'humidity': (50.0, 75.0), 'ph': (6.0, 7.2), 'rainfall': (45.0, 85.0),
        'kannada': 'ಕಡಲೆಕಾಯಿ (Groundnut / Shenga)', 'category': 'Oilseeds / Legumes'
    },
    'Sugarcane': {
        'n': (120, 220), 'p': (50, 95), 'k': (70, 140),
        'temp': (25.0, 36.0), 'humidity': (70.0, 90.0), 'ph': (6.0, 7.8), 'rainfall': (120.0, 250.0),
        'kannada': 'ಕಬ್ಬು (Sugarcane)', 'category': 'Commercial / Sugar'
    },
    'Coffee (Arabica / Robusta)': {
        'n': (75, 140), 'p': (40, 70), 'k': (70, 130),
        'temp': (17.0, 28.0), 'humidity': (70.0, 92.0), 'ph': (5.0, 6.5), 'rainfall': (150.0, 280.0),
        'kannada': 'ಕಾಫಿ (Coffee)', 'category': 'Plantation / Cash Crop'
    },
    'Sorghum (Jowar)': {
        'n': (45, 90), 'p': (25, 50), 'k': (25, 55),
        'temp': (24.0, 34.0), 'humidity': (40.0, 65.0), 'ph': (6.0, 8.0), 'rainfall': (35.0, 80.0),
        'kannada': 'ಜೋಳ (Sorghum / Jowar)', 'category': 'Millets / Dryland Cereals'
    },
    'Sunflower': {
        'n': (45, 85), 'p': (45, 85), 'k': (30, 65),
        'temp': (20.0, 32.0), 'humidity': (45.0, 70.0), 'ph': (6.0, 7.5), 'rainfall': (45.0, 85.0),
        'kannada': 'ಸೂರ್ಯಕಾಂತಿ (Sunflower)', 'category': 'Oilseeds'
    }
}

# --- Train Scikit-Learn Model on Initialization ---
def build_and_train_model():
    np.random.seed(42)
    features_list = []
    labels_list = []

    samples_per_crop = 120  # 1,200 training instances total

    for crop_name, dist in CROPS_DISTRIBUTIONS.items():
        n_vals = np.random.uniform(dist['n'][0], dist['n'][1], samples_per_crop)
        p_vals = np.random.uniform(dist['p'][0], dist['p'][1], samples_per_crop)
        k_vals = np.random.uniform(dist['k'][0], dist['k'][1], samples_per_crop)
        temp_vals = np.random.uniform(dist['temp'][0], dist['temp'][1], samples_per_crop)
        hum_vals = np.random.uniform(dist['humidity'][0], dist['humidity'][1], samples_per_crop)
        ph_vals = np.random.uniform(dist['ph'][0], dist['ph'][1], samples_per_crop)
        rain_vals = np.random.uniform(dist['rainfall'][0], dist['rainfall'][1], samples_per_crop)

        crop_matrix = np.column_stack([
            n_vals, p_vals, k_vals, temp_vals, hum_vals, ph_vals, rain_vals
        ])

        features_list.append(crop_matrix)
        labels_list.extend([crop_name] * samples_per_crop)

    X = np.vstack(features_list)
    y = np.array(labels_list)

    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=4,
        random_state=42
    )
    clf.fit(X, y)
    return clf

# In-memory trained Scikit-Learn instance
ml_model = build_and_train_model()
feature_names = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH', 'Rainfall']

# --- Request / Response Models ---
class PredictionInput(BaseModel):
    nitrogen: Optional[float] = Field(60.0, ge=0, le=300)
    phosphorus: Optional[float] = Field(40.0, ge=0, le=200)
    potassium: Optional[float] = Field(40.0, ge=0, le=250)
    ph: Optional[float] = Field(6.5, ge=3.0, le=10.0)
    temperature: Optional[float] = Field(27.0, ge=0, le=50.0)
    humidity: Optional[float] = Field(65.0, ge=0, le=100.0)
    rainfall: Optional[float] = Field(100.0, ge=0, le=1000.0)
    soilType: Optional[str] = 'red_loamy'
    season: Optional[str] = 'kharif'
    location: Optional[str] = 'Hassan, Karnataka'

@app.get("/api/health")
@app.get("/health")
def health():
    return {
        "status": "online",
        "service": "KrishiMitra Vercel Scikit-Learn Serverless Engine",
        "model": "RandomForestClassifier(n_estimators=100)",
        "framework": "Scikit-Learn 1.3+",
        "classes": list(ml_model.classes_)
    }

@app.post("/api/predict")
@app.post("/predict")
def predict_crop(data: PredictionInput):
    """
    Executes real Scikit-Learn RandomForest inference on soil and meteorological parameters.
    """
    # 1. Prepare feature vector: [N, P, K, temp, humidity, ph, rainfall]
    features = np.array([[
        data.nitrogen if data.nitrogen is not None else 60.0,
        data.phosphorus if data.phosphorus is not None else 40.0,
        data.potassium if data.potassium is not None else 40.0,
        data.temperature if data.temperature is not None else 27.0,
        data.humidity if data.humidity is not None else 65.0,
        data.ph if data.ph is not None else 6.5,
        data.rainfall if data.rainfall is not None else 100.0
    ]])

    # 2. Compute probabilities across all classes via Scikit-Learn
    probabilities = ml_model.predict_proba(features)[0]
    classes = ml_model.classes_

    # Sort descending by probability
    ranked_indices = np.argsort(probabilities)[::-1]
    top_idx = ranked_indices[0]
    recommended_crop = classes[top_idx]
    confidence_score = float(probabilities[top_idx])

    # 3. Alternatives
    alternatives = []
    for idx in ranked_indices[1:4]:
        prob = float(probabilities[idx])
        if prob > 0.01:
            alt_crop = classes[idx]
            alt_info = CROPS_DISTRIBUTIONS.get(alt_crop, {})
            alternatives.append({
                "crop": alt_crop,
                "confidence": round(prob * 100, 1),
                "kannada": alt_info.get('kannada', '')
            })

    # 4. Feature importance mapping from Scikit-Learn model
    importances = ml_model.feature_importances_
    feature_importance_dict = {
        name: round(float(imp) * 100, 1)
        for name, imp in zip(feature_names, importances)
    }

    crop_info = CROPS_DISTRIBUTIONS.get(recommended_crop, {})

    return {
        "status": "success",
        "engine": "scikit-learn-randomforest",
        "crop": recommended_crop,
        "kannadaName": crop_info.get('kannada', ''),
        "category": crop_info.get('category', ''),
        "confidence": round(confidence_score * 100, 1),
        "confidenceDecimal": round(confidence_score, 4),
        "modelName": "Scikit-Learn RandomForestClassifier",
        "featureImportance": feature_importance_dict,
        "alternatives": alternatives,
        "evaluatedAt": data.location
    }
