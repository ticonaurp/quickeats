import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// 🎨 Cargamos las fuentes oficiales del sistema de diseño Mango V2.5
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// 🚀 Metadatos profesionales y SEO optimizado para la plataforma
export const metadata: Metadata = {
  title: "QuickEats — Panel Administrativo y Delivery",
  description: "Plataforma corporativa de gestión de pedidos y control de restaurantes en tiempo real.",
  icons: {
    icon: "/favicon.ico", // Asegúrate de tener tu icono en la carpeta public más adelante
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] font-sans text-slate-900 selection:bg-amber-500 selection:text-white">
        {children}
        <Toaster richColors position="top-right" duration={3000} closeButton />
      </body>
    </html>
  );
}