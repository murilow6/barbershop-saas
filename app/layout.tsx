import type { Metadata } from "next";
import { Toaster } from "sonner";
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
        <Toaster position="top-center" richColors theme="dark" closeButton />
      </body>
    </html>
  );
}
