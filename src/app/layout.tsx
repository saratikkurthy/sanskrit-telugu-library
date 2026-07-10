import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanskrit Telugu Library",
  description: "A library for Sanskrit and Telugu documents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}