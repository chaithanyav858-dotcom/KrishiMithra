/**
 * KrishiMitra - Agricultural Weather Interpretation Engine
 * 
 * Separates raw meteorological provider data from farm-level agronomic interpretation.
 * Translates temperature, humidity, wind, and rainfall into actionable crop advisories.
 */

export function interpretWeatherForAgriculture(weather) {
  const { temperature, humidity, windSpeed, rainChance, precipitation, forecast } = weather;

  const advisories = [];
  let sprayingSuitability = 'Favorable';
  let sprayingNotes = '';
  let diseaseRisk = 'Low';
  let heatStress = 'Normal';

  // 1. Spraying Window & Wind Drift Analysis
  if (windSpeed > 18) {
    sprayingSuitability = 'Unfavorable';
    sprayingNotes = `High wind velocity (${windSpeed} km/h) creates excessive droplet drift. Postpone foliar spraying and pesticide applications.`;
  } else if (rainChance > 50 || precipitation > 2.0) {
    sprayingSuitability = 'Risky';
    sprayingNotes = `Precipitation expected (${rainChance}% rain probability); applied agrochemicals may wash off before plant absorption.`;
  } else if (windSpeed >= 5 && windSpeed <= 15) {
    sprayingSuitability = 'Optimal';
    sprayingNotes = `Gentle breeze (${windSpeed} km/h) and low rain risk provide excellent conditions for foliar nutrient and pest management.`;
  } else {
    sprayingSuitability = 'Moderate';
    sprayingNotes = `Still air may cause thermal inversion; early morning spraying recommended.`;
  }

  // 2. Fungal / Disease Risk Assessment
  if (humidity > 75 && temperature >= 20 && temperature <= 30) {
    diseaseRisk = 'High';
    advisories.push({
      category: 'Disease Watch',
      severity: 'warning',
      title: 'Elevated Fungal & Blight Susceptibility',
      message: `Warm temperature (${temperature}°C) combined with sustained relative humidity (${humidity}%) creates prime incubation conditions for fungal blast, leaf spot, and mildew. Monitor crop canopy closely.`
    });
  } else if (humidity > 65) {
    diseaseRisk = 'Moderate';
    advisories.push({
      category: 'Disease Watch',
      severity: 'info',
      title: 'Moderate Humidity Alert',
      message: 'Maintain adequate row spacing and avoid dense weed growth to facilitate ventilation through crop canopy.'
    });
  } else {
    diseaseRisk = 'Low';
    advisories.push({
      category: 'Disease Watch',
      severity: 'success',
      title: 'Low Fungal Pressure',
      message: 'Ambient humidity levels do not pose immediate spore multiplication pressure.'
    });
  }

  // 3. Thermal Stress & Evaporation
  if (temperature > 34) {
    heatStress = 'High';
    advisories.push({
      category: 'Thermal Stress',
      severity: 'warning',
      title: 'High Evaporative Demand',
      message: `Elevated temperatures (${temperature}°C) increase crop transpiration. Ensure root zone moisture is replenished.`
    });
  } else if (temperature < 15) {
    heatStress = 'Chilling';
    advisories.push({
      category: 'Thermal Stress',
      severity: 'info',
      title: 'Cool Growing Conditions',
      message: 'Cooler temperatures slow down vegetative nutrient uptake in warm-season crops.'
    });
  } else {
    heatStress = 'Optimal';
    advisories.push({
      category: 'Thermal Stress',
      severity: 'success',
      title: 'Favorable Crop Metabolism',
      message: `Temperatures (${temperature}°C) are within the ideal physiological range for photosynthesis and root development.`
    });
  }

  // 4. Short-term Precipitation Outlook
  const upcomingRainyDays = (forecast || []).filter(day => day.rainChance > 45 || day.precipitation > 2.0);
  if (upcomingRainyDays.length > 0) {
    advisories.push({
      category: 'Rainfall Outlook',
      severity: 'info',
      title: 'Rain Anticipated in 48-72h Window',
      message: `${upcomingRainyDays[0].day} forecasts ${upcomingRainyDays[0].rainChance}% rain probability (~${upcomingRainyDays[0].precipitation}mm). Adjust field drainage channels and pause planned surface irrigation.`
    });
  }

  return {
    sprayingAssessment: {
      suitability: sprayingSuitability,
      notes: sprayingNotes,
      windSpeedKmh: windSpeed
    },
    diseaseRisk,
    heatStress,
    advisories,
    disclaimer: 'Agricultural interpretation is derived from meteorological parameters and agronomic guidelines. Local field conditions, canopy density, and microclimates may vary.'
  };
}
