import { randomUUID } from 'node:crypto';
import db from '../db/db.js';

export function getHistory(req, res) {
  try {
    const userId = req.user.id;
    const recommendations = db.prepare(`
      SELECT 
        r.id,
        r.crop,
        r.model_status,
        r.model_name,
        r.confidence,
        r.inputs_json,
        r.explanation_json,
        r.created_at,
        f.farm_name,
        f.location as farm_location,
        f.soil_type as farm_soil,
        w.temperature as weather_temp,
        w.condition_text as weather_condition,
        w.provider_status as weather_provider_status,
        i.status as irrigation_status
      FROM recommendations r
      LEFT JOIN farms f ON r.farm_id = f.id
      LEFT JOIN weather_snapshots w ON w.recommendation_id = r.id
      LEFT JOIN irrigation_advice i ON i.recommendation_id = r.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `).all(userId);

    const formatted = recommendations.map(rec => {
      let inputs = {};
      let explanations = [];
      try { inputs = JSON.parse(rec.inputs_json || '{}'); } catch(e) {}
      try { explanations = JSON.parse(rec.explanation_json || '[]'); } catch(e) {}

      return {
        id: rec.id,
        crop: rec.crop,
        modelStatus: rec.model_status,
        modelName: rec.model_name,
        confidence: rec.confidence,
        farmName: rec.farm_name || 'Primary Farm',
        location: inputs.location || rec.farm_location || 'Hassan, Karnataka',
        soilType: inputs.soilType || rec.farm_soil || 'loamy',
        season: inputs.season || 'kharif',
        createdAt: rec.created_at,
        weatherSummary: rec.weather_temp != null ? `${rec.weather_temp}°C, ${rec.weather_condition}` : null,
        weatherProviderStatus: rec.weather_provider_status,
        irrigationStatus: rec.irrigation_status || 'Advice saved',
        summaryExcerpt: explanations[0] || 'Agronomically suited crop recommendation.'
      };
    });

    return res.json({
      success: true,
      history: formatted
    });
  } catch (error) {
    console.error('Error fetching recommendation history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve recommendation history.'
    });
  }
}

export function getHistoryById(req, res) {
  try {
    const userId = req.user.id;
    const recordId = req.params.id;

    const rec = db.prepare(`
      SELECT 
        r.*,
        f.farm_name,
        f.area_acres,
        f.location as farm_location
      FROM recommendations r
      LEFT JOIN farms f ON r.farm_id = f.id
      WHERE r.id = ? AND r.user_id = ?
    `).get(recordId, userId);

    if (!rec) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation record not found or access denied.'
      });
    }

    const weather = db.prepare('SELECT * FROM weather_snapshots WHERE recommendation_id = ?').get(recordId);
    const irrigation = db.prepare('SELECT * FROM irrigation_advice WHERE recommendation_id = ?').get(recordId);

    let parsedInputs = {};
    let parsedExplanation = [];
    let parsedGrowingConditions = null;
    let parsedForecast = [];
    let parsedActions = [];
    let parsedMissingInputs = [];

    try { parsedInputs = JSON.parse(rec.inputs_json || '{}'); } catch(e) {}
    try { parsedExplanation = JSON.parse(rec.explanation_json || '[]'); } catch(e) {}
    try { parsedGrowingConditions = JSON.parse(rec.growing_conditions_json || 'null'); } catch(e) {}
    if (weather) {
      try { parsedForecast = JSON.parse(weather.forecast_json || '[]'); } catch(e) {}
    }
    if (irrigation) {
      try { parsedActions = JSON.parse(irrigation.actions_json || '[]'); } catch(e) {}
      try { parsedMissingInputs = JSON.parse(irrigation.missing_inputs_json || '[]'); } catch(e) {}
    }

    return res.json({
      success: true,
      record: {
        id: rec.id,
        crop: rec.crop,
        modelStatus: rec.model_status,
        modelName: rec.model_name,
        confidence: rec.confidence,
        explanation: parsedExplanation,
        growingConditions: parsedGrowingConditions,
        inputs: parsedInputs,
        farm: {
          id: rec.farm_id,
          name: rec.farm_name,
          location: rec.farm_location,
          acres: rec.area_acres
        },
        weatherSnapshot: weather ? {
          location: weather.location,
          temperature: weather.temperature,
          apparentTemperature: weather.apparent_temperature,
          conditionText: weather.condition_text,
          humidity: weather.humidity,
          windSpeed: weather.wind_speed,
          rainChance: weather.rain_chance,
          precipitation: weather.precipitation,
          forecast: parsedForecast,
          providerStatus: weather.provider_status,
          providerName: weather.provider_name,
          observationTime: weather.observation_time
        } : null,
        irrigationAdvice: irrigation ? {
          status: irrigation.status,
          adviceText: irrigation.advice_text,
          actions: parsedActions,
          missingInputs: parsedMissingInputs,
          soilMoisture: irrigation.soil_moisture,
          demoStatus: irrigation.demo_status
        } : null,
        createdAt: rec.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching history record by id:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve detailed recommendation record.'
    });
  }
}

