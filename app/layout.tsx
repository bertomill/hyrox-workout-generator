import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hyrox Workout Generator - Train Smarter",
  description: "Generate and track personalized Hyrox workouts. 8 stations, 8 runs, complete training sessions tailored to your fitness level.",
  applicationName: "Hyrox Trainer",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hyrox Trainer",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Hyrox Workout Generator",
    title: "Hyrox Workout Generator - Train Smarter",
    description: "Generate and track personalized Hyrox workouts",
  },
  twitter: {
    card: "summary",
    title: "Hyrox Workout Generator",
    description: "Generate and track personalized Hyrox workouts",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#E63946",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
