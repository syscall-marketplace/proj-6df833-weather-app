import './styles.css';
import { getState, setState, subscribe } from './store';
import { getCoordinates, getCurrentWeather, getForecast } from './api';
import {
  renderSearchBar,
  renderCurrentWeather,
  renderForecast,
  renderLoading,
  renderError,
  renderEmpty,
} from './components';
import type { AppState } from './types';

const appEl = document.getElementById('app') as HTMLElement;

// Create persistent child containers
let searchSection = document.getElementById('search-section');
let weatherSection = document.getElementById('weather-section');

if (!searchSection) {
  searchSection = document.createElement('div');
  searchSection.id = 'search-section';
  appEl.appendChild(searchSection);
}

if (!weatherSection) {
  weatherSection = document.createElement('div');
  weatherSection.id = 'weather-section';
  appEl.appendChild(weatherSection);
}

async function searchCity(city: string): Promise<void> {
  setState({ loading: true, error: null, query: city });

  try {
    const coords = await getCoordinates(city);
    const [current, forecast] = await Promise.all([
      getCurrentWeather(coords),
      getForecast(coords),
    ]);
    setState({ current, forecast, loading: false });
  } catch (err) {
    setState({
      loading: false,
      error: (err as Error).message ?? 'Failed to fetch weather',
    });
  }
}

function toggleUnit(): void {
  const { unit } = getState();
  setState({ unit: unit === 'celsius' ? 'fahrenheit' : 'celsius' });
}

function render(state: AppState): void {
  renderSearchBar(searchSection!, state.query, searchCity, toggleUnit, state.unit);

  document.body.dataset.condition = state.current?.condition.main ?? '';

  if (state.loading) {
    renderLoading(weatherSection!);
  } else if (state.error) {
    renderError(weatherSection!, state.error);
  } else if (state.current) {
    const currentContainer = document.createElement('div');
    const forecastContainer = document.createElement('div');
    renderCurrentWeather(currentContainer, state.current, state.unit);
    renderForecast(forecastContainer, state.forecast, state.unit);
    weatherSection!.innerHTML = '';
    weatherSection!.appendChild(currentContainer);
    weatherSection!.appendChild(forecastContainer);
  } else {
    renderEmpty(weatherSection!);
  }
}

subscribe(render);
render(getState());

// Auto-load last searched city
const initialQuery = getState().query;
if (initialQuery) {
  searchCity(initialQuery);
}
