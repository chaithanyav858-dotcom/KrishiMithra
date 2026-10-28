/**
 * KrishiMitra - Unified Weather Adapter
 * 
 * Orchestrates weather resolution:
 * 1. Checks provider setting (Open-Meteo or Demo).
 * 2. Fetches live data with timeout and error protection.
 * 3. Gracefully falls back to realistic regional demo weather when offline or on failure.
 * 4. Runs agricultural weather interpretation engine.
 */

import { fetchLiveWeather, geocodeLocation } from './openMeteoService.js';
import { getDemoWeatherData } from './demoWeather.js';
import { interpretWeatherForAgriculture } from './agriWeatherInterpreter.js';
import { DEFAULT_COORDS, DEFAULT_LOCATION } from '../../config/constants.js';

export async function getWeather(locationQuery, userLat = null, userLon = null) {
  let lat = userLat;
  let lon = userLon;
  let resolvedLocationName = locationQuery || DEFAULT_LOCATION;

  // If coordinates not provided directly by client geolocation, resolve via geocoder
  if (lat == null || lon == null) {
    try {
      const geoResult = await geocodeLocation(resolvedLocationName);
      lat = geoResult.latitude;
      lon = geoResult.longitude;
      resolvedLocationName = geoResult.name;
    } catch (geoError) {
      console.warn(`Geocoding error for "${locationQuery}":`, geoError.message);
      lat = DEFAULT_COORDS.lat;
      lon = DEFAULT_COORDS.lon;
    }
  }

  // Attempt live weather fetch if not explicitly forced to offline demo mode
  const forceDemo = process.env.WEATHER_PROVIDER === 'demo';

  if (!forceDemo) {
    try {
      const liveData = await fetchLiveWeather(lat, lon, resolvedLocationName);
      const interpretation = interpretWeatherForAgriculture(liveData);

      return {
        ...liveData,
        agriculturalInterpretation: interpretation
      };
    } catch (err) {
      console.warn(`Live weather fetch failed (${err.message}). Using regional demo weather.`);
    }
  }

  // Fallback / Demo weather
  const demoData = getDemoWeatherData(resolvedLocationName, { lat, lon });
  const interpretation = interpretWeatherForAgriculture(demoData);

  return {
    ...demoData,
    agriculturalInterpretation: interpretation,
    fallbackNotice: !forceDemo ? 'Live weather service unreachable. Presenting regional simulated agro-climatic conditions.' : null
  };
}
