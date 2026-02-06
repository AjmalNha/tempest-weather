# Tempest

A modern weather dashboard built with Next.js (App Router) and Tailwind CSS.

## Features
- Real-time weather data from OpenWeatherMap
- 5-day forecast
- Geolocation detection
- Temperature unit toggle (°C/°F)
- Skeleton loading states
- SEO metadata + sitemap/robots via next-sitemap
- Fully responsive layout

## Getting Started

### Prerequisites
- Node.js 18+
- OpenWeatherMap API key

### Installation
1. Install dependencies
   ```bash
   npm install
   ```

2. Set up environment variables

   Create a `.env` file in the project root (or copy `.env.example`):
   ```env
   OPENWEATHER_API_KEY=your_openweathermap_api_key_here
   OPENWEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
   NEXT_PUBLIC_OPENWEATHER_GEO_API_URL=https://api.openweathermap.org/geo/1.0
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open the app

   Visit `http://localhost:3000`.

## Usage
- Search for a city in the input field.
- Use "Current location" to fetch weather via browser geolocation.
- Toggle °C/°F in the unit switch.

## API Information
This app uses the OpenWeatherMap API:
- Current weather: `/weather`
- 5-day forecast: `/forecast`
- Geocoding: `/geo/1.0/direct`

## Project Structure
```
app/               # App Router pages + API routes
components/        # UI components
services/          # Server-only API service layer
utils/             # Formatting + unit helpers
styles/            # Global styles
```

## Scripts
```bash
npm run dev
npm run build
npm run start
npm run lint
```

## SEO Build Output
The sitemap and robots.txt are generated automatically after builds via the
`postbuild` script (`next-sitemap`).
