import Image from "next/image";
import { formatTemperature } from "@/utils/units";

export default function HourlyForecast({ data, isPlaceholder, unit = "c" }) {
  const { day, temp, icon } = data;
  const tempLabel = formatTemperature(temp, unit);

  return (
    <div className="bg-secondary min-w-25 flex-1 rounded-3xl py-4 px-2 flex flex-col items-center gap-4 shrink-0 snap-start">
      <div className="flex flex-col items-center gap-2 w-full">
        <span
          className={`text-sm font-medium ${
            isPlaceholder ? "text-gray-500" : "text-white"
          }`}
        >
          {day}
        </span>
        <div className="w-full h-px bg-linear-to-r from-transparent via-gray-500 to-transparent opacity-50" />
      </div>

      <div className="w-16 h-16 relative flex items-center justify-center">
        {isPlaceholder ? (
          <div className="w-10 h-10 rounded-full bg-skeleton-soft animate-pulse" />
        ) : (
          <Image src={icon} alt={day} fill sizes="64px" className="object-contain" />
        )}
      </div>

      <span
        className={`text-lg font-medium ${
          isPlaceholder ? "text-gray-500" : "text-white"
        }`}
      >
        {tempLabel}
      </span>
    </div>
  );
}
