export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;           // Celsius
  feelsLike: number;      // Celsius
  humidity: number;       // percent
  windSpeed: number;      // m/s
  visibility: number;     // metres
  condition: WeatherCondition;
  sunrise: number;        // Unix timestamp
  sunset: number;         // Unix timestamp
  dt: number;             // Unix timestamp
}

export interface ForecastItem {
  dt: number;             // Unix timestamp
  temp: { min: number; max: number };
  condition: WeatherCondition;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface AppState {
  current: CurrentWeather | null;
  forecast: ForecastItem[];
  unit: TemperatureUnit;
  loading: boolean;
  error: string | null;
  query: string;
}
