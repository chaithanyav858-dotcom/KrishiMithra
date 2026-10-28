# 🌾 KrishiMitra (ಕೃಷಿಮಿತ್ರ)
### Smart Agricultural Decision Assistance System
**5th-Semester Mini Project**  
**Department of Computer Science & Engineering**  
**Malnad College of Engineering (MCE), Hassan – 573202, Karnataka, India**

---

## 📌 1. Project Overview & Problem Statement

Smallholder farmers in Karnataka and throughout India face growing risks from unpredictable monsoons, soil nutrient imbalances, and improper irrigation scheduling. Many available digital solutions are overly complex, display unverified or deceptive AI statistics, or require costly subscriptions.

**KrishiMitra** is a responsive, full-stack, data-driven agricultural decision-support web application engineered specifically for farmers and agricultural extension officers. It integrates three core agronomic workflows:
1. **Soil & Farm-Matched Crop Recommendation:** Evaluates Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), soil texture, and seasonal cycles against standard ICAR/UAS agronomic matrices.
2. **Localized Meteorological Forecasting & Agri-Interpretation:** Pulls live global weather data via the Open-Meteo API (or regional Hassan IMD simulation when offline) and separates raw temperature/rainfall data from actionable field interpretations (such as foliar spraying windows, thermal stress, and fungal disease susceptibility).
3. **Agro-Hydrological Irrigation Advisory:** Combines physiological crop water demand ($ET_c$), soil water retention and percolation rates, measured/estimated soil moisture, and 48-hour precipitation forecasts to issue clear, water-conserving directives (e.g., *"Delay irrigation – 65% rain predicted in 24h"*).
4. **Consultation & History Persistence:** Securely stores historical soil inputs, weather conditions, and irrigation advice in a relational SQLite database so farmers can review their farm history anytime.

> **AI Integrity Commitment:** KrishiMitra explicitly refrains from displaying fabricated confidence percentages. Rule-based agronomic heuristics transparently report `confidence: null` with explanatory notes, while trained machine learning models report true probabilistic confidence only when derived from a statistical classifier.

---

## 🏗️ 2. System Architecture

