import type { AppState, TemperatureUnit } from './types';

export type { AppState };

type Listener = (state: AppState) => void;

const listeners: Set<Listener> = new Set();

const storedUnit = (typeof localStorage !== 'undefined'
  ? localStorage.getItem('weather_unit')
  : null) as TemperatureUnit | null;

const storedCity = typeof localStorage !== 'undefined'
  ? localStorage.getItem('weather_last_city')
  : null;

let state: AppState = {
  current: null,
  forecast: [],
  unit: storedUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
  loading: false,
  error: null,
  query: storedCity ?? '',
};

export function getState(): AppState {
  return { ...state };
}

export function setState(patch: Partial<AppState>): void {
  state = { ...state, ...patch };

  if (patch.unit !== undefined) {
    localStorage.setItem('weather_unit', state.unit);
  }

  if (patch.current != null) {
    localStorage.setItem('weather_last_city', state.current!.city);
  }

  for (const listener of listeners) {
    listener(getState());
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
