import React, { useState, useEffect } from 'react';
import { useFlow } from '../context/FlowContext';
import { weatherApi } from '../api/agriApi';
import { WeatherCard, ForecastList, AgriWeatherAlerts } from '../components/weather/WeatherView';
import { LoadingSpinner, AlertBanner } from '../components/common/UiFeedback';
import { 
  CloudSun, 
  Search, 
  Navigation, 
  MapPin, 
  Droplets, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function WeatherPage({ setActivePage }) {
  const { weatherSnapshot, setWeatherSnapshot, formData, updateFormData } = useFlow();

  const [locationInput, setLocationInput] = useState(formData.location || 'Hassan, Karnataka');
  const [weatherData, setWeatherData] = useState(weatherSnapshot);
  const [isLoading, setIsLoading] = useState(!weatherSnapshot);
  const [errorMessage, setErrorMessage] = useState(null);
  const [geoNotice, setGeoNotice] = useState(null);

  const popularDistricts = [
    'Hassan', 
    'Mandya', 
    'Mysuru', 
    'Shivamogga', 
    'Chikkamagaluru', 
    'Belagavi', 
    'Dharwad', 
    'Tumakuru'
  ];

  const fetchWeather = async (loc, lat = null, lon = null) => {
    setIsLoading(true);
    setErrorMessage(null);
    setGeoNotice(null);

    try {
      const response = await weatherApi.getWeather(loc, lat, lon);
      if (response.success && response.data) {
        setWeatherData(response.data);
        setWeatherSnapshot(response.data);
        if (loc) {
          updateFormData({ location: response.data.location || loc });
          setLocationInput(response.data.location || loc);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      console.error('Weather page fetch error:', err);
      setErrorMessage(err.message || 'Unable to retrieve meteorological data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!weatherData) {
      fetchWeather(locationInput);
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    fetchWeather(locationInput.trim());
  };

  const handleDistrictSelect = (district) => {
    const loc = `${district}, Karnataka`;
    setLocationInput(loc);
    fetchWeather(loc);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Browser geolocation is not supported on this device. Please select your district manually below.');
      return;
    }

    setIsLoading(true);
    setGeoNotice('Requesting browser location permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoNotice(null);
        fetchWeather(null, latitude, longitude);
      },
      (error) => {
        setIsLoading(false);
        let msg = 'Location access was not granted. Please select your agricultural district manually.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Geolocation permission was denied. You can easily choose from the popular Karnataka agricultural districts below or type your location.';
        }
        setGeoNotice(msg);
      },
      { timeout: 8000 }
    );
  };

  const handleProceedToIrrigation = () => {
    setActivePage('irrigation');
  };

  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soil-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <CloudSun className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Localized Agro-Meteorology
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time conditions, 5-day forecasts, and agricultural interpretation for foliar spraying and disease prevention.
          </p>
        </div>

        <button
          onClick={handleProceedToIrrigation}
          className="px-5 py-2.5 rounded-xl bg-agri hover:bg-agri-deep text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Droplets className="w-4 h-4 text-agri-mist" />
          <span>Go to Irrigation Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Location Search Bar & Geolocation Button */}
      <div className="agri-card p-5 bg-white border-soil-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Search city, district, or taluk (e.g. Hassan, Sakleshpur, Mandya)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-soil-300 text-sm focus:border-agri focus:ring-1 focus:ring-agri bg-[#faf9f7]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-agri hover:bg-agri-deep text-white text-xs font-bold transition-colors"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleGeolocation}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-soil-300 hover:border-agri text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
              title="Detect GPS coordinates via browser"
            >
              <Navigation className="w-3.5 h-3.5 text-agri" />
              <span>Use GPS</span>
            </button>
          </div>
        </form>

        {/* Quick District Buttons */}
        <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-gray-500 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            Quick Select:
          </span>
          {popularDistricts.map((district) => (
            <button
              key={district}
              type="button"
              onClick={() => handleDistrictSelect(district)}
              className="px-2.5 py-1 rounded-lg bg-[#faf8f5] hover:bg-agri-mist hover:text-agri-deep border border-soil-200 text-gray-700 text-xs font-medium transition-colors"
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {geoNotice && (
        <AlertBanner type="info" message={geoNotice} onClose={() => setGeoNotice(null)} />
      )}
      {errorMessage && (
        <AlertBanner type="danger" message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}

      {/* Weather Content */}
      {isLoading ? (
        <LoadingSpinner message="Fetching meteorological readings and forecast..." />
      ) : weatherData ? (
        <div className="space-y-6">
          <WeatherCard weather={weatherData} />
          <ForecastList forecast={weatherData.forecast} />
          <AgriWeatherAlerts interpretation={weatherData.agriculturalInterpretation} />
        </div>
      ) : null}
    </div>
  );
}