KrishiMitra utilizes a modular, decoupled architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   React + Vite + Tailwind CSS Client                   │
│  (Landing, Dashboard, Crop Form, Weather View, Irrigation, History)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (JWT Auth)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Node.js + Express Server                        │
│   ┌───────────────────────────────┬────────────────────────────────┐   │
│   │   Auth & Farm Controllers     │   History & Data Controllers   │   │
│   └───────────────┬───────────────┴────────────────┬───────────────┘   │
│                   │                                │                   │
│                   ▼                                ▼                   │
│      ┌─────────────────────────┐      ┌─────────────────────────┐      │
│      │   Node:SQLite Database  │      │  Irrigation Rule Engine │      │
│      │   (Users, Farms, Recs,  │      │ (Soil Retention + ETc + │      │
│      │    Snapshots, Irrigation│      │  Rainfall Cancellation) │      │
│      └─────────────────────────┘      └────────────┬────────────┘      │
│                                                    │                   │
│         ┌──────────────────────────────────────────┴──────────┐        │
│         │ Prediction Adapter        │   Weather Adapter       │        │
│         └───────────┬───────────────┴──────────────┬──────────┘        │
└─────────────────────┼──────────────────────────────┼───────────────────┘
                      │                              │
         ┌────────────┴────────────┐    ┌────────────┴─────────────┐
         ▼                         ▼    ▼                          ▼
┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  ┌─────────────┐
│ Demo Agronomic   │  │ Optional Python  │  │ Live Open-     │  │ Regional    │
│ Heuristics v1    │  │ FastAPI Model    │  │ Meteo API      │  │ Simulated   │
│ (ICAR Grounded)  │  │ (Scikit-Learn)   │  │ (Worldwide)    │  │ IMD Weather │
└──────────────────┘  └──────────────────┘  └────────────────┘  └─────────────┘
```

---

## 🛠️ 3. Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS | High performance, instant HMR, responsive UI, zero bloat |
| **Icons** | Lucide React | High-contrast, semantic agricultural & meteorological iconography |
| **Backend** | Node.js v24, Express v4 | Lightweight REST API orchestration, built-in async fetch |
| **Database** | Node.js Built-in SQLite (`node:sqlite`) | Zero native compilation errors, zero external C++ dependencies, full relational schema with WAL mode |
| **Weather** | Open-Meteo REST API | Free global meteorological forecast; requires no API key secrets; 100% reliable |
| **ML Adapter** | Prediction Adapter + Optional FastAPI | Decoupled adapter supporting rule-based demo heuristics or external Python ML service |
| **Security** | JWT, bcryptjs, Zod validation | Secure authentication, password hashing, and server-side request sanitization |

---

## 🚀 4. Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v20+ or v24+ (Node 24 recommended, which has native `node:sqlite`).
- **NPM**: v10+

### Step 1: Clone or Navigate to the Project
```bash
cd "c:\Users\HP\Documents\VS Code projects\krishimitra"
```

### Step 2: Install Dependencies
Install root, backend, and frontend packages:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### Step 3: Configure Environment Variables
A pre-configured `.env` is ready in `server/.env`. You can adjust it if needed:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=krishimitra-mce-cse-mini-project-secret-key-2026
DEMO_MODE=true
WEATHER_PROVIDER=open-meteo
MODEL_SERVICE_URL=
```

### Step 4: Run the Application
Run both backend (port 5000) and frontend (port 5173) simultaneously:
```bash
npm run dev
```

Open your browser to:
- **Web Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 5. Testing & Verification

KrishiMitra includes an automated end-to-end integration test suite verifying all 8 core API contracts:
```bash
npm --prefix server run test:e2e
# or
node server/test-e2e.js
```
**Test Coverage:**
- `GET /api/health` – Server health, uptime, and engine modes.
- `GET /api/meta/config` – Soil types, seasons, and district registries.
- `POST /api/auth/demo-login` – 1-Click evaluator authentication.
- `POST /api/predict/crop` – Agronomic prediction & validation.
- `GET /api/weather?location=Hassan` – Open-Meteo live feed + agricultural interpretation.
- `POST /api/irrigation/advice` – Hydro-balance decision tree computation.
- `POST /api/history/save` – Multi-table relational persistence.
- `GET /api/history/:id` – Deep inspection & data reproduction.

---

## 🌾 6. Core Demonstration Flow

### Guided Path for Evaluators:
1. **Landing Page:** Review the agricultural hero, feature cards, and MCE CS&E department affiliation.
2. **1-Click Demo Login:** Click the golden **"1-Click Demo Farmer"** button in the navbar or login screen to authenticate instantly as **Ramesh Patil (Hassan)**.
3. **Farmer Dashboard:** View the live weather card for Hassan, recent historical crop consultation, and regional agronomic tips.
4. **Crop Recommendation:**
   - Click **"Get Crop Recommendation"**.
   - Review pre-filled soil data ($N=65$, $P=40$, $K=40$, Red Sandy/Loamy Soil, Kharif season).
   - Click **"Auto-fill from current weather"** to observe live meteorological parameters flowing into the optional inputs.
   - Click **"Generate Crop Recommendation"**.
   - Observe the returned crop (*Finger Millet / Ragi*), botanical profile, and honest `DEMO PREDICTOR` badge (`confidence: null`).
5. **Weather & Agricultural Interpretation:** Click **"View Local Weather"** to examine real-time weather and the foliar spray window.
6. **Agro-Hydrological Irrigation:**
   - Click **"Proceed to Irrigation Advice"**.
   - Adjust the soil moisture slider (e.g. set to 30%).
   - Click **"Compute Irrigation Directive"**.
   - Notice the status badge (*Delay irrigation* or *Light irrigation suitable*) with practical next steps.
7. **Save & Review History:**
   - Click **"Save Complete Recommendation Record"**.
   - Open **History** in the top navigation.
   - Click **"Inspect"** on any record to view the complete historical snapshot.

---

## 🔌 7. Connecting an External Trained ML Model (Python FastAPI)

If you have trained a Scikit-Learn model (e.g. Random Forest, XGBoost) on the Crop Recommendation dataset:

1. Navigate to `server/python_model_service`:
   ```bash
   cd server/python_model_service
   pip install -r requirements.txt
   uvicorn app:app --port 8000 --reload
   ```
2. Update `server/.env`:
   ```env
   MODEL_SERVICE_URL=http://localhost:8000
   ```
3. Restart the Node.js server. The `predictionAdapter.js` will automatically route prediction requests to the Python FastAPI microservice and display the `TRAINED MODEL` badge with its true statistical confidence score!

---

## 📡 8. API Specification

### Authentication
- `POST /api/auth/register` – Register farmer (`name`, `email`, `password`, `location`, `phone`).
- `POST /api/auth/login` – Login with email and password.
- `POST /api/auth/demo-login` – Instant login as demo farmer.
- `GET /api/auth/me` – Retrieve profile and registered farm plots.

### Crop Prediction
- `POST /api/predict/crop`
  - **Request:** `{ location, soilType, season, nitrogen, phosphorus, potassium, ph?, temperature?, humidity?, rainfall? }`
  - **Response:** `{ crop, status, model, confidence, explanation, growingConditions, suitableAlternatives }`

### Meteorological Feed
- `GET /api/weather?location={district}&lat={lat}&lon={lon}`
  - **Response:** `{ location, temperature, humidity, windSpeed, rainChance, forecast, agriculturalInterpretation: { sprayingAssessment, diseaseRisk, heatStress, advisories } }`

### Irrigation Advisory
- `POST /api/irrigation/advice`
  - **Request:** `{ crop, soilType, location, growthStage, soilMoisture, forecastRainChance, forecastPrecipitation }`
  - **Response:** `{ status, adviceText, actions, missingInputs, cropWaterDemand, soilDrainageNote }`

### Recommendation History
- `GET /api/history` – List all consultations saved by the authenticated farmer.
- `GET /api/history/:id` – Retrieve full historical snapshot (inputs, crop, weather snapshot, irrigation plan).
- `POST /api/history/save` – Persist complete consultation context.
- `DELETE /api/history/:id` – Remove consultation record.

---

## 🔮 9. Future Extensions
- **Voice/IVR Integration:** Voice-based queries in Kannada and regional dialects via Twilio/Exotel.
- **SMS Alerts:** Automated morning WhatsApp/SMS weather and irrigation notifications via GSM gateway.
- **IoT Tensiometer Sync:** LoRaWAN soil moisture sensor telemetry feeds.

---

## 🎓 10. Academic Accreditation
- **Institution:** Malnad College of Engineering (MCE), Hassan
- **Department:** Department of Computer Science & Engineering
- **Program:** Bachelor of Engineering (B.E.) – 5th Semester Mini Project
- **Academic Year:** 2026-2027
