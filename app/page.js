import WeatherDashboard from "@/components/WeatherDashboard";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  title: "Weather Dashboard",
  description: "Current conditions, hourly outlook, and multi-day forecast.",
};

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Tempest",
      url: siteUrl,
      description: "Real-time weather conditions and multi-day forecasts.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Tempest",
      url: siteUrl,
      applicationCategory: "Weather",
      operatingSystem: "Web",
      description: "Check current conditions, hourly outlook, and forecasts.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WeatherDashboard />
    </>
  );
}
