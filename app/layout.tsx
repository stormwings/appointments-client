import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Appointments",
  description: "Gestión de citas médicas",
};

export const viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans bg-slate-100">{children}</body>
    </html>
  );
}
