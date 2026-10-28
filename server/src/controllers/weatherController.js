import { getWeather } from '../services/weather/weatherAdapter.js';

export async function handleGetWeather(req, res) {
  try {
    const { location, lat, lon } = req.query;

    const parsedLat = lat != null && !isNaN(parseFloat(lat)) ? parseFloat(lat) : null;
    const parsedLon = lon != null && !isNaN(parseFloat(lon)) ? parseFloat(lon) : null;

    const weatherData = await getWeather(location, parsedLat, parsedLon);

    return res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Weather controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve meteorological data. Regional fallback will be supplied.'
    });
  }
}
