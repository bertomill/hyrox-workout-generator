import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hyrox Workout Generator",
  description: "Generate and track Hyrox workouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
