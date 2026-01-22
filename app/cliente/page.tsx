"use client";

import { motion } from "framer-motion";
import { LogOut, Calendar, Scissors, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Mock Data as requested
const SERVICES = [
  { id: 1, name: "Corte Masculino", price: "R$ 45,00", duration: "30 min" },
  { id: 2, name: "Barba Completa", price: "R$ 35,00", duration: "20 min" },
  { id: 3, name: "Corte + Barba", price: "R$ 70,00", duration: "50 min" },
];

const PRODUCTS = [
  { id: 1, name: "Pomada Alta Fixação", price: "R$ 35,00", image: "https://images.unsplash.com/photo-1626307416562-ee839676f5fc?w=400&h=400&fit=crop" },
  { id: 2, name: "Shampoo Barbearia", price: "R$ 28,00", image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop" },
  { id: 3, name: "Óleo para Barba", price: "R$ 42,00", image: "https://images.unsplash.com/photo-1626307416562-ee839676f5fc?w=400&h=400&fit=crop" }, // Placeholder reuse
];

const BARBERS = [
  { id: 1, name: "Carlos Silva", specialty: "Cortes Clássicos", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop" },
  { id: 2, name: "André Ramos", specialty: "Degradê & Navalha", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=200&h=200&fit=crop" },
  { id: 3, name: "Felipe Costa", specialty: "Barboterapia", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" },
];

export default function ClientDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "mock-token=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-stone-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-stone-950">
              <Scissors size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-amber-500">BarberSaaS</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-stone-400 hover:text-white">
            <LogOut size={18} className="mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-white">Bem-vindo, Cliente</h1>
          <p className="mt-2 text-stone-400">Agende seu horário e confira nossos produtos exclusivos.</p>
        </motion.div>

        {/* Services Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-amber-500">
              <Scissors size={24} />
              Serviços
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-white/10 bg-stone-900/50 p-6 transition-all hover:border-amber-500/50 hover:bg-stone-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{s.name}</h3>
                      <p className="text-sm text-stone-500">{s.duration}</p>
                    </div>
                    <span className="font-bold text-amber-400">{s.price}</span>
                  </div>
                  <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-500 text-white font-medium">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-2">
            <ShoppingBag size={24} className="text-amber-500" />
            <h2 className="text-2xl font-semibold text-amber-500">Produtos</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className="overflow-hidden border-white/10 bg-stone-900/50 transition-all hover:border-amber-500/50">
                  <div className="aspect-square w-full bg-stone-800 relative">
                    {/* Use a real <img> tag here for simplicity in mock mode, or next/image if configured */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white">{p.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-amber-400">{p.price}</span>
                      <Button size="sm" variant="secondary" className="h-8 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white">
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Barbers Section */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <User size={24} className="text-amber-500" />
            <h2 className="text-2xl font-semibold text-amber-500">Nossa Equipe</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {BARBERS.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Card className="flex items-center gap-4 border-white/10 bg-stone-900/50 p-4 transition-all hover:border-amber-500/50 hover:bg-stone-900">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-amber-500/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.image} alt={b.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{b.name}</h3>
                    <p className="text-sm text-stone-400">{b.specialty}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
