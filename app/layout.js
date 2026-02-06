import { Manrope } from "next/font/google";
import "../styles/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tempest",
    template: "%s | Tempest",
  },
  description: "Real-time weather conditions and multi-day forecasts.",
  applicationName: "Tempest",
  keywords: [
    "weather",
    "forecast",
    "temperature",
    "humidity",
    "wind",
    "local weather",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tempest",
    description: "Real-time weather conditions and multi-day forecasts.",
    url: "/",
    siteName: "Tempest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tempest",
    description: "Real-time weather conditions and multi-day forecasts.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "rgb(15 15 15)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
