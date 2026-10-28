/**
 * KrishiMitra - Open-Meteo Live Weather Integration
 * 
 * Open-Meteo provides high-resolution meteorological forecasts worldwide
 * without requiring private API keys, ensuring reliable live data for college project demonstrations.
 */

import { DISTRICT_COORDINATES } from '../../config/constants.js';

// WMO Weather Interpretation Codes
const WMO_CODES = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  80: 'Slight Rain Showers',
  81: 'Moderate Rain Showers',
  82: 'Violent Rain Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Slight Hail',
  99: 'Thunderstorm with Heavy Hail'
};

export async function geocodeLocation(query) {
  const cleanQuery = query.trim();
  
  // Quick check against local district coordinate dictionary
  for (const [district, coords] of Object.entries(DISTRICT_COORDINATES)) {
    if (cleanQuery.toLowerCase().includes(district.toLowerCase())) {
      return {
        name: `${district}, Karnataka`,
        latitude: coords.lat,
        longitude: coords.lon,
        country: 'India'
      };
    }
  }

  // Fallback to Open-Meteo Geocoding API
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=1&language=en&format=json`;
  const response = await fetch(url, { headers: { 'User-Agent': 'KrishiMitra-AgriApp/1.0' } });
  
  if (!response.ok) {
    throw new Error(`Geocoding failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    // Return Hassan default if query not found
    return {
      name: query,
      latitude: DISTRICT_COORDINATES['Hassan'].lat,
      longitude: DISTRICT_COORDINATES['Hassan'].lon,
      country: 'India'
    };
  }

  const result = data.results[0];
  return {
    name: `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}, ${result.country || 'India'}`,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country
  };
}

export async function fetchLiveWeather(latitude, longitude, locationName = 'Hassan, Karnataka') {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    const weatherCode = current.weather_code || 0;
    const conditionText = WMO_CODES[weatherCode] || 'Clear / Fair';

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Map next 5-day forecast
    const forecast = [];
    if (daily && daily.time) {
      const count = Math.min(5, daily.time.length);
      for (let i = 0; i < count; i++) {
        const dateObj = new Date(daily.time[i]);
        const dayLabel = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : dayNames[dateObj.getDay()]);
        const dCode = daily.weather_code[i] || 0;

        forecast.push({
          day: dayLabel,
          date: daily.time[i],
          maxTemp: Math.round(daily.temperature_2m_max[i] * 10) / 10,
          minTemp: Math.round(daily.temperature_2m_min[i] * 10) / 10,
          rainChance: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
          precipitation: daily.precipitation_sum ? Math.round(daily.precipitation_sum[i] * 10) / 10 : 0,
          condition: WMO_CODES[dCode] || 'Fair',
          weatherCode: dCode
        });
      }
    }

    return {
      location: locationName,
      latitude,
      longitude,
      temperature: Math.round(current.temperature_2m * 10) / 10,
      apparentTemperature: Math.round(current.apparent_temperature * 10) / 10,
      conditionText,
      conditionCode: weatherCode,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      rainChance: forecast.length > 0 ? forecast[0].rainChance : 0,
      precipitation: current.precipitation || 0,
      observationTime: current.time,
      forecast,
      providerStatus: 'live-provider',
      providerName: 'Open-Meteo Global Meteorological Forecast Service',
      note: 'Live observational and numerical weather prediction feed.'
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
