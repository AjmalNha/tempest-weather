import "server-only";

import {
  formatCondition,
  formatDateLabel,
  formatDayLabel,
  formatShortDay,
  formatTime,
  getDateKey,
  toKm,
  toKmh,
} from "@/utils/formatters";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const API_BASE_URL = process.env.OPENWEATHER_API_BASE_URL;
const GEO_BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_GEO_API_URL;
const ICONS = {
  clearDay: "/weather/sun.png",
  clearNight: "/weather/moon.png",
  fewCloudsDay: "/weather/sun-clouds.png",
  fewCloudsNight: "/weather/moon-stars-cloud.png",
  scatteredCloudsDay: "/weather/sun-clouds-1.png",
  scatteredCloudsNight: "/weather/moon-clouds.png",
  brokenCloudsDay: "/weather/sun-clouds.png",
  brokenCloudsNight: "/weather/moon-clouds.png",
  overcastDay: "/weather/sun-clouds.png",
  overcastNight: "/weather/moon-clouds.png",
  rainDay: "/weather/rain.png",
  rainNight: "/weather/moon-rain.png",
  rain: "/weather/rain.png",
  thunder: "/weather/thunder.png",
  fogDay: "/weather/sun-clouds.png",
  fogNight: "/weather/moon-clouds.png",
  fallbackDay: "/weather/sun-clouds.png",
  fallbackNight: "/weather/moon-clouds.png",
};

const FALLBACK_ICON = ICONS.fallbackDay;

function ensureEnv() {
  if (!API_KEY || !API_BASE_URL || !GEO_BASE_URL) {
    throw new Error("Missing OpenWeather environment variables.");
  }
}

function buildIconUrl({ id, code }) {
  if (typeof id !== "number") return FALLBACK_ICON;
  const isNight = typeof code === "string" && code.endsWith("n");

  if (id >= 200 && id < 300) return ICONS.thunder;
  if (id >= 300 && id < 400) return isNight ? ICONS.rainNight : ICONS.rainDay;
  if (id >= 500 && id < 600) {
    if (id >= 502 || id === 511 || id >= 520) return ICONS.rain;
    return isNight ? ICONS.rainNight : ICONS.rainDay;
  }
  if (id >= 600 && id < 700) return ICONS.rain;
  if (id >= 700 && id < 800) return isNight ? ICONS.fogNight : ICONS.fogDay;
  if (id === 800) return isNight ? ICONS.clearNight : ICONS.clearDay;
  if (id === 801) {
    return isNight ? ICONS.fewCloudsNight : ICONS.fewCloudsDay;
  }
  if (id === 802) {
    return isNight ? ICONS.scatteredCloudsNight : ICONS.scatteredCloudsDay;
  }
  if (id === 803) {
    return isNight ? ICONS.brokenCloudsNight : ICONS.brokenCloudsDay;
  }
  if (id === 804) {
    return isNight ? ICONS.overcastNight : ICONS.overcastDay;
  }

  return isNight ? ICONS.fallbackNight : ICONS.fallbackDay;
}

