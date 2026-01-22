import type { Metadata } from "next";
import { SonnerToaster } from "@/components/ui/sonner-toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "BarberSaaS",
  description: "SaaS premium para barbearias"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-black text-white antialiased">
        {children}
        <SonnerToaster />
      </body>
    </html>
  );
}
