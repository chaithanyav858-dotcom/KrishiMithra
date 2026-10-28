import db from './db.js';
import { firestore, isFirebaseConfigured } from './firebase.js';

class DatabaseService {
  get isFirestore() {
    return isFirebaseConfigured && firestore !== null;
  }

  get databaseType() {
    return this.isFirestore ? 'Google Cloud Firestore' : 'SQLite (Local)';
  }

  // =========================================================================
  // USER OPERATIONS
  // =========================================================================
  async getUserByEmail(email) {
    if (this.isFirestore) {
      const snap = await firestore.collection('users')
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();
      if (snap.empty) return null;
      const doc = snap.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  async getUserById(id) {
    if (this.isFirestore) {
      const doc = await firestore.collection('users').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    }

    return db.prepare('SELECT id, name, email, phone, location, state, created_at, password_hash FROM users WHERE id = ?').get(id);
  }

  async createUser(userData) {
    if (this.isFirestore) {
      const userRef = firestore.collection('users').doc(userData.id);
      await userRef.set({
        name: userData.name,
        email: userData.email.toLowerCase(),
        password_hash: userData.password_hash,
        phone: userData.phone || '',
        location: userData.location || 'Hassan, Karnataka',
        state: userData.state || 'Karnataka',
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return userData;
    }

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, location, state, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      userData.id,
      userData.name,
      userData.email,
      userData.password_hash,
      userData.phone || '',
      userData.location || 'Hassan, Karnataka',
      userData.state || 'Karnataka'
    );
    return userData;
  }

  async updateUser(id, updates) {
    if (this.isFirestore) {
      const docRef = firestore.collection('users').doc(id);
      await docRef.update({
        ...updates,
        updated_at: new Date().toISOString()
      });
      const updated = await docRef.get();
      return { id: updated.id, ...updated.data() };
    }

    db.prepare(`
      UPDATE users
      SET name = ?, phone = ?, location = ?, state = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      updates.name,
      updates.phone || '',
      updates.location || 'Hassan, Karnataka',
      updates.state || 'Karnataka',
      id
    );

    return db.prepare('SELECT id, name, email, phone, location, state, created_at FROM users WHERE id = ?').get(id);
  }

  // =========================================================================
  // FARM OPERATIONS
  // =========================================================================
  async getFarmsByUserId(userId) {
    if (this.isFirestore) {
      const snap = await firestore.collection('farms')
        .where('user_id', '==', userId)
        .get();
      
      const farms = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      farms.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
      return farms;
    }

    return db.prepare('SELECT * FROM farms WHERE user_id = ? ORDER BY is_primary DESC, created_at ASC').all(userId);
  }

  async getFarmById(farmId, userId) {
    if (this.isFirestore) {
      const doc = await firestore.collection('farms').doc(farmId).get();
      if (!doc.exists) return null;
      const data = doc.data();
      if (data.user_id !== userId) return null;
      return { id: doc.id, ...data };
    }

    return db.prepare('SELECT * FROM farms WHERE id = ? AND user_id = ?').get(farmId, userId);
  }

  async createFarm(farmData) {
    if (this.isFirestore) {
      if (farmData.is_primary) {
        // Clear previous primary
        const prevPrimary = await firestore.collection('farms')
          .where('user_id', '==', farmData.user_id)
          .where('is_primary', '==', 1)
          .get();
        for (const doc of prevPrimary.docs) {
          await doc.ref.update({ is_primary: 0 });
        }
      }

      await firestore.collection('farms').doc(farmData.id).set({
        user_id: farmData.user_id,
        farm_name: farmData.farm_name,
        location: farmData.location,
        district: farmData.district || 'Hassan',
        state: farmData.state || 'Karnataka',
        soil_type: farmData.soil_type,
        area_acres: farmData.area_acres || 3.0,
        is_primary: farmData.is_primary ? 1 : 0,
        created_at: farmData.created_at || new Date().toISOString()
      });

      return farmData;
    }

    if (farmData.is_primary) {
      db.prepare('UPDATE farms SET is_primary = 0 WHERE user_id = ?').run(farmData.user_id);
    }

    db.prepare(`
      INSERT INTO farms (id, user_id, farm_name, location, district, state, soil_type, area_acres, is_primary, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      farmData.id,
      farmData.user_id,
      farmData.farm_name,
      farmData.location,
      farmData.district || 'Hassan',
      farmData.state || 'Karnataka',
      farmData.soil_type,
      farmData.area_acres || 3.0,
      farmData.is_primary ? 1 : 0
    );

    return db.prepare('SELECT * FROM farms WHERE id = ?').get(farmData.id);
  }

  async updateFarm(farmId, userId, updates) {
    if (this.isFirestore) {
      if (updates.is_primary) {
        const prevPrimary = await firestore.collection('farms')
          .where('user_id', '==', userId)
          .where('is_primary', '==', 1)
          .get();
        for (const doc of prevPrimary.docs) {
          if (doc.id !== farmId) await doc.ref.update({ is_primary: 0 });
        }
      }

      const farmRef = firestore.collection('farms').doc(farmId);
      await farmRef.update({
        ...updates,
        updated_at: new Date().toISOString()
      });

      const updated = await farmRef.get();
      return { id: updated.id, ...updated.data() };
    }

    if (updates.is_primary) {
      db.prepare('UPDATE farms SET is_primary = 0 WHERE user_id = ?').run(userId);
    }

    db.prepare(`
      UPDATE farms
      SET farm_name = ?, location = ?, district = ?, state = ?, soil_type = ?, area_acres = ?, is_primary = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(
      updates.farm_name,
      updates.location,
      updates.district || 'Hassan',
      updates.state || 'Karnataka',
      updates.soil_type,
      updates.area_acres,
      updates.is_primary ? 1 : 0,
      farmId,
      userId
    );

    return db.prepare('SELECT * FROM farms WHERE id = ?').get(farmId);
  }

  async deleteFarm(farmId, userId) {
    if (this.isFirestore) {
      await firestore.collection('farms').doc(farmId).delete();
      return true;
    }

    db.prepare('DELETE FROM farms WHERE id = ? AND user_id = ?').run(farmId, userId);
    return true;
  }

  // =========================================================================
  // RECOMMENDATION & CONSULTATION HISTORY OPERATIONS
  // =========================================================================
  async getRecommendationsByUserId(userId) {
    if (this.isFirestore) {
      const snap = await firestore.collection('recommendations')
        .where('user_id', '==', userId)
        .get();

      const recs = [];
      for (const doc of snap.docs) {
        const d = doc.data();
        
        // Fetch weather and irrigation if linked
        let weatherSummary = null;
        let irrigationStatus = 'Advice saved';

        if (d.weather_snapshot_id) {
          const wSnap = await firestore.collection('weather_snapshots').doc(d.weather_snapshot_id).get();
          if (wSnap.exists) {
            const w = wSnap.data();
            weatherSummary = w.temperature != null ? `${w.temperature}°C, ${w.condition_text || 'Clear'}` : null;
          }
        }

        if (d.irrigation_advice_id) {
          const iSnap = await firestore.collection('irrigation_advice').doc(d.irrigation_advice_id).get();
          if (iSnap.exists) {
            irrigationStatus = iSnap.data().status || irrigationStatus;
          }
        }

        let inputs = {};
        let explanations = [];
        try { inputs = typeof d.inputs_json === 'string' ? JSON.parse(d.inputs_json) : (d.inputs || {}); } catch(e) {}
        try { explanations = typeof d.explanation_json === 'string' ? JSON.parse(d.explanation_json) : (d.explanation || []); } catch(e) {}

        recs.push({
          id: doc.id,
          crop: d.crop,
          modelStatus: d.model_status || 'demo',
          modelName: d.model_name || 'demo-agronomic-heuristics-v1',
          confidence: d.confidence || null,
          farmName: d.farm_name || 'Primary Farm',
          location: inputs.location || 'Hassan, Karnataka',
          soilType: inputs.soilType || 'red_loamy',
          season: inputs.season || 'kharif',
          createdAt: d.created_at || new Date().toISOString(),
          weatherSummary,
          weatherProviderStatus: d.weather_provider_status || 'live-provider',
          irrigationStatus,
          summaryExcerpt: explanations[0] || 'Agronomically suited crop recommendation.'
        });
      }

      recs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return recs;
    }

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

    return recommendations.map(rec => {
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
  }

  async getRecommendationById(recordId, userId) {
    if (this.isFirestore) {
      const doc = await firestore.collection('recommendations').doc(recordId).get();
      if (!doc.exists) return null;
      const rec = doc.data();
      if (rec.user_id !== userId) return null;

      let weatherData = null;
      if (rec.weather_snapshot_id) {
        const wSnap = await firestore.collection('weather_snapshots').doc(rec.weather_snapshot_id).get();
        if (wSnap.exists) weatherData = wSnap.data();
      }

      let irrigationData = null;
      if (rec.irrigation_advice_id) {
        const iSnap = await firestore.collection('irrigation_advice').doc(rec.irrigation_advice_id).get();
        if (iSnap.exists) irrigationData = iSnap.data();
      }

      let parsedInputs = typeof rec.inputs_json === 'string' ? JSON.parse(rec.inputs_json) : (rec.inputs || {});
      let parsedExplanation = typeof rec.explanation_json === 'string' ? JSON.parse(rec.explanation_json) : (rec.explanation || []);
      let parsedGrowingConditions = typeof rec.growing_conditions_json === 'string' ? JSON.parse(rec.growing_conditions_json) : (rec.growingConditions || null);

      return {
        id: doc.id,
        crop: rec.crop,
        modelStatus: rec.model_status,
        modelName: rec.model_name,
        confidence: rec.confidence,
        explanation: parsedExplanation,
        growingConditions: parsedGrowingConditions,
        inputs: parsedInputs,
        farm: {
          id: rec.farm_id,
          name: rec.farm_name || 'Primary Farm',
          location: parsedInputs.location || 'Hassan, Karnataka',
          acres: rec.area_acres || 4.5
        },
        weatherSnapshot: weatherData ? {
          location: weatherData.location,
          temperature: weatherData.temperature,
          apparentTemperature: weatherData.apparent_temperature,
          conditionText: weatherData.condition_text,
          humidity: weatherData.humidity,
          windSpeed: weatherData.wind_speed,
          rainChance: weatherData.rain_chance,
          precipitation: weatherData.precipitation,
          forecast: weatherData.forecast || [],
          providerStatus: weatherData.provider_status,
          providerName: weatherData.provider_name,
          observationTime: weatherData.observation_time
        } : null,
        irrigationAdvice: irrigationData ? {
          status: irrigationData.status,
          adviceText: irrigationData.advice_text,
          actions: irrigationData.actions || [],
          missingInputs: irrigationData.missing_inputs || [],
          demoStatus: irrigationData.demo_status,
          soilMoisture: irrigationData.soil_moisture
        } : null,
        createdAt: rec.created_at
      };
    }

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

    if (!rec) return null;

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

    return {
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
        demoStatus: irrigation.demo_status,
        soilMoisture: irrigation.soil_moisture
      } : null,
      createdAt: rec.created_at
    };
  }

  async createRecommendation(recData, weatherData, irrigationData) {
    if (this.isFirestore) {
      let weatherId = null;
      let irrigationId = null;

      if (weatherData) {
        weatherId = `w-${recData.id}`;
        await firestore.collection('weather_snapshots').doc(weatherId).set({
          recommendation_id: recData.id,
          user_id: recData.user_id,
          location: weatherData.location || 'Hassan, Karnataka',
          temperature: weatherData.temperature || null,
          apparent_temperature: weatherData.apparentTemperature || null,
          condition_text: weatherData.conditionText || 'Clear',
          humidity: weatherData.humidity || null,
          wind_speed: weatherData.windSpeed || null,
          rain_chance: weatherData.rainChance || null,
          precipitation: weatherData.precipitation || null,
          forecast: weatherData.forecast || [],
          provider_status: weatherData.providerStatus || 'live-provider',
          provider_name: weatherData.providerName || 'Open-Meteo',
          observation_time: weatherData.observationTime || new Date().toISOString(),
          created_at: new Date().toISOString()
        });
      }

      if (irrigationData) {
        irrigationId = `i-${recData.id}`;
        await firestore.collection('irrigation_advice').doc(irrigationId).set({
          recommendation_id: recData.id,
          user_id: recData.user_id,
          crop: recData.crop,
          soil_type: recData.inputs?.soilType || 'red_loamy',
          soil_moisture: irrigationData.soilMoisture || null,
          status: irrigationData.status || 'Advice saved',
          advice_text: irrigationData.adviceText || '',
          actions: irrigationData.actions || [],
          missing_inputs: irrigationData.missingInputs || [],
          demo_status: irrigationData.demoStatus || 'demo',
          created_at: new Date().toISOString()
        });
      }

      await firestore.collection('recommendations').doc(recData.id).set({
        user_id: recData.user_id,
        farm_id: recData.farm_id || null,
        crop: recData.crop,
        model_status: recData.model_status || 'demo',
        model_name: recData.model_name || 'demo-agronomic-heuristics-v1',
        confidence: recData.confidence != null ? recData.confidence : null,
        explanation: recData.explanation || [],
        growing_conditions: recData.growing_conditions || null,
        inputs: recData.inputs || {},
        weather_snapshot_id: weatherId,
        irrigation_advice_id: irrigationId,
        created_at: new Date().toISOString()
      });

      return recData.id;
    }

    // SQLite mode
    db.prepare(`
      INSERT INTO recommendations (
        id, user_id, farm_id, crop, model_status, model_name, confidence,
        explanation_json, growing_conditions_json, inputs_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      recData.id,
      recData.user_id,
      recData.farm_id || null,
      recData.crop,
      recData.model_status || 'demo',
      recData.model_name || 'demo-agronomic-heuristics-v1',
      recData.confidence != null ? recData.confidence : null,
      JSON.stringify(recData.explanation || []),
      JSON.stringify(recData.growing_conditions || null),
      JSON.stringify(recData.inputs || {})
    );

    if (weatherData) {
      const weatherId = `w-${recData.id}`;
      db.prepare(`
        INSERT INTO weather_snapshots (
          id, recommendation_id, user_id, location, latitude, longitude,
          temperature, apparent_temperature, condition_text, condition_code,
          humidity, wind_speed, rain_chance, precipitation, forecast_json,
          provider_status, provider_name, observation_time, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        weatherId,
        recData.id,
        recData.user_id,
        weatherData.location || 'Hassan, Karnataka',
        weatherData.latitude || null,
        weatherData.longitude || null,
        weatherData.temperature || null,
        weatherData.apparentTemperature || null,
        weatherData.conditionText || 'Clear',
        weatherData.conditionCode || 0,
        weatherData.humidity || null,
        weatherData.windSpeed || null,
        weatherData.rainChance || null,
        weatherData.precipitation || null,
        JSON.stringify(weatherData.forecast || []),
        weatherData.providerStatus || 'live-provider',
        weatherData.providerName || 'Open-Meteo',
        weatherData.observationTime || new Date().toISOString()
      );
    }

    if (irrigationData) {
      const irrigationId = `i-${recData.id}`;
      db.prepare(`
        INSERT INTO irrigation_advice (
          id, recommendation_id, user_id, farm_id, crop, soil_type,
          soil_moisture, status, advice_text, actions_json, missing_inputs_json,
          demo_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        irrigationId,
        recData.id,
        recData.user_id,
        recData.farm_id || null,
        recData.crop,
        recData.inputs?.soilType || 'red_loamy',
        irrigationData.soilMoisture != null ? irrigationData.soilMoisture : null,
        irrigationData.status || 'Advice saved',
        irrigationData.adviceText || '',
        JSON.stringify(irrigationData.actions || []),
        JSON.stringify(irrigationData.missingInputs || []),
        irrigationData.demoStatus || 'demo'
      );
    }

    return recData.id;
  }

  async deleteRecommendation(recordId, userId) {
    if (this.isFirestore) {
      await firestore.collection('recommendations').doc(recordId).delete();
      return true;
    }

    db.prepare('DELETE FROM recommendations WHERE id = ? AND user_id = ?').run(recordId, userId);
    return true;
  }

  async countRecommendationsByUserId(userId) {
    if (this.isFirestore) {
      const snap = await firestore.collection('recommendations')
        .where('user_id', '==', userId)
        .get();
      return snap.size;
    }

    const row = db.prepare('SELECT COUNT(*) as count FROM recommendations WHERE user_id = ?').get(userId);
    return row ? row.count : 0;
  }
}

export const databaseService = new DatabaseService();
export default databaseService;
