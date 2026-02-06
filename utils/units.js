const KM_TO_MILES = 0.621371;

function normalizeUnit(unit) {
  return unit === "f" ? "f" : "c";
}

export function unitLabel(unit) {
  return normalizeUnit(unit) === "f" ? "°F" : "°C";
}

export function windUnitLabel(unit) {
  return normalizeUnit(unit) === "f" ? "mph" : "km/h";
}

export function convertTemperature(valueC, unit) {
  if (typeof valueC !== "number") return null;
  if (normalizeUnit(unit) === "f") {
    return Math.round((valueC * 9) / 5 + 32);
  }
  return Math.round(valueC);
}

export function formatTemperature(value, unit) {
  if (typeof value !== "number") return value ?? "—";
  const converted = convertTemperature(value, unit);
  if (converted === null) return "—";
  return `${converted}${unitLabel(unit)}`;
}

export function formatWindSpeed(valueKmh, unit) {
  if (typeof valueKmh !== "number") return valueKmh ?? "—";
  if (normalizeUnit(unit) === "f") {
    return Math.round(valueKmh * KM_TO_MILES);
  }
  return Math.round(valueKmh);
}
