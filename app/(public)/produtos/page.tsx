"use client";

import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, ArrowRight, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
// EMOTIONAL_PRODUCTS redeclared below for full storytelling control
import Link from "next/link";

// Redeclare data if necessary (to ensure full control over emotional descriptions)
const EMOTIONAL_PRODUCTS = [
  {
    id: 1,
    name: "Pomada Alta Fixação",
    price: "R$ 35,00",
    category: "Styling",
    description: "Para o homem que exige controle absoluto. Uma fórmula matte que mantém seu estilo impecável do primeiro café ao último drink da noite.",
    features: ["Efeito Mate", "Longa Duração", "Lavável"]
  },
  {
    id: 2,
    name: "Shampoo Barbearia",
    price: "R$ 28,00",
    category: "Hygiene",
    description: "Muito mais que limpeza; é uma purificação. Com extratos naturais, remove as impurezas enquanto nutre o folículo capilar.",
    features: ["Minoxidil natural", "Ph balanceado", "Refrescância"]
  },
  {
    id: 3,
    name: "Óleo para Barba",
    price: "R$ 42,00",
    category: "Ritual",
    description: "O toque de mestre para uma barba de respeito. Hidratação profunda que domina os fios e deixa uma fragrância amadeirada sutil.",
    features: ["Brilho Natural", "Pele Hidratada", "Aroma Premium"]
  },
];

const fadeUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 noise-bg">
      {/* Editorial Header */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 text-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeUpVariants}
          className="max-w-4xl mx-auto"
        >
          <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
            The Apothecary Series
          </span>
          <h1 className="text-4xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-8 md:mb-12">
            Essenciais <br /> Para o <span className="text-stone-800 outline-text">Legado.</span>
          </h1>
          <p className="text-stone-500 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-4">
            Nossa linha de produtos não é apenas funcional; é o capítulo final do seu ritual diário. Selecionamos apenas o que há de mais nobre para a manutenção do seu estilo.
          </p>
        </motion.div>
      </section>

      {/* Product Showcase - Editorial Grid */}
      <section className="pb-24 md:pb-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {EMOTIONAL_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              {/* Visual Card */}
              <div className="relative aspect-[3/4] bg-stone-900 rounded-[2rem] overflow-hidden mb-6 md:mb-8 border border-white/5 transition-all duration-700 md:group-hover:border-amber-500/30">
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent z-10" />

                {/* Placeholder for Product Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="h-24 md:h-32 w-24 md:w-32 text-amber-500/5 group-hover:scale-110 group-hover:text-amber-500/10 transition-all duration-700" />
                </div>

                {/* Category Tag */}
                <div className="absolute top-6 md:top-8 left-6 md:left-8 z-20">
                  <span className="bg-white/5 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-500 border border-white/5">
                    {product.category}
                  </span>
                </div>

                {/* Review Mock */}
                <div className="absolute top-6 md:top-8 right-6 md:right-8 z-20 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={10} className="fill-amber-500 text-amber-500" />)}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-8 md:bottom-10 left-8 md:left-10 right-8 md:right-10 z-20">
                  <p className="text-amber-500 font-black text-xl md:text-2xl mb-1">{product.price}</p>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{product.name}</h3>
                </div>

                {/* Actions Overlay (Lighter for Mobile) */}
                <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-500 z-30 flex items-center justify-center gap-4">
                  <Button className="rounded-full h-14 w-14 bg-amber-600 hover:bg-amber-500 text-stone-950 p-0 btn3d shadow-xl">
                    <ShoppingBag size={24} />
                  </Button>
                  <Button variant="ghost" className="rounded-full h-14 w-14 bg-white/10 hover:bg-white/20 text-white p-0 backdrop-blur-md border border-white/10">
                    <Eye size={24} />
                  </Button>
                </div>
              </div>

              {/* Editorial Content */}
              <div className="px-4 space-y-4">
                <p className="text-stone-400 text-sm leading-relaxed line-clamp-3 font-medium">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.features.map(feat => (
                    <span key={feat} className="text-[10px] font-bold text-stone-600 uppercase tracking-widest px-2 py-1 bg-stone-900/50 rounded">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ritual Banner */}
      <section className="py-16 md:py-24 bg-white px-6 text-stone-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 text-center md:text-left">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6 text-stone-950">
              O Cuidado Estende-se Para <br /> Além do Espelho.
            </h2>
            <p className="text-stone-600 font-medium text-base md:text-lg leading-relaxed">
              Nossa curadoria de produtos visa manter a integridade do trabalho realizado em nossa barbearia, garantindo que você esteja no seu melhor, todos os dias.
            </p>
          </div>
          <Link href="/?#agendamento" className="w-full md:w-auto">
            <Button className="h-20 w-full md:w-auto px-10 md:px-12 rounded-2xl bg-stone-950 hover:bg-stone-900 text-white font-black text-lg md:text-xl flex items-center justify-center gap-4">
              EXPERIMENTAR NO PRÓXIMO CORTE
              <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      <style jsx>{`
        .outline-text {
            -webkit-text-stroke: 1px #444;
            color: transparent;
        }
      `}</style>
    </div>
  );
}