export function saveRecommendation(req, res) {
  try {
    const userId = req.user.id;
    const {
      farmId,
      crop,
      modelStatus,
      modelName,
      confidence,
      explanation,
      growingConditions,
      inputs,
      weatherSnapshot,
      irrigationAdvice
    } = req.validatedBody;

    const recommendationId = randomUUID();

    // 1. Insert Recommendation
    db.prepare(`
      INSERT INTO recommendations (
        id, user_id, farm_id, crop, model_status, model_name, confidence,
        explanation_json, growing_conditions_json, inputs_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      recommendationId,
      userId,
      farmId || null,
      crop,
      modelStatus || 'demo',
      modelName || 'demo-agronomic-heuristics-v1',
      confidence != null ? confidence : null,
      JSON.stringify(explanation || []),
      JSON.stringify(growingConditions || null),
      JSON.stringify(inputs || {})
    );

    // 2. Insert Weather Snapshot if supplied
    if (weatherSnapshot) {
      const weatherId = randomUUID();
      db.prepare(`
        INSERT INTO weather_snapshots (
          id, recommendation_id, user_id, location, latitude, longitude,
          temperature, apparent_temperature, condition_text, condition_code,
          humidity, wind_speed, rain_chance, precipitation, forecast_json,
          provider_status, provider_name, observation_time, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        weatherId,
        recommendationId,
        userId,
        weatherSnapshot.location || inputs.location || 'Hassan, Karnataka',
        weatherSnapshot.latitude || null,
        weatherSnapshot.longitude || null,
        weatherSnapshot.temperature || null,
        weatherSnapshot.apparentTemperature || null,
        weatherSnapshot.conditionText || 'Clear',
        weatherSnapshot.conditionCode || 0,
        weatherSnapshot.humidity || null,
        weatherSnapshot.windSpeed || null,
        weatherSnapshot.rainChance || null,
        weatherSnapshot.precipitation || null,
        JSON.stringify(weatherSnapshot.forecast || []),
        weatherSnapshot.providerStatus || 'demo-weather',
        weatherSnapshot.providerName || 'Simulated Weather Snapshot',
        weatherSnapshot.observationTime || new Date().toISOString()
      );
    }

    // 3. Insert Irrigation Advice if supplied
    if (irrigationAdvice) {
      const irrigationId = randomUUID();
      db.prepare(`
        INSERT INTO irrigation_advice (
          id, recommendation_id, user_id, farm_id, crop, soil_type,
          soil_moisture, status, advice_text, actions_json, missing_inputs_json,
          demo_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        irrigationId,
        recommendationId,
        userId,
        farmId || null,
        crop,
        inputs.soilType || 'loamy',
        irrigationAdvice.soilMoisture != null ? irrigationAdvice.soilMoisture : (inputs.soilMoisture || null),
        irrigationAdvice.status || 'Advice saved',
        irrigationAdvice.adviceText || '',
        JSON.stringify(irrigationAdvice.actions || []),
        JSON.stringify(irrigationAdvice.missingInputs || []),
        irrigationAdvice.demoStatus || 'demo'
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Consultation record, weather snapshot, and irrigation plan successfully saved to farmer history.',
      recommendationId
    });
  } catch (error) {
    console.error('Error saving recommendation:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to persist recommendation record.'
    });
  }
}

export function deleteHistoryRecord(req, res) {
  try {
    const userId = req.user.id;
    const recordId = req.params.id;

    const existing = db.prepare('SELECT id FROM recommendations WHERE id = ? AND user_id = ?').get(recordId, userId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Record not found or access denied.'
      });
    }

    db.prepare('DELETE FROM recommendations WHERE id = ? AND user_id = ?').run(recordId, userId);

    return res.json({
      success: true,
      message: 'Consultation record deleted from history.'
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete record.'
    });
  }
}
