import type { CurrentWeather, ForecastItem, TemperatureUnit } from './types';
import { formatTemp, formatWindSpeed, formatTime, formatDay, getIconUrl } from './utils';

export function renderSearchBar(
  container: HTMLElement,
  query: string,
  onSearch: (city: string) => void,
  onToggleUnit: () => void,
  unit: TemperatureUnit
): void {
  container.innerHTML = `
    <section class="search-bar">
      <input type="text" class="search-input" placeholder="Search city…" value="${query}" />
      <button class="search-btn">Search</button>
      <button class="unit-toggle-btn">${unit === 'celsius' ? '°C' : '°F'}</button>
    </section>
  `;

  const input = container.querySelector<HTMLInputElement>('.search-input')!;
  const searchBtn = container.querySelector<HTMLButtonElement>('.search-btn')!;
  const toggleBtn = container.querySelector<HTMLButtonElement>('.unit-toggle-btn')!;

  const doSearch = () => {
    const val = input.value.trim();
    if (val) onSearch(val);
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
  searchBtn.addEventListener('click', doSearch);
  toggleBtn.addEventListener('click', onToggleUnit);
}

export function renderCurrentWeather(
  container: HTMLElement,
  weather: CurrentWeather,
  unit: TemperatureUnit
): void {
  container.innerHTML = `
    <section class="current-weather">
      <header class="current-weather__header">
        <h2 class="current-weather__city">${weather.city}, ${weather.country}</h2>
      </header>
      <div class="current-weather__main">
        <p class="current-weather__temp">${formatTemp(weather.temp, unit)}</p>
        <p class="current-weather__feels-like">Feels like ${formatTemp(weather.feelsLike, unit)}</p>
        <div class="current-weather__condition">
          <img src="${getIconUrl(weather.condition.icon)}" alt="${weather.condition.description}" />
          <p>${weather.condition.description}</p>
        </div>
      </div>
      <div class="current-weather__details">
        <p>Humidity: ${weather.humidity}%</p>
        <p>Wind: ${formatWindSpeed(weather.windSpeed, unit)}</p>
        <p>Visibility: ${(weather.visibility / 1000).toFixed(1)} km</p>
        <p>Sunrise: ${formatTime(weather.sunrise)}</p>
        <p>Sunset: ${formatTime(weather.sunset)}</p>
      </div>
    </section>
  `;
}

export function renderForecast(
  container: HTMLElement,
  forecast: ForecastItem[],
  unit: TemperatureUnit
): void {
  const cards = forecast
    .map(
      (item) => `
      <article class="forecast-card">
        <p class="forecast-card__day">${formatDay(item.dt)}</p>
        <img src="${getIconUrl(item.condition.icon)}" alt="${item.condition.description}" />
        <p class="forecast-card__temps">
          <span class="forecast-card__max">${formatTemp(item.temp.max, unit)}</span>
          <span class="forecast-card__min">${formatTemp(item.temp.min, unit)}</span>
        </p>
      </article>
    `
    )
    .join('');

  container.innerHTML = `
    <section class="forecast-strip">${cards}</section>
  `;
}

export function renderLoading(container: HTMLElement): void {
  container.innerHTML = `
    <section class="loading">
      <div class="loading__spinner"></div>
      <p>Loading weather data…</p>
    </section>
  `;
}

export function renderError(container: HTMLElement, message: string): void {
  container.innerHTML = `
    <section class="error">
      <p class="error__message">${message}</p>
    </section>
  `;
}

export function renderEmpty(container: HTMLElement): void {
  container.innerHTML = `
    <section class="empty">
      <p>Search for a city to see the weather forecast.</p>
    </section>
  `;
}
