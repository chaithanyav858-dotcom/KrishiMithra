import bcrypt from 'bcryptjs';
import db from './db.js';
import { CROP_PROFILES } from '../config/constants.js';

export async function seedDatabase() {
  console.log('🌱 Seeding KrishiMitra database with demo farmer data...');

  const demoUserId = 'demo-farmer-mce-001';
  const farmId1 = 'demo-farm-001';
  const farmId2 = 'demo-farm-002';
  const recId1 = 'demo-rec-001';
  const recId2 = 'demo-rec-002';

  // Check if demo user already exists
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('demo@krishimitra.agr');
  if (existingUser) {
    console.log('ℹ️  Demo farmer account already exists.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Demo@123', salt);

  // 1. Insert Demo Farmer User
  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, phone, location, state, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-30 days'), datetime('now'))
  `).run(
    demoUserId,
    'Ramesh Patil',
    'demo@krishimitra.agr',
    passwordHash,
    '+91 98450 12345',
    'Hassan, Karnataka',
    'Karnataka'
  );

  // 2. Insert Demo Farms
  db.prepare(`
    INSERT INTO farms (id, user_id, farm_name, location, district, state, soil_type, area_acres, is_primary, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-30 days'), datetime('now'))
  `).run(
    farmId1,
    demoUserId,
    'Hemavathi Basin Field 1',
    'Channarayapatna Road, Hassan',
    'Hassan',
    'Karnataka',
    'red_loamy',
    4.5,
    1
  );

  db.prepare(`
    INSERT INTO farms (id, user_id, farm_name, location, district, state, soil_type, area_acres, is_primary, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-25 days'), datetime('now'))
  `).run(
    farmId2,
    demoUserId,
    'Arkalgud Ridge Plot 2',
    'Arkalgud Taluk, Hassan',
    'Hassan',
    'Karnataka',
    'laterite',
    2.5,
    0
  );

  // 3. Insert Historical Recommendation 1: Finger Millet (Ragi)
  const inputs1 = {
    location: 'Hassan, Karnataka',
    soilType: 'red_loamy',
    season: 'kharif',
    nitrogen: 65,
    phosphorus: 38,
    potassium: 42,
    ph: 6.4,
    soilMoisture: 48,
    temperature: 26.5,
    humidity: 78,
    rainfall: 145
  };

  const explanations1 = [
    'Submitted Nitrogen (65 kg/ha), Phosphorus (38 kg/ha), and Potassium (42 kg/ha) closely align with ICAR standard targets for Finger Millet (40-80 N, 25-45 P, 25-50 K).',
    'Red Sandy / Loamy soil provides essential rapid aeration and prevents waterlogging during monsoon showers in Hassan district.',
    'Kharif season timing synchronizes with natural vegetative growth and panicle emergence requirements.'
  ];

  db.prepare(`
    INSERT INTO recommendations (
      id, user_id, farm_id, crop, model_status, model_name, confidence,
      explanation_json, growing_conditions_json, inputs_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-12 days'))
  `).run(
    recId1,
    demoUserId,
    farmId1,
    'Finger Millet (Ragi)',
    'demo',
    'demo-agronomic-heuristics-v1',
    null, // Honest metric: null for rule-based heuristics
    JSON.stringify(explanations1),
    JSON.stringify(CROP_PROFILES['Finger Millet (Ragi)']),
    JSON.stringify(inputs1)
  );

  // Weather Snapshot for Rec 1
  const forecast1 = [
    { day: 'Day 1', date: '2026-10-05', maxTemp: 28, minTemp: 19, rainChance: 65, condition: 'Scattered Showers' },
    { day: 'Day 2', date: '2026-10-06', maxTemp: 27, minTemp: 18, rainChance: 40, condition: 'Partly Cloudy' },
    { day: 'Day 3', date: '2026-10-07', maxTemp: 29, minTemp: 19, rainChance: 15, condition: 'Sunny / Mild' }
  ];

  db.prepare(`
    INSERT INTO weather_snapshots (
      id, recommendation_id, user_id, location, latitude, longitude,
      temperature, apparent_temperature, condition_text, condition_code,
      humidity, wind_speed, rain_chance, precipitation, forecast_json,
      provider_status, provider_name, observation_time, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-12 days'))
  `).run(
    'demo-snap-001',
    recId1,
    demoUserId,
    'Hassan, Karnataka',
    13.0033,
    76.1004,
    26.2,
    27.1,
    'Moderate Monsoon Cloud Cover',
    3,
    76,
    14.2,
    65,
    4.5,
    JSON.stringify(forecast1),
    'demo-weather',
    'Regional Agro-Weather Simulator (Hassan IMD Station)',
    '2026-10-04T10:30:00Z'
  );

  // Irrigation Advice for Rec 1
  const actions1 = [
    'Delay manual irrigation for the next 24-36 hours due to 65% probability of incoming monsoon shower.',
    'Inspect field perimeter furrows to ensure excess surface runoff drains smoothly.',
    'Re-check topsoil moisture 48 hours post-shower before triggering drip line valve.'
  ];
  const missingInputs1 = [
    'Automated telemetry tensiometer sensor data not detected; advice utilizes farmer-reported soil moisture (48%) and satellite rainfall projections.'
  ];

  db.prepare(`
    INSERT INTO irrigation_advice (
      id, recommendation_id, user_id, farm_id, crop, soil_type,
      soil_moisture, status, advice_text, actions_json, missing_inputs_json,
      demo_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-12 days'))
  `).run(
    'demo-irrig-001',
    recId1,
    demoUserId,
    farmId1,
    'Finger Millet (Ragi)',
    'red_loamy',
    48,
    'Delay irrigation',
    'Rainfall is expected within 24 to 36 hours (65% probability, ~4.5mm). Red loamy soil currently retains adequate 48% volumetric moisture for the tillering stage. Adding artificial irrigation now risks leaching applied nutrients.',
    JSON.stringify(actions1),
    JSON.stringify(missingInputs1),
    'demo'
  );

  // 4. Insert Historical Recommendation 2: Maize (Corn)
  const inputs2 = {
    location: 'Hassan, Karnataka',
    soilType: 'loamy',
    season: 'rabi',
    nitrogen: 125,
    phosphorus: 60,
    potassium: 50,
    ph: 6.8,
    soilMoisture: 32,
    temperature: 24.0,
    humidity: 62,
    rainfall: 15
  };

  const explanations2 = [
    'Submitted Nitrogen (125 kg/ha) and Phosphorus (60 kg/ha) satisfy high feeder requirements of hybrid Maize.',
    'Loamy soil maintains balanced moisture tension and prevents early root asphyxiation.',
    'Rabi climate in southern Karnataka provides optimal sunlight hours with minimal fungal humidity stress.'
  ];

  db.prepare(`
    INSERT INTO recommendations (
      id, user_id, farm_id, crop, model_status, model_name, confidence,
      explanation_json, growing_conditions_json, inputs_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-4 days'))
  `).run(
    recId2,
    demoUserId,
    farmId1,
    'Maize (Corn)',
    'demo',
    'demo-agronomic-heuristics-v1',
    null,
    JSON.stringify(explanations2),
    JSON.stringify(CROP_PROFILES['Maize (Corn)']),
    JSON.stringify(inputs2)
  );

  const forecast2 = [
    { day: 'Day 1', date: '2026-10-13', maxTemp: 29, minTemp: 17, rainChance: 5, condition: 'Clear Sky' },
    { day: 'Day 2', date: '2026-10-14', maxTemp: 30, minTemp: 18, rainChance: 10, condition: 'Mostly Sunny' },
    { day: 'Day 3', date: '2026-10-15', maxTemp: 29, minTemp: 17, rainChance: 5, condition: 'Sunny' }
  ];

  db.prepare(`
    INSERT INTO weather_snapshots (
      id, recommendation_id, user_id, location, latitude, longitude,
      temperature, apparent_temperature, condition_text, condition_code,
      humidity, wind_speed, rain_chance, precipitation, forecast_json,
      provider_status, provider_name, observation_time, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-4 days'))
  `).run(
    'demo-snap-002',
    recId2,
    demoUserId,
    'Hassan, Karnataka',
    13.0033,
    76.1004,
    24.8,
    24.2,
    'Clear Sunny Winter Sky',
    1,
    58,
    8.5,
    5,
    0.0,
    JSON.stringify(forecast2),
    'demo-weather',
    'Regional Agro-Weather Simulator (Hassan IMD Station)',
    '2026-10-12T08:00:00Z'
  );

  const actions2 = [
    'Apply 30 mm light furrow or sprinkler irrigation within the next 18 hours.',
    'Irrigate in early morning hours (before 9:00 AM) to curb daytime evaporative loss.',
    'Apply second split dose of urea (Nitrogen) immediately before or with irrigation water.'
  ];
  const missingInputs2 = [
    'Recent evapotranspiration (ET0) sensor feed not connected; water need computed using baseline crop coefficient Kc=0.85 for vegetative maize.'
  ];

  db.prepare(`
    INSERT INTO irrigation_advice (
      id, recommendation_id, user_id, farm_id, crop, soil_type,
      soil_moisture, status, advice_text, actions_json, missing_inputs_json,
      demo_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-4 days'))
  `).run(
    'demo-irrig-002',
    recId2,
    demoUserId,
    farmId1,
    'Maize (Corn)',
    'loamy',
    32,
    'Light irrigation may be suitable',
    'Soil moisture is currently at 32%, approaching the management allowable depletion (MAD) limit for maize. With dry sunny conditions and zero rain predicted over the next 72 hours, scheduled light irrigation is recommended to prevent knee-high water stress.',
    JSON.stringify(actions2),
    JSON.stringify(missingInputs2),
    'demo'
  );

  console.log('✅ KrishiMitra database seeded successfully with Demo Farmer (Ramesh Patil)!');
}

// Run standalone if executed directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().catch((err) => {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  });
}
