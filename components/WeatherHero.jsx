import Image from "next/image";
import { formatTemperature, unitLabel } from "@/utils/units";

function MapPinIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.8" />
    </svg>
  );
}

function StatusMessage({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-400 gap-2 py-12">
      <span className="text-lg font-medium text-gray-200">{title}</span>
      <span className="text-sm text-gray-400 max-w-xs">{description}</span>
    </div>
  );
}

export default function WeatherHero({
  data,
  status,
  error,
  showCurrentLocation,
  onUseCurrentLocation,
  isFetching,
  unit = "c",
  onSetUnit,
}) {
  const isSuccess = status === "success" && data;
  const isLoading = status === "loading";
  const isError = status === "error";
  const tempValue = formatTemperature(data?.temp, unit);
  const conditionValue = data?.condition || "—";
  const feelsLikeValue = formatTemperature(data?.feelsLike, unit);
  const isSwitchable = typeof onSetUnit === "function";
  const cLabel = unitLabel("c");
  const fLabel = unitLabel("f");

  return (
    <div className="bg-card rounded-4xl p-8 flex flex-col justify-between h-full relative overflow-hidden min-h-[380px]">
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-full text-white">
            <MapPinIcon className="w-4 h-4" />
            <span className="text-sm font-medium
    max-w-25
    truncate
    block">
              {data?.location || "Search location"}
            </span>
          </div>
          {showCurrentLocation ? (
            <button
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isFetching}
              className="text-xs font-medium
              text-blue-400
              hover:text-blue-300
              underline underline-offset-4
              bg-transparent
              px-1 py-0.5
              rounded
              transition-colors
              disabled:opacity-50
              disabled:cursor-not-allowed"
            >
              Current location
            </button>
          ) : null}
        </div>

        <div
          role="radiogroup"
          aria-label="Temperature unit"
          className="inline-flex items-center bg-accent p-1 rounded-full"
        >
          <button
            type="button"
            role="radio"
            aria-checked={unit === "c"}
            onClick={isSwitchable ? () => onSetUnit("c") : undefined}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              unit === "c"
                ? "bg-white text-card"
                : "text-gray-200 hover:text-white"
            } ${isSwitchable ? "cursor-pointer" : "cursor-default"}`}
          >
            {cLabel}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={unit === "f"}
            onClick={isSwitchable ? () => onSetUnit("f") : undefined}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              unit === "f"
                ? "bg-white text-card"
                : "text-gray-200 hover:text-white"
            } ${isSwitchable ? "cursor-pointer" : "cursor-default"}`}
          >
            {fLabel}
          </button>
        </div>
      </div>

      {isSuccess ? (
        <>
          <div className="mt-6 z-10">
            <h2 className="text-white text-4xl font-medium mb-1">
              {data.dayLabel}
            </h2>
            <p className="text-white text-base opacity-90">{data.dateLabel}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-auto gap-8 z-10">
            <div className="w-40 h-40 relative transform scale-125 md:scale-150">
              <Image
                src={data.icon}
                alt={conditionValue}
                fill
                sizes="(max-width: 768px) 160px, 240px"
                className="object-contain drop-shadow-2xl"
              />
            </div>

            <div className="flex flex-col items-end text-right">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-white text-6xl md:text-7xl font-medium">
                  {tempValue}
                </span>
              </div>
              <p className="text-white text-xl font-medium mb-1">
                {conditionValue}
              </p>
              <p className="text-gray-300 text-base">
                Feels like {feelsLikeValue}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          {isLoading ? (
            <div className="w-full animate-pulse space-y-8">
              <div className="flex justify-between items-start">
                <div className="h-9 w-40 bg-muted rounded-full" />
                <div className="flex items-center gap-2 bg-accent/70 p-1 rounded-full">
                  <div className="h-7 w-12 bg-muted rounded-full" />
                  <div className="h-7 w-12 bg-muted rounded-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-6 w-40 bg-muted rounded-full" />
                <div className="h-4 w-32 bg-muted rounded-full" />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted" />
                <div className="flex flex-col items-end gap-3 flex-1">
                  <div className="h-10 w-40 bg-muted rounded-full" />
                  <div className="h-5 w-28 bg-muted rounded-full" />
                  <div className="h-4 w-32 bg-muted rounded-full" />
                </div>
              </div>
            </div>
          ) : isError ? (
            <StatusMessage
              title="We couldn't find that city"
              description={
                error || "Check the spelling and try a nearby location."
              }
            />
          ) : (
            <StatusMessage
              title="Search for a city"
              description="Enter a location to see current conditions and forecasts."
            />
          )}
        </div>
      )}
    </div>
  );
}
