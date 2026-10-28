-- KrishiMitra Relational Database Schema
-- Implemented for Node.js built-in SQLite (zero external build dependencies)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  location TEXT DEFAULT 'Hassan, Karnataka',
  state TEXT DEFAULT 'Karnataka',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS farms (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT DEFAULT 'Hassan',
  state TEXT DEFAULT 'Karnataka',
  soil_type TEXT NOT NULL,
  area_acres REAL NOT NULL DEFAULT 1.0,
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  farm_id TEXT,
  crop TEXT NOT NULL,
  model_status TEXT NOT NULL, -- 'demo' | 'trained-model'
  model_name TEXT NOT NULL,
  confidence REAL, -- NULL for heuristic demo model (honest AI metric)
  explanation_json TEXT NOT NULL,
  growing_conditions_json TEXT,
  inputs_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS weather_snapshots (
  id TEXT PRIMARY KEY,
  recommendation_id TEXT,
  user_id TEXT,
  location TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  temperature REAL,
  apparent_temperature REAL,
  condition_text TEXT,
  condition_code INTEGER,
  humidity REAL,
  wind_speed REAL,
  rain_chance REAL,
  precipitation REAL,
  forecast_json TEXT,
  provider_status TEXT NOT NULL, -- 'live-provider' | 'demo-weather'
  provider_name TEXT NOT NULL,
  observation_time TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS irrigation_advice (
  id TEXT PRIMARY KEY,
  recommendation_id TEXT,
  user_id TEXT NOT NULL,
  farm_id TEXT,
  crop TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  soil_moisture REAL,
  status TEXT NOT NULL, -- 'Irrigate now' | 'Delay irrigation' | etc.
  advice_text TEXT NOT NULL,
  actions_json TEXT NOT NULL,
  missing_inputs_json TEXT,
  demo_status TEXT NOT NULL DEFAULT 'demo',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_farms_user ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_snapshots_rec ON weather_snapshots(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_user ON irrigation_advice(user_id);
