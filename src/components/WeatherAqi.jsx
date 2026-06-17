import { useEffect, useState } from 'react';

const WEATHER_CODE_LABELS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Moderate showers',
  82: 'Violent showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail'
};

const SAMPLE_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
  label: 'San Francisco, USA'
};

const getAqiCategory = (pm25) => {
  if (pm25 == null) return 'Unknown';
  if (pm25 <= 12) return 'Good';
  if (pm25 <= 35.4) return 'Moderate';
  if (pm25 <= 55.4) return 'Unhealthy for sensitive groups';
  if (pm25 <= 150.4) return 'Unhealthy';
  if (pm25 <= 250.4) return 'Very unhealthy';
  return 'Hazardous';
};

export default function WeatherAqi() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  const [locationLabel, setLocationLabel] = useState('Current location');
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setTimeout(() => {
        setError('Geolocation not supported. Showing sample weather data.');
        setCoords(SAMPLE_LOCATION);
        setLocationLabel(SAMPLE_LOCATION.label);
      }, 0);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        setLocationLabel('Your location');
      },
      () => {
        setTimeout(() => {
          setError('Location permission denied. Showing sample weather data.');
          setCoords(SAMPLE_LOCATION);
          setLocationLabel(SAMPLE_LOCATION.label);
        }, 0);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!coords) return;

    setTimeout(() => {
      setLoading(true);
      setError(null);
      setWeather(null);
      setAqi(null);
    }, 0);

    const { latitude, longitude } = coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=pm2_5,pm10&timezone=auto`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.current_weather || null);

        if (data.hourly && data.hourly.time && data.hourly.pm2_5) {
          const idx = data.hourly.time.length - 1;
          const pm25 = data.hourly.pm2_5[idx];
          const pm10 = data.hourly.pm10 ? data.hourly.pm10[idx] : null;
          setAqi({ pm2_5: pm25, pm10 });
        }

        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch weather/air data. Please try again later.');
        setLoading(false);
      });
  }, [coords]);

  const weatherDescription = weather ? WEATHER_CODE_LABELS[weather.weathercode] ?? 'Unknown conditions' : '—';
  const aqiCategory = aqi ? getAqiCategory(aqi.pm2_5) : 'Unknown';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4 rounded-2xl shadow-sm text-xs">
      <h4 className="text-sm font-bold mb-2">Live Weather & AQI</h4>
      {loading && <div className="text-slate-500">Loading weather data…</div>}
      {error && <div className="text-rose-500">{error}</div>}

      {!loading && coords && (
        <div className="space-y-2">
          <div className="text-[11px] text-slate-500">{locationLabel}: {coords.latitude.toFixed(3)}, {coords.longitude.toFixed(3)}</div>

          {weather ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{Math.round(weather.temperature)}°C</div>
                <div className="text-[11px] text-slate-500">Wind {Math.round(weather.windspeed)} km/h</div>
                <div className="text-[11px] text-slate-500">{weatherDescription}</div>
              </div>
              <div className="text-[12px] px-3 py-1 bg-slate-50 dark:bg-slate-800/20 rounded-full border border-slate-100 dark:border-slate-850">{weatherDescription}</div>
            </div>
          ) : (
            <div className="text-slate-500">Weather not available</div>
          )}

          {aqi ? (
            <div className="mt-2 space-y-1">
              <div className="text-[11px] text-slate-500">PM2.5: <span className="font-semibold">{aqi.pm2_5}</span> µg/m³</div>
              {aqi.pm10 !== null && <div className="text-[11px] text-slate-500">PM10: <span className="font-semibold">{aqi.pm10}</span> µg/m³</div>}
              <div className="text-[11px] text-slate-500">Air quality: <span className="font-semibold">{aqiCategory}</span></div>
            </div>
          ) : (
            <div className="text-slate-500">AQI not available</div>
          )}
        </div>
      )}
    </div>
  );
}
