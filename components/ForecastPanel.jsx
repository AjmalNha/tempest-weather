import HourlyForecast from "./HourlyForecast";

export default function ForecastPanel({ data, status, unit = "c" }) {
  const hasData = status === "success" && data.length > 0;
  const isLoading = status === "loading" || status === "idle";
  const items = hasData
    ? data
    : isLoading
      ? Array.from({ length: 5 }, (_, index) => ({
          id: `placeholder-${index}`,
          day: "—",
          temp: "—",
          icon: "/weather/sun-clouds.png",
        }))
      : [];

  return (
    <div className="bg-card rounded-4xl p-8 mt-6 w-full">
      <h2 className="text-white text-xl font-semibold mb-6">5 Day Forecast</h2>

      <div className="flex overflow-x-auto justify-between gap-4 pb-4 scrollbar-hide snap-x">
        {items.map((item, index) => (
          <HourlyForecast
            key={item.id || `${item.day}-${index}`}
            data={item}
            isPlaceholder={!hasData}
            unit={unit}
          />
        ))}
      </div>
    </div>
  );
}
