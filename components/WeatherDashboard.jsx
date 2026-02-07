"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ForecastPanel from "@/components/ForecastPanel";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import WeatherHero from "@/components/WeatherHero";
import WeatherStats from "@/components/WeatherStats";

const DEFAULT_CITY = "San Francisco, US";
const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 600000,
};

export default function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [unit, setUnit] = useState("c");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const hasDataRef = useRef(false);
  const requestIdRef = useRef(0);
  const lastRequestKeyRef = useRef("");

  const fetchWeather = useCallback(async ({ lat, lon, city, label }) => {
    const requestKey = lat && lon
      ? `coords:${lat},${lon}`
      : city
        ? `city:${city.toLowerCase()}`
        : "";
    if (hasDataRef.current && requestKey && lastRequestKeyRef.current === requestKey) {
      if (label) {
        setWeather((prev) => (prev ? { ...prev, location: label } : prev));
      }
      return;
    }

    const requestId = ++requestIdRef.current;
    if (!hasDataRef.current) {
      setStatus("loading");
    }
    setIsFetching(true);
    setError("");

    try {
      const params = lat && lon
        ? `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
        : `city=${encodeURIComponent(city)}`;

      const response = await fetch(`/api/weather?${params}`, {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to fetch weather data.");
      }

      if (requestId !== requestIdRef.current) return;

      const normalized = label
        ? { ...payload, location: label }
        : payload;

      setWeather(normalized);
      hasDataRef.current = true;
      lastRequestKeyRef.current = requestKey;
      setStatus("success");
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setWeather(null);
      hasDataRef.current = false;
      lastRequestKeyRef.current = "";
      setStatus("error");
      setError(err.message || "Unable to fetch weather data.");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsFetching(false);
      }
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadDefault = () => {
      if (isCancelled) return;
      setSelectedLocation({ label: DEFAULT_CITY });
      fetchWeather({ city: DEFAULT_CITY, label: DEFAULT_CITY });
    };

    if (!navigator.geolocation) {
      loadDefault();
      return () => {
        isCancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isCancelled) return;
        setSelectedLocation({ label: "Current location" });
        fetchWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => loadDefault(),
      GEO_OPTIONS
    );

    return () => {
      isCancelled = true;
    };
  }, [fetchWeather]);

  const handleSelect = useCallback(
    (item) => {
      setSelectedLocation(item);
      fetchWeather({
        lat: item.lat,
        lon: item.lon,
        label: item.label,
      });
    },
    [fetchWeather]
  );

  const handleSubmit = useCallback(
    (query) => {
      setSelectedLocation({ label: query });
      fetchWeather({ city: query, label: query });
    },
    [fetchWeather]
  );

  const handleUseCurrentLocation = useCallback(() => {
    setSearchResetKey((prev) => prev + 1);
    if (!navigator.geolocation) {
      if (!weather) {
        setSelectedLocation({ label: DEFAULT_CITY });
        fetchWeather({ city: DEFAULT_CITY, label: DEFAULT_CITY });
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation({ label: "Current location" });
        fetchWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        if (!weather) {
          setSelectedLocation({ label: DEFAULT_CITY });
          fetchWeather({ city: DEFAULT_CITY, label: DEFAULT_CITY });
        }
      },
      GEO_OPTIONS
    );
  }, [fetchWeather, weather]);

  const showCurrentLocation =
    !!selectedLocation?.label && selectedLocation.label !== "Current location";
  const handleSetUnit = useCallback((nextUnit) => {
    setUnit(nextUnit === "f" ? "f" : "c");
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 selection:bg-gray-700">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-8 gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Tempest
            </span>
            <h1 className="text-white text-2xl font-semibold tracking-wide">
              Weather Dashboard
            </h1>
          </div>

          <SearchAutocomplete
            disabled={isFetching}
            onSelect={handleSelect}
            onSubmit={handleSubmit}
            placeholder="Search for a city"
            resetKey={searchResetKey}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[45%] shrink-0">
            <WeatherHero
              data={weather}
              status={status}
              error={error}
              showCurrentLocation={showCurrentLocation}
              onUseCurrentLocation={handleUseCurrentLocation}
              isFetching={isFetching}
              unit={unit}
              onSetUnit={handleSetUnit}
            />
          </div>

          <div className="w-full lg:flex-1">
            <WeatherStats data={weather} status={status} unit={unit} />
          </div>
        </div>

        <ForecastPanel
          data={weather?.forecast || []}
          status={status}
          unit={unit}
        />
      </div>
    </div>
  );
}
