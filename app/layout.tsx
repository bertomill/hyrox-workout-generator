import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/lib/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roxify - Train Smarter for Hyrox",
  description: "Roxify: Your adaptive Hyrox training companion. Generate smart workouts that adapt to your mood and performance. Track progress, compete with friends.",
  applicationName: "Roxify",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Roxify",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Roxify",
    title: "Roxify - Train Smarter for Hyrox",
    description: "Your adaptive Hyrox training companion",
  },
  twitter: {
    card: "summary",
    title: "Roxify - Train Smarter for Hyrox",
    description: "Your adaptive Hyrox training companion",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
