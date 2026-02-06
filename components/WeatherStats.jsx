import { formatWindSpeed, windUnitLabel } from "@/utils/units";

function WindIcon({ className }) {
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
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M2 12h14a3 3 0 1 1-3 3" />
      <path d="M4 16h7" />
    </svg>
  );
}

function DropletIcon({ className }) {
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
      <path d="M12 2s6 6.3 6 11a6 6 0 1 1-12 0c0-4.7 6-11 6-11Z" />
    </svg>
  );
}

const ICON_MAP = {
  wind: WindIcon,
  humidity: DropletIcon,
};

function formatHumidityLabel(value) {
  if (value >= 80) return "Humidity is high";
  if (value >= 55) return "Humidity is moderate";
  return "Humidity is low";
}

function HighlightCard({ data }) {
  const {
    title,
    value,
    unit,
    subText,
    iconType,
    customIcon,
    isPlaceholder,
  } = data;
  const Icon = ICON_MAP[iconType];
  const isSunCard = iconType === "sunrise" || iconType === "sunset";

  if (isPlaceholder) {
    return (
      <div className="bg-secondary rounded-3xl p-5 flex flex-col justify-between h-full min-h-[140px] animate-pulse">
        <div className="h-4 w-24 bg-skeleton rounded-full" />
        <div className="space-y-2 mt-auto">
          <div className="h-8 w-20 bg-skeleton rounded-full" />
          <div className="h-3 w-24 bg-muted rounded-full" />
        </div>
      </div>
    );
  }

  if (isSunCard) {
    return (
      <div className="bg-secondary rounded-3xl p-4 flex items-center justify-center gap-4 h-full min-h-[140px]">
        <div className="w-16 h-16 relative flex-shrink-0">
          <img
            src={customIcon}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col text-white">
          <span className="text-base text-gray-300 font-medium">{title}</span>
          <span className="text-2xl font-semibold">{value}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-3xl p-5 flex flex-col justify-between h-full min-h-[140px] relative">
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        {Icon ? <Icon className="w-5 h-5" /> : null}
        <span className="text-sm font-medium">{title}</span>
      </div>

      <div className="flex flex-col items-end mt-auto text-white">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold">{value}</span>
          {unit ? <span className="text-base font-medium">{unit}</span> : null}
        </div>
        {subText ? (
          <span className="text-xs text-gray-300 mt-1">{subText}</span>
        ) : null}
      </div>
    </div>
  );
}

export default function WeatherStats({ data, status, unit = "c" }) {
  const isReady = status === "success" && data;

  const highlights = isReady
    ? [
        {
          id: "wind",
          title: "Wind Status",
          value: formatWindSpeed(data.windSpeed, unit),
          unit: windUnitLabel(unit),
          subText: data.observedTime,
          iconType: "wind",
        },
        {
          id: "sunrise",
          title: "Sunrise",
          value: data.sunrise || "—",
          iconType: "sunrise",
          customIcon: "/weather/sunrise.png",
        },
        {
          id: "humidity",
          title: "Humidity",
          value: data.humidity ?? "—",
          unit: "%",
          subText:
            typeof data.humidity === "number"
              ? formatHumidityLabel(data.humidity)
              : "Humidity unavailable",
          iconType: "humidity",
        },
        {
          id: "sunset",
          title: "Sunset",
          value: data.sunset || "—",
          iconType: "sunset",
          customIcon: "/weather/sunset.png",
        },
      ]
    : Array.from({ length: 4 }, (_, index) => ({
        id: `placeholder-${index}`,
        title: "—",
        value: "—",
        isPlaceholder: true,
        iconType: index === 1 ? "sunrise" : index === 3 ? "sunset" : "wind",
        customIcon:
          index === 1
            ? "/weather/sunrise.png"
            : index === 3
              ? "/weather/sunset.png"
              : null,
      }));

  return (
    <div className="bg-card rounded-4xl p-6 h-full flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-6">Today's Highlight</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 flex-1">
        {highlights.map((item) => (
          <HighlightCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
