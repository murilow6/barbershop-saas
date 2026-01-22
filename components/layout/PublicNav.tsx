"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, ShoppingBag, Calendar, LogIn } from "lucide-react";

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/servicos", label: "Serviços", icon: Scissors },
    { href: "/produtos", label: "Produtos", icon: ShoppingBag },
    { href: "/#agendamento", label: "Agendar", icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
          <div className="bg-amber-500 p-1 rounded-lg">
            <Scissors className="h-4 w-4 text-stone-950" />
          </div>
          <span className="text-white">BARBER</span>
          <span className="text-amber-500">SAAS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as any}
              className="text-xs font-black uppercase tracking-widest text-stone-400 hover:text-amber-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/login"
            className="rounded-xl bg-white/5 border border-white/10 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all btn3d"
          >
            Entrar
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-stone-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-stone-950/95 backdrop-blur-2xl border-b border-white/5 md:hidden z-50 overflow-hidden"
          >
            <nav className="px-6 py-10 flex flex-col gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as any}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-2xl font-black uppercase tracking-tighter text-stone-300 hover:text-amber-500 transition-colors"
                >
                  <item.icon size={24} className="text-amber-500/50" />
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-4" />
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 text-2xl font-black uppercase tracking-tighter text-white"
              >
                <LogIn size={24} className="text-amber-500" />
                ÁREA DO CLIENTE
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
