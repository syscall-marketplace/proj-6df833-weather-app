import type { TemperatureUnit } from './types';

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9 / 5 + 32) * 10) / 10;
}

export function formatTemp(c: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(c)}°F`;
  }
  return `${Math.round(c * 10) / 10}°C`;
}

export function formatWindSpeed(ms: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    return `${(ms * 2.237).toFixed(1)} mph`;
  }
  return `${ms.toFixed(1)} m/s`;
}

export function formatTime(unixTs: number): string {
  const d = new Date(unixTs * 1000);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatDay(unixTs: number): string {
  const d = new Date(unixTs * 1000);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

export function getWeatherBackground(conditionMain: string): string {
  switch (conditionMain) {
    case 'Clear':
      return 'linear-gradient(135deg, #1e90ff, #87ceeb)';
    case 'Clouds':
      return 'linear-gradient(135deg, #6b7b8d, #9eaab7)';
    case 'Rain':
      return 'linear-gradient(135deg, #4a6fa5, #6b8cba)';
    case 'Drizzle':
      return 'linear-gradient(135deg, #5a7fa5, #8baac4)';
    case 'Thunderstorm':
      return 'linear-gradient(135deg, #2c3e50, #4a6274)';
    case 'Snow':
      return 'linear-gradient(135deg, #83a4d4, #b6d0e2)';
    case 'Mist':
    case 'Fog':
    case 'Haze':
      return 'linear-gradient(135deg, #7f8c8d, #bdc3c7)';
    default:
      return 'linear-gradient(135deg, #636e72, #b2bec3)';
  }
}
