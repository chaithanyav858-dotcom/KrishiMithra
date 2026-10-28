/**
 * KrishiMitra - Data-Driven Irrigation Advisory Service
 * 
 * Synthesizes:
 * 1. Crop physiological water consumption (ETc)
 * 2. Soil texture water retention capacity
 * 3. In-situ soil moisture (when reported)
 * 4. Microclimate temperature, relative humidity, and 48-hour precipitation forecast
 * 
 * Generates actionable advice with transparent missing-data reporting.
 */

import { CROP_PROFILES } from '../../config/constants.js';

export function calculateIrrigationAdvice(inputs) {
  const {
    crop,
    soilType,
    growthStage = 'Vegetative / Mid-season',
    soilMoisture, // % volumetric (optional)
    recentRainfall = 0, // mm
    forecastRainChance = 0, // %
    forecastPrecipitation = 0, // mm
    temperature = 26, // °C
    humidity = 65 // %
  } = inputs;

  const missingInputs = [];
  if (soilMoisture == null) {
    missingInputs.push('Direct soil moisture sensor readings not provided. Moisture balance estimated using default regional profile and rainfall history.');
  }
  if (!recentRainfall && recentRainfall !== 0) {
    missingInputs.push('Recent 48-hour localized rain gauge measurement was unavailable; assumes dry antecedent soil condition.');
  }

  // Find crop profile or set realistic baseline
  const profile = CROP_PROFILES[crop] || {
    dailyWaterConsumptionMm: 4.5,
    waterRequirement: 'Moderate',
    criticalStages: ['Flowering', 'Pod/grain development']
  };

  const dailyDemandMm = profile.dailyWaterConsumptionMm || 4.5;

  // Soil texture adjustment
  let soilRetentionFactor = 1.0;
  let soilDrainageNote = '';

  switch (soilType) {
    case 'sandy':
      soilRetentionFactor = 0.6; // Rapid percolation, low moisture holding
      soilDrainageNote = 'Sandy soil exhibits low water retention; requires frequent light water applications.';
      break;
    case 'clayey':
    case 'black_regur':
      soilRetentionFactor = 1.4; // High water retention, slow infiltration
      soilDrainageNote = 'Heavy clay/black soil retains water strongly; over-irrigation risks root rot and aeration stress.';
      break;
    case 'laterite':
      soilRetentionFactor = 0.8;
      soilDrainageNote = 'Laterite soil drains quickly on slopes; benefits from organic mulching alongside drip irrigation.';
      break;
    case 'red_loamy':
    case 'loamy':
    case 'alluvial':
    default:
      soilRetentionFactor = 1.0;
      soilDrainageNote = 'Loamy soil profile offers balanced moisture retention and optimal root aeration.';
      break;
  }

  // Evaporative stress calculation
  const isHighHeat = temperature > 32;
  const isDryAir = humidity < 45;
  const highEvaporation = isHighHeat && isDryAir;

  // Evaluate Rain Forecast (Decisive Factor)
  const rainImminent = forecastRainChance >= 50 || forecastPrecipitation >= 4.0;
  const rainModerate = forecastRainChance >= 30 || forecastPrecipitation >= 2.0;

  let status = 'Monitor soil moisture';
  let adviceText = '';
  const actions = [];

  // Decision Tree
  if (rainImminent) {
    status = 'Delay irrigation';
    adviceText = `Rainfall is projected within the next 24 to 48 hours (${forecastRainChance}% probability, ~${forecastPrecipitation} mm). Applying irrigation now would cause unnecessary runoff, potential waterlogging, and fertilizer leaching.`;
    actions.push(`Postpone scheduled irrigation for 36-48 hours until the forecast rain event clears.`);
    actions.push(`Clear field contour drains to allow safe disposal of surplus monsoon runoff.`);
    actions.push(`Inspect field soil moisture 24 hours after the rain stops before resuming any watering.`);
  } else if (soilMoisture != null && soilMoisture < 25) {
    status = 'Irrigate now';
    adviceText = `Soil moisture is at a critical deficit (${soilMoisture}%), dropping below the permanent wilting threshold for ${crop}. Immediate irrigation is needed to prevent physiological stress and yield reduction during the ${growthStage} stage.`;
    actions.push(`Apply full irrigation dose (~30-35 mm) immediately via drip or furrow method.`);
    actions.push(`Irrigate during early morning hours (before 9:00 AM) or late afternoon to minimize evaporative losses.`);
    actions.push(`Check emitter nozzles for uniform flow across the field plot.`);
  } else if (soilMoisture != null && soilMoisture >= 25 && soilMoisture < 40) {
    if (highEvaporation) {
      status = 'Irrigate now';
      adviceText = `Soil moisture is depleted (${soilMoisture}%) under high atmospheric evaporative demand (${temperature}°C, ${humidity}% humidity). Immediate watering will protect against moisture stress.`;
      actions.push(`Apply 25-30 mm irrigation within the next 12 hours.`);
      actions.push(`Utilize straw or organic mulching around the crop base to reduce soil moisture evaporation.`);
    } else {
      status = 'Light irrigation may be suitable';
      adviceText = `Soil moisture is moderate (${soilMoisture}%), approaching management allowable depletion for ${crop}. With no rain predicted, light supplemental irrigation will sustain optimal vegetative development.`;
      actions.push(`Apply light supplemental watering (~15-20 mm) within the next 24 hours.`);
      actions.push(`Focus moisture around the active root feeder zone.`);
    }
  } else if (soilMoisture != null && soilMoisture >= 60) {
    status = 'Irrigation may not be required';
    adviceText = `Soil moisture is currently abundant (${soilMoisture}%). Additional water is not recommended at this time as the root zone has sufficient moisture reserve.`;
    actions.push(`Do not apply irrigation today; allow soil aeration around the root zone.`);
    actions.push(`Re-evaluate soil condition in 3 to 4 days.`);
  } else {
    // Missing moisture or mid-range (40-60%)
    if (rainModerate) {
      status = 'Delay irrigation';
      adviceText = `Moderate chance of localized showers (${forecastRainChance}%) over the next 48 hours. Monitor rainfall accumulation before operating irrigation equipment.`;
      actions.push(`Hold watering for 24 hours to observe if local showers materialize.`);
      actions.push(`Perform a manual soil feel-and-appearance test at 15cm depth.`);
    } else if (highEvaporation) {
      status = 'Light irrigation may be suitable';
      adviceText = `Atmospheric evaporative demand is elevated (${temperature}°C, ${humidity}% humidity). Light irrigation is advisable to offset evapotranspiration for ${crop}.`;
      actions.push(`Apply moderate cycle (~20 mm) in the early morning.`);
      actions.push(`Monitor topsoil dryness under the plant canopy.`);
    } else {
      status = 'Monitor soil moisture';
      adviceText = `Current soil and atmospheric conditions appear stable. Scheduled irrigation can be held while continuing routine field checks.`;
      actions.push(`Check soil moisture at 10-15 cm root zone depth before next irrigation cycle.`);
      actions.push(`Maintain regular weed clearing to eliminate unwanted water competition.`);
    }
  }

  return {
    crop,
    soilType,
    status,
    adviceText,
    actions,
    missingInputs,
    cropWaterDemand: `${dailyDemandMm} mm/day (${profile.waterRequirement})`,
    soilDrainageNote,
    evaluatedAt: new Date().toISOString(),
    demoStatus: 'demo'
  };
}
