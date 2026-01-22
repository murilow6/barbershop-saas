"use client";

import Link from "next/link";
import { Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Calendar, ShoppingBag, User, Sparkles } from "lucide-react";
import { BookingWizard } from "@/components/booking/BookingWizard";

// Reuse mock data from client dashboard
const SERVICES = [
  { id: 1, name: "Corte Masculino", price: "R$ 45,00", duration: "30 min" },
  { id: 2, name: "Barba Completa", price: "R$ 35,00", duration: "20 min" },
  { id: 3, name: "Corte + Barba", price: "R$ 70,00", duration: "50 min" },
];

const PRODUCTS = [
  { id: 1, name: "Pomada Alta Fixação", price: "R$ 35,00" },
  { id: 2, name: "Shampoo Barbearia", price: "R$ 28,00" },
  { id: 3, name: "Óleo para Barba", price: "R$ 42,00" },
];

const BARBERS = [
  { id: 1, name: "Carlos Silva", specialty: "Cortes Clássicos" },
  { id: 2, name: "André Ramos", specialty: "Degradê & Navalha" },
  { id: 3, name: "Felipe Costa", specialty: "Barboterapia" },
];

const fadeUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToBooking = () => {
    const el = document.getElementById("agendamento");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 noise-bg">
      {/* Hero Section */}
      <section className="relative h-svh min-h-[560px] w-full overflow-hidden flex items-center pt-24 md:pt-0">
        {/* Cinematic Background with Parallax */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-stone-950/60 to-stone-950 z-10" />
          <div className="absolute inset-0 bg-black/40 md:bg-black/40 z-10" />
          <img
            src="/images/hero-mobile.jpg"
            alt="Barbearia Premium"
            className="h-full w-full object-cover object-center md:hidden"
          />
          <img
            src="/images/hero-bg.png"
            alt="Barbearia Premium"
            className="hidden md:block h-full w-full object-cover object-center md:scale-110"
          />
        </motion.div>

        {/* Floating Thematic Elements - Hidden on small mobile for performance/clarity */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden hidden md:block">
          {/* ... existing floating elements ... */}
        </div>

        <div className="relative z-30 mx-auto max-w-6xl px-6 w-full">
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-amber-400 mb-6 md:mb-8 shadow-xl shadow-amber-500/5"
            >
              <Sparkles className="h-3 w-3" />
              Experiência Premium
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-4xl sm:text-6xl md:text-8xl font-black leading-[1] md:leading-[0.9] text-white tracking-tighter"
            >
              A arte da <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 animate-gradient-x underline decoration-amber-500/30 underline-offset-4 md:underline-offset-8">escolha.</span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mt-6 md:mt-8 max-w-xl text-base md:text-xl text-stone-400 font-medium leading-relaxed"
            >
              Transformamos tradição em tendência. Descubra o equilíbrio perfeito entre o clássico e o contemporâneo em um ambiente feito para você.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 md:gap-5"
            >
              <Button
                onClick={scrollToBooking}
                size="lg"
                className="w-full sm:w-auto relative group bg-amber-600 hover:bg-amber-500 text-stone-950 font-black h-16 md:h-auto px-10 md:py-7 text-base md:text-lg rounded-xl transition-all duration-300 btn3d tech-glow"
              >
                <Calendar className="mr-2 h-5 w-5" />
                AGENDAR AGORA
              </Button>
              <Link href="/servicos" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-16 md:h-auto px-10 md:py-7 text-base md:text-lg rounded-xl backdrop-blur-md transition-all">
                  CONHECER SERVIÇOS
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-950 to-transparent z-40 md:z-10" />
      </section>

      {/* Booking Flow Section */}
      <section id="agendamento" className="py-24 relative z-10 bg-stone-950 overflow-hidden">
        {/* Abstract Light Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] rounded-full -z-10" />

        <div className="mx-auto max-w-5xl px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="flex flex-col items-center"
          >
            <Suspense fallback={<div className="text-stone-500 font-bold animate-pulse">CARREGANDO AGENDA...</div>}>
              <BookingWizard />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <div className="mb-12 text-center">
              <h2 className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
                <Scissors className="h-8 w-8 text-amber-500" />
                Nossos Serviços
              </h2>
              <p className="mt-3 text-stone-400">Qualidade e precisão em cada atendimento</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Card className="border-white/10 bg-stone-900/50 p-6 transition-all hover:border-amber-500/50 hover:bg-stone-900">
                    <h3 className="text-xl font-semibold text-white">{s.name}</h3>
                    <div className="mt-2 flex items-center justify-between text-sm text-stone-400">
                      <span>{s.duration}</span>
                      <span className="text-lg font-bold text-amber-400">{s.price}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="border-b border-white/5 py-20 bg-stone-950">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <div className="mb-12 text-center">
              <h2 className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
                <ShoppingBag className="h-8 w-8 text-amber-500" />
                Produtos Exclusivos
              </h2>
              <p className="mt-3 text-stone-400">Cuide do seu estilo em casa</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Card className="border-white/10 bg-stone-900/50 p-6 transition-all hover:border-amber-500/50 hover:bg-stone-900">
                    <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-400">{p.price}</span>
                      <Button size="sm" variant="secondary" className="bg-stone-800 hover:bg-stone-700">
                        Ver mais
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Barbers Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <div className="mb-12 text-center">
              <h2 className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
                <User className="h-8 w-8 text-amber-500" />
                Nossa Equipe
              </h2>
              <p className="mt-3 text-stone-400">Profissionais experientes e dedicados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BARBERS.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <Card className="border-white/10 bg-stone-900/50 p-6 text-center transition-all hover:border-amber-500/50 hover:bg-stone-900">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 p-0.5">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-stone-900">
                        <User className="h-10 w-10 text-amber-400" />
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{b.name}</h3>
                    <p className="mt-1 text-sm text-stone-400">{b.specialty}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/5 bg-stone-950 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <h2 className="text-3xl font-bold text-white">Pronto para transformar seu visual?</h2>
            <p className="mt-4 text-stone-400">Agende agora e experimente o melhor da barbearia premium</p>
            <div className="mt-8">
              <Button
                onClick={scrollToBooking}
                size="lg"
                className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-8 text-xl py-8 rounded-xl btn3d"
              >
                <Calendar className="mr-2 h-6 w-6" />
                Agendar Meu Horário
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