async function fetchJson(url) {
  const response = await fetch(url, { next: { revalidate: 300 } });
  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || "Unable to fetch weather data.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

function toZonedHour(timestampSeconds, offsetSeconds) {
  if (typeof timestampSeconds !== "number") return null;
  const date = new Date((timestampSeconds + offsetSeconds) * 1000);
  return date.getUTCHours();
}

function buildForecast(list, timezoneOffset, currentTimestamp) {
  if (!Array.isArray(list)) return [];
  const grouped = new Map();

  list.forEach((entry) => {
    const key = getDateKey(entry.dt, timezoneOffset);
    if (!key) return;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(entry);
  });

  const todayKey = getDateKey(currentTimestamp, timezoneOffset);
  const sortedKeys = Array.from(grouped.keys()).sort();

  const forecast = sortedKeys.map((key) => {
    const entries = grouped.get(key) || [];
    let selected = entries[0];
    let closest = Infinity;
    entries.forEach((entry) => {
      const hour = toZonedHour(entry.dt, timezoneOffset);
      if (hour === null) return;
      const diff = Math.abs(hour - 12);
      if (diff < closest) {
        closest = diff;
        selected = entry;
      }
    });

    const tempValue = selected?.main?.temp ?? null;
    const iconCode = selected?.weather?.[0]?.icon;
    const iconId = selected?.weather?.[0]?.id;

    return {
      id: `${key}`,
      day: key === todayKey ? "Today" : formatShortDay(selected?.dt, timezoneOffset),
      temp: typeof tempValue === "number" ? Math.round(tempValue) : null,
      icon: buildIconUrl({ id: iconId, code: iconCode }),
    };
  });

  return forecast.slice(0, 10);
}

function normalizeWeather(current, forecast) {
  if (!current) return null;

  const timezoneOffset =
    current.timezone ?? forecast?.city?.timezone ?? 0;
  const iconCode = current.weather?.[0]?.icon;
  const iconId = current.weather?.[0]?.id;
  const tempValue = current.main?.temp;
  const tempLow = current.main?.temp_min;
  const tempHigh = current.main?.temp_max;

  return {
    location: `${current.name || ""}${current.sys?.country ? `, ${current.sys.country}` : ""}`,
    dayLabel: formatDayLabel(current.dt, timezoneOffset),
    dateLabel: formatDateLabel(current.dt, timezoneOffset),
    temp: typeof tempValue === "number" ? Math.round(tempValue) : null,
    tempLow: typeof tempLow === "number" ? Math.round(tempLow) : null,
    tempHigh: typeof tempHigh === "number" ? Math.round(tempHigh) : null,
    condition: formatCondition(current.weather?.[0]?.description),
    feelsLike:
      typeof current.main?.feels_like === "number"
        ? Math.round(current.main.feels_like)
        : null,
    humidity: current.main?.humidity ?? null,
    windSpeed: toKmh(current.wind?.speed),
    uvIndex: null,
    visibility: toKm(current.visibility),
    sunrise: formatTime(current.sys?.sunrise, timezoneOffset),
    sunset: formatTime(current.sys?.sunset, timezoneOffset),
    observedTime: `Updated ${formatTime(current.dt, timezoneOffset)}`,
    icon: buildIconUrl({ id: iconId, code: iconCode }),
    iconCode: iconCode || "",
    forecast: buildForecast(forecast?.list || [], timezoneOffset, current.dt),
  };
}

export async function getGeoSuggestions(query) {
  ensureEnv();
  if (!query) return [];

  const url = `${GEO_BASE_URL}/direct?q=${encodeURIComponent(
    query
  )}&limit=5&appid=${API_KEY}`;
  const data = await fetchJson(url);

  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const labelParts = [item.name];
    if (item.state) labelParts.push(item.state);
    if (item.country) labelParts.push(item.country);

    return {
      id: `${item.lat}-${item.lon}`,
      name: item.name,
      state: item.state || "",
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      label: labelParts.filter(Boolean).join(", "),
    };
  });
}

export async function getWeatherByCoords(lat, lon) {
  ensureEnv();
  if (lat === undefined || lon === undefined) {
    throw new Error("Latitude and longitude are required.");
  }

  const params = `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(
    lon
  )}&units=metric&appid=${API_KEY}`;

  const [current, forecast] = await Promise.all([
    fetchJson(`${API_BASE_URL}/weather?${params}`),
    fetchJson(`${API_BASE_URL}/forecast?${params}`),
  ]);

  return normalizeWeather(current, forecast);
}

export async function getWeatherByCity(city) {
  ensureEnv();
  if (!city) throw new Error("City is required.");

  const suggestions = await getGeoSuggestions(city);
  if (!suggestions.length) {
    const error = new Error("City not found.");
    error.status = 404;
    throw error;
  }

  const target = suggestions[0];
  return getWeatherByCoords(target.lat, target.lon);
}
