import { getGeoSuggestions } from "@/services/weather";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json([], { status: 200 });
  }

  try {
    const suggestions = await getGeoSuggestions(query);
    return Response.json(suggestions, { status: 200 });
  } catch (error) {
    const status = error.status || 500;
    return Response.json(
      { error: "Unable to fetch location suggestions." },
      { status }
    );
  }
}
