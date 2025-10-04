import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Space Farm - Explorando el Cosmos",
  description: "Explora el cosmos con Space Farm - Challenge NASA 2025",
  keywords: "space, farm, NASA, agricultura, espacial, 3D, globe",
  authors: [{ name: "Space Farm Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

// ✅ Mueve el viewport aquí
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="bg-black text-white font-inter antialiased">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
