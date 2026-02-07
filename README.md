# Tempest
​
A modern weather dashboard built with Next.js (App Router) and Tailwind CSS.
​
## Features
- Real-time weather data from OpenWeatherMap
- 5-day forecast
- Geolocation detection
- Temperature unit toggle (°C/°F)
- Skeleton loading states
- SEO metadata + sitemap/robots via next-sitemap
- Fully responsive layout
​
## Getting Started
​
### Prerequisites
- Node.js 18+ (LTS recommended)
- OpenWeatherMap API key (free tier available at [openweathermap.org](https://openweathermap.org/api))
​
### Local Development Setup
​
1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd tempest-weather
   npm install
   ```
​
2. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenWeatherMap API key:
   ```env
   OPENWEATHER_API_KEY=your_actual_api_key_here
   OPENWEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
   NEXT_PUBLIC_OPENWEATHER_GEO_API_URL=https://api.openweathermap.org/geo/1.0
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
​
3. **Start Development Server**
   ```bash
   npm run dev
   ```
​
4. **Access the Application**
   
   Open your browser and navigate to:
   - **Local:** `http://localhost:3000`
   - **Network:** `http://[your-ip]:3000` (for mobile testing)
​
### Development Commands
​
```bash
# Start development server with hot reloading
npm run dev
​
# Build for production
npm run build
​
# Start production server
npm run start
​
# Run ESLint
npm run lint
​
# Generate sitemap (runs automatically after build)
npm run postbuild
```
​
## Usage
- Search for a city in the input field.
- Use "Current location" to fetch weather via browser geolocation.
- Toggle °C/°F in the unit switch.
​
## API Information
This app uses the OpenWeatherMap API:
- Current weather: `/weather`
- 5-day forecast: `/forecast`
- Geocoding: `/geo/1.0/direct`
​
## Project Structure
```
app/               # App Router pages + API routes
components/        # UI components
services/          # Server-only API service layer
utils/             # Formatting + unit helpers
styles/            # Global styles
```
​
## Scripts
```bash
npm run dev
npm run build
npm run start
npm run lint
```
​
## SEO Build Output
The sitemap and robots.txt are generated automatically after builds via the
`postbuild` script (`next-sitemap`).