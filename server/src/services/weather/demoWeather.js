/**
 * KrishiMitra - Realistic Regional Demo Weather Provider
 * 
 * Provides fallback meteorological data for Hassan and Karnataka agricultural zones
 * when offline or when external provider calls are disabled/unavailable.
 */

import { DISTRICT_COORDINATES } from '../../config/constants.js';

export function getDemoWeatherData(locationName, customCoords = null) {
  const normLocation = locationName || 'Hassan, Karnataka';
  let district = 'Hassan';

  for (const knownDistrict of Object.keys(DISTRICT_COORDINATES)) {
    if (normLocation.toLowerCase().includes(knownDistrict.toLowerCase())) {
      district = knownDistrict;
      break;
    }
  }

  const coords = customCoords || DISTRICT_COORDINATES[district] || { lat: 13.0033, lon: 76.1004, state: 'Karnataka' };

  // Generate realistic seasonal snapshot
  const now = new Date();
  const currentHour = now.getHours();
  const baseTemp = 25.5 + Math.sin((currentHour - 8) / 12 * Math.PI) * 4;

  const forecast = [
    {
      day: 'Today',
      date: now.toISOString().split('T')[0],
      maxTemp: 29.5,
      minTemp: 18.0,
      rainChance: 35,
      precipitation: 2.1,
      condition: 'Partly Cloudy with Light Afternoon Breeze',
      weatherCode: 2
    },
    {
      day: 'Tomorrow',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      maxTemp: 28.2,
      minTemp: 18.5,
      rainChance: 55,
      precipitation: 5.4,
      condition: 'Scattered Showers Expected',
      weatherCode: 61
    },
    {
      day: 'Day 3',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      maxTemp: 27.0,
      minTemp: 17.5,
      rainChance: 45,
      precipitation: 3.0,
      condition: 'Overcast with Intermittent Drizzle',
      weatherCode: 51
    },
    {
      day: 'Day 4',
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      maxTemp: 29.0,
      minTemp: 17.0,
      rainChance: 15,
      precipitation: 0.0,
      condition: 'Mild & Sunny',
      weatherCode: 1
    },
    {
      day: 'Day 5',
      date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      maxTemp: 30.0,
      minTemp: 18.0,
      rainChance: 10,
      precipitation: 0.0,
      condition: 'Clear Sky',
      weatherCode: 0
    }
  ];

  return {
    location: `${district}, Karnataka`,
    latitude: coords.lat,
    longitude: coords.lon,
    temperature: parseFloat(baseTemp.toFixed(1)),
    apparentTemperature: parseFloat((baseTemp + 1.2).toFixed(1)),
    conditionText: 'Partly Cloudy',
    conditionCode: 2,
    humidity: 68,
    windSpeed: 11.5,
    rainChance: 35,
    precipitation: 0.8,
    observationTime: now.toISOString(),
    forecast,
    providerStatus: 'demo-weather',
    providerName: 'Regional Agro-Weather Simulator (Hassan IMD District Model)',
    note: 'Simulated agro-climatic data modeled for Malnad / Southern Karnataka plateau conditions.'
  };
}
