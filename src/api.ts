import axios from 'axios';
import { API_KEY, OWM_BASE_URL, OWM_GEO_URL } from './config';
import type { Coordinates, CurrentWeather, ForecastItem, WeatherCondition } from './types';

export async function getCoordinates(city: string): Promise<Coordinates> {
  const { data } = await axios.get(`${OWM_GEO_URL}/direct`, {
    params: { q: city, limit: 1, appid: API_KEY },
  });

  if (!data.length) {
    throw new Error(`City not found: ${city}`);
  }

  return { lat: data[0].lat, lon: data[0].lon };
}

export async function getCurrentWeather(coords: Coordinates): Promise<CurrentWeather> {
  const { data } = await axios.get(`${OWM_BASE_URL}/weather`, {
    params: { lat: coords.lat, lon: coords.lon, units: 'metric', appid: API_KEY },
  });

  return {
    city: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    visibility: data.visibility,
    condition: data.weather[0] as WeatherCondition,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    dt: data.dt,
  };
}

export async function getForecast(coords: Coordinates): Promise<ForecastItem[]> {
  const { data } = await axios.get(`${OWM_BASE_URL}/forecast`, {
    params: { lat: coords.lat, lon: coords.lon, units: 'metric', appid: API_KEY },
  });

  const today = new Date().toISOString().slice(0, 10);

  const buckets = new Map<string, {
    minTemp: number;
    maxTemp: number;
    noonCondition: WeatherCondition | null;
    firstCondition: WeatherCondition;
    dt: number;
  }>();

  for (const slot of data.list) {
    const date = slot.dt_txt.slice(0, 10);
    if (date === today) continue;

    const condition: WeatherCondition = slot.weather[0];
    const hour = slot.dt_txt.slice(11, 13);

    if (!buckets.has(date)) {
      buckets.set(date, {
        minTemp: slot.main.temp_min,
        maxTemp: slot.main.temp_max,
        noonCondition: hour === '12' ? condition : null,
        firstCondition: condition,
        dt: slot.dt,
      });
    } else {
      const bucket = buckets.get(date)!;
      bucket.minTemp = Math.min(bucket.minTemp, slot.main.temp_min);
      bucket.maxTemp = Math.max(bucket.maxTemp, slot.main.temp_max);
      if (hour === '12') {
        bucket.noonCondition = condition;
      }
    }
  }

  const result: ForecastItem[] = [];
  for (const [, bucket] of buckets) {
    if (result.length >= 5) break;
    result.push({
      dt: bucket.dt,
      temp: { min: bucket.minTemp, max: bucket.maxTemp },
      condition: bucket.noonCondition ?? bucket.firstCondition,
    });
  }

  return result;
}

export default { getCoordinates, getCurrentWeather, getForecast };
