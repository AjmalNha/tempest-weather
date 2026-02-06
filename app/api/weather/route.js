import { getWeatherByCity, getWeatherByCoords } from "@/services/weather";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city");

  try {
    if (lat && lon) {
      const data = await getWeatherByCoords(lat, lon);
      return Response.json(data, { status: 200 });
    }

    if (city) {
      const data = await getWeatherByCity(city);
      return Response.json(data, { status: 200 });
    }

    return Response.json(
      { error: "Latitude/longitude or city is required." },
      { status: 400 }
    );
  } catch (error) {
    const status = error.status || 500;
    const message =
      status === 404
        ? "City not found."
        : "Unable to fetch weather data.";
    return Response.json({ error: message }, { status });
  }
}
