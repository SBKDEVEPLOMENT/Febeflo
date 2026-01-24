import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeminiChat from "@/components/GeminiChat";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Febeflo - Tienda de Ropa",
  description: "Ropa de mujer y hombre en Pudahuel.",
  icons: {
    icon: '/logo/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <GeminiChat />
          <Toaster richColors position="top-center" />
        </div>
      </body>
    </html>
  );
}
