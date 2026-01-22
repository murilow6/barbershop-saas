"use client";

import { motion } from "framer-motion";
import { Scissors, Sparkles, Clock, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_SERVICES } from "@/lib/mockConstants";
import Link from "next/link";

const fadeUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 noise-bg">
      {/* Narrative Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/80 to-stone-950 z-10" />
          <img
            src="/images/hero-mobile.jpg"
            alt="The Art of Grooming"
            className="h-full w-full object-cover opacity-60 md:hidden grayscale md:grayscale-0"
          />
          <img
            src="/images/hero-bg.png"
            alt="The Art of Grooming"
            className="hidden md:block h-full w-full object-cover opacity-40 scale-105 grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>

        <div className="relative z-20 text-center max-w-4xl px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeUpVariants}
          >
            <span className="inline-flex items-center gap-2 text-amber-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 px-1 text-center">
              <Sparkles className="h-4 w-4" />
              O Ritual de Excelência
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-8">
              A Arte de se <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Reinventar.</span>
            </h1>
            <p className="text-stone-400 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto px-2">
              Muito mais que um corte. Um momento de pausa, precisão e autodescoberta em um ambiente pensado para o homem contemporâneo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Narrative List */}
      <section className="py-16 md:py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
          {MOCK_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-24`}
            >
              {/* Emotional Image Overlay */}
              <div className="flex-1 relative group w-full">
                <div className="absolute -inset-2 md:-inset-4 bg-amber-500/5 blur-2xl rounded-[2.5rem] md:rounded-[3rem] group-hover:bg-amber-500/10 transition-colors duration-500" />
                <div className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-stone-900 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scissors className="h-16 md:h-24 w-16 md:w-24 text-amber-500/10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700" />
                  </div>
                  {/* In production, each service would have a unique emotional image */}
                  <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 z-20">
                    <span className="text-amber-500 font-black text-4xl md:text-6xl opacity-20 uppercase tracking-tighter">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>

              {/* Textual Storytelling */}
              <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
                <div className="space-y-3 md:space-y-4">
                  <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                    {service.name}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 text-xs md:text-sm font-bold uppercase tracking-widest text-amber-500/60">
                    <span className="flex items-center gap-2">
                      <Clock size={16} />
                      {service.duration}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-stone-700" />
                    <span className="text-stone-300">
                      {service.price}
                    </span>
                  </div>
                </div>

                <p className="text-stone-400 text-base md:text-lg leading-relaxed italic border-l-0 md:border-l-2 border-amber-500/30 md:pl-6">
                  {service.description || "Uma experiência personalizada focada na harmonia do seu rosto e no seu estilo de vida."}
                </p>

                <ul className="space-y-2 md:space-y-3 inline-block md:block text-left mx-auto md:mx-0">
                  {["Finalização com produtos premium", "Toalha quente relaxante", "Consultoria de visagismo"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-stone-500 text-sm md:text-base font-medium">
                      <Check className="h-4 w-4 text-amber-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link href={`/?service=${service.id}#agendamento`} className="block pt-4 md:pt-6">
                  <Button className="group h-16 w-full md:w-auto px-10 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-lg btn3d tech-glow gap-3">
                    RESERVAR ESTE RITUAL
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof CTA */}
      <section className="py-24 md:py-32 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-6 uppercase tracking-tighter">Não é apenas cabelo. É legado.</h2>
          <p className="text-stone-500 text-sm md:text-base mb-12">Junte-se aos centenas de homens que redescobriram sua melhor versão conosco.</p>
          <Link href="/?#agendamento">
            <Button variant="ghost" className="text-amber-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-amber-500/5 px-8 md:px-12 py-4 md:py-6 h-auto">
              Ver todos os horários disponíveis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
