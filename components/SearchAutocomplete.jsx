"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function Spinner({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-9-9" />
    </svg>
  );
}

export default function SearchAutocomplete({
  disabled,
  onSelect,
  onSubmit,
  resetKey = 0,
  placeholder = "Search your location",
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const blurTimeout = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => () => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
    }
  }, []);

  useEffect(() => {
    requestIdRef.current += 1;
    setQuery("");
    setSuggestions([]);
    setError("");
    setIsOpen(false);
    setIsLoading(false);
  }, [resetKey]);

  useEffect(() => {
    if (disabled) {
      requestIdRef.current += 1;
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      requestIdRef.current += 1;
      setSuggestions([]);
      setError("");
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError("");
      const requestId = ++requestIdRef.current;
      try {
        const response = await fetch(
          `/api/geo?q=${encodeURIComponent(trimmed)}`,
          { cache: "no-store" }
        );
        if (!response.ok) {
          throw new Error("Unable to fetch suggestions.");
        }
        const data = await response.json();
        if (!isActive || requestId !== requestIdRef.current) return;
        setSuggestions(Array.isArray(data) ? data : []);
        setIsOpen(true);
        if (!data || data.length === 0) {
          setError("No matching cities found.");
        }
      } catch (err) {
        if (!isActive || requestId !== requestIdRef.current) return;
        setSuggestions([]);
        setError("Unable to fetch suggestions.");
        setIsOpen(true);
      } finally {
        if (isActive && requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [query, disabled]);

  const handleChange = useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      requestIdRef.current += 1;
      if (onSubmit) onSubmit(trimmed);
      setSuggestions([]);
      setError("");
      setIsOpen(false);
      setIsLoading(false);
    },
    [onSubmit, query]
  );

  const handleSelect = useCallback(
    (item) => {
      requestIdRef.current += 1;
      setQuery(item.label);
      setIsOpen(false);
      setSuggestions([]);
      setError("");
      setIsLoading(false);
      if (onSelect) onSelect(item);
    },
    [onSelect]
  );

  const handleSuggestionMouseDown = useCallback(
    (event) => {
      const index = Number(event.currentTarget.dataset.index);
      if (!Number.isFinite(index)) return;
      const item = suggestions[index];
      if (!item) return;
      handleSelect(item);
    },
    [handleSelect, suggestions]
  );

  const handleBlur = useCallback(() => {
    blurTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  const handleFocus = useCallback(() => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
    }
    if (suggestions.length > 0 || error) {
      setIsOpen(true);
    }
  }, [error, suggestions.length]);

  return (
    <div className="relative w-full md:w-[420px]">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full bg-card text-white placeholder-gray-500 rounded-full py-3 pl-12 pr-10 outline-none focus:ring-2 focus:ring-gray-700 transition-all disabled:opacity-60"
          aria-label="Search your location"
          disabled={disabled}
        />
        {isLoading ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Spinner className="w-5 h-5 animate-spin" />
          </div>
        ) : null}
      </form>

      {isOpen ? (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-border bg-popover shadow-xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  data-index={index}
                  onMouseDown={handleSuggestionMouseDown}
                  className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-surface transition-colors"
                >
                  {item.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                {error || "Start typing to search."}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
