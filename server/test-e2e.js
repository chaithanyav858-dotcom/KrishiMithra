/**
 * KrishiMitra - Automated End-to-End API Integration Test
 * Verifies all 8 core modules and API contracts required by the project specification.
 */

import http from 'node:http';

async function runTests() {
  console.log('🚀 Starting KrishiMitra End-to-End API Verification...');

  // Check if server is already running on port 5000
  let isRunning = false;
  try {
    const ping = await fetch('http://localhost:5000/api/health');
    if (ping.ok) isRunning = true;
  } catch (e) {
    isRunning = false;
  }

  if (!isRunning) {
    await import('./src/index.js');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const baseUrl = 'http://localhost:5000/api';

  // Helper for requests
  async function apiCall(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, data: json };
  }

  // 1. Health check
  console.log('1️⃣ Testing /api/health...');
  const health = await apiCall('/health');
  if (health.status !== 200 || health.data.status !== 'healthy') {
    throw new Error(`Health check failed: ${JSON.stringify(health)}`);
  }
  console.log('   ✅ Health check passed:', health.data.system);

  // 2. Meta config
  console.log('2️⃣ Testing /api/meta/config...');
  const meta = await apiCall('/meta/config');
  if (meta.status !== 200 || !meta.data.data.soilTypes) {
    throw new Error(`Meta config failed: ${JSON.stringify(meta)}`);
  }
  console.log(`   ✅ Meta config returned ${meta.data.data.soilTypes.length} soil types and ${meta.data.data.districts.length} districts`);

  // 3. Demo login
  console.log('3️⃣ Testing /api/auth/demo-login...');
  const demoAuth = await apiCall('/auth/demo-login', 'POST');
  if (demoAuth.status !== 200 || !demoAuth.data.token) {
    throw new Error(`Demo login failed: ${JSON.stringify(demoAuth)}`);
  }
  const token = demoAuth.data.token;
  console.log('   ✅ Logged in as demo user:', demoAuth.data.user.name, `(${demoAuth.data.user.email})`);

  // 4. Crop prediction
  console.log('4️⃣ Testing /api/predict/crop with N-P-K nutrients...');
  const cropReq = {
    location: 'Hassan, Karnataka',
    soilType: 'red_loamy',
    season: 'kharif',
    nitrogen: 70,
    phosphorus: 35,
    potassium: 45,
    ph: 6.5
  };
  const cropRes = await apiCall('/predict/crop', 'POST', cropReq);
  if (cropRes.status !== 200 || !cropRes.data.data?.crop) {
    throw new Error(`Crop prediction failed: ${JSON.stringify(cropRes)}`);
  }
  console.log(`   ✅ Crop predicted with NPK: '${cropRes.data.data.crop}' | Model: ${cropRes.data.data.model}`);

  console.log('4️⃣b Testing /api/predict/crop WITHOUT N-P-K (Optional Feature)...');
  const cropReqNoNPK = {
    location: 'Hassan, Karnataka',
    soilType: 'red_loamy',
    season: 'kharif'
  };
  const cropResNoNPK = await apiCall('/predict/crop', 'POST', cropReqNoNPK);
  if (cropResNoNPK.status !== 200 || !cropResNoNPK.data.data?.crop) {
    throw new Error(`Crop prediction without NPK failed: ${JSON.stringify(cropResNoNPK)}`);
  }
  console.log(`   ✅ Crop predicted WITHOUT NPK: '${cropResNoNPK.data.data.crop}' | Reason: ${cropResNoNPK.data.data.explanation[1]}`);

  // 5. Weather
  console.log('5️⃣ Testing /api/weather?location=Hassan...');
  const weatherRes = await apiCall('/weather?location=Hassan');
  if (weatherRes.status !== 200 || !weatherRes.data.data?.temperature) {
    throw new Error(`Weather query failed: ${JSON.stringify(weatherRes)}`);
  }
  console.log(`   ✅ Weather: ${weatherRes.data.data.location} | ${weatherRes.data.data.temperature}°C, ${weatherRes.data.data.conditionText} | Provider: ${weatherRes.data.data.providerStatus}`);
  console.log(`      Agri Spraying Window: ${weatherRes.data.data.agriculturalInterpretation?.sprayingAssessment?.suitability}`);

  // 6. Irrigation advice
  console.log('6️⃣ Testing /api/irrigation/advice...');
  const irrigReq = {
    crop: cropRes.data.data.crop,
    soilType: 'red_loamy',
    location: 'Hassan, Karnataka',
    growthStage: 'Vegetative',
    soilMoisture: 35,
    forecastRainChance: weatherRes.data.data.rainChance || 20,
    forecastPrecipitation: weatherRes.data.data.precipitation || 0
  };
  const irrigRes = await apiCall('/irrigation/advice', 'POST', irrigReq);
  if (irrigRes.status !== 200 || !irrigRes.data.data?.status) {
    throw new Error(`Irrigation advice failed: ${JSON.stringify(irrigRes)}`);
  }
  console.log(`   ✅ Irrigation Advice Directive: '${irrigRes.data.data.status}'`);
  console.log(`      Actions recommended: ${irrigRes.data.data.actions.length}`);

  // 7. Save recommendation to history
  console.log('7️⃣ Testing /api/history/save...');
  const saveReq = {
    crop: cropRes.data.data.crop,
    modelStatus: cropRes.data.data.status,
    modelName: cropRes.data.data.model,
    confidence: cropRes.data.data.confidence,
    explanation: cropRes.data.data.explanation,
    growingConditions: cropRes.data.data.growingConditions,
    inputs: cropReq,
    weatherSnapshot: weatherRes.data.data,
    irrigationAdvice: irrigRes.data.data
  };
  const saveRes = await apiCall('/history/save', 'POST', saveReq, token);
  if (saveRes.status !== 201 || !saveRes.data.recommendationId) {
    throw new Error(`History save failed: ${JSON.stringify(saveRes)}`);
  }
  const savedId = saveRes.data.recommendationId;
  console.log(`   ✅ Recommendation persisted with ID: ${savedId}`);

  // 8. Fetch History List and Inspect Record by ID
  console.log('8️⃣ Testing /api/history and /api/history/:id...');
  const histList = await apiCall('/history', 'GET', null, token);
  if (histList.status !== 200 || !Array.isArray(histList.data.history)) {
    throw new Error(`History list failed: ${JSON.stringify(histList)}`);
  }
  console.log(`   ✅ History retrieved: ${histList.data.history.length} total saved consultation records`);

  const detailRes = await apiCall(`/history/${savedId}`, 'GET', null, token);
  if (detailRes.status !== 200 || detailRes.data.record.crop !== cropRes.data.data.crop) {
    throw new Error(`History detail inspection failed: ${JSON.stringify(detailRes)}`);
  }
  console.log(`   ✅ Deep inspection reproduced saved consultation: Crop='${detailRes.data.record.crop}', Weather Temp=${detailRes.data.record.weatherSnapshot?.temperature}°C, Irrigation='${detailRes.data.record.irrigationAdvice?.status}'`);

  console.log('\n🎉 ALL 8 END-TO-END INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
