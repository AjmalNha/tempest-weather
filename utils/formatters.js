const DEFAULT_LOCALE = "en-US";

function toZonedDate(timestampSeconds, offsetSeconds = 0) {
  if (typeof timestampSeconds !== "number") return null;
  return new Date((timestampSeconds + offsetSeconds) * 1000);
}

export function formatTime(timestampSeconds, offsetSeconds, locale = DEFAULT_LOCALE) {
  const date = toZonedDate(timestampSeconds, offsetSeconds);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateLabel(
  timestampSeconds,
  offsetSeconds,
  locale = DEFAULT_LOCALE
) {
  const date = toZonedDate(timestampSeconds, offsetSeconds);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDayLabel(
  timestampSeconds,
  offsetSeconds,
  locale = DEFAULT_LOCALE
) {
  const date = toZonedDate(timestampSeconds, offsetSeconds);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  }).format(date);
}

export function formatShortDay(
  timestampSeconds,
  offsetSeconds,
  locale = DEFAULT_LOCALE
) {
  const date = toZonedDate(timestampSeconds, offsetSeconds);
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

export function getDateKey(timestampSeconds, offsetSeconds) {
  const date = toZonedDate(timestampSeconds, offsetSeconds);
  if (!date) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toKmh(speedMs) {
  if (typeof speedMs !== "number") return null;
  return Math.round(speedMs * 3.6);
}

export function toKm(distanceMeters) {
  if (typeof distanceMeters !== "number") return null;
  return Math.round((distanceMeters / 1000) * 10) / 10;
}

export function formatCondition(text) {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
