"use client";

import { motion } from "framer-motion";
import {
  Users,
  Scissors,
  Package,
  CalendarClock,
  TrendingUp,
  UserRound,
  LayoutDashboard
} from "lucide-react";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { KpiCard } from "@/components/admin/ui/KpiCard";
import { TiltCard } from "@/components/admin/ui/TiltCard";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { OccupancyChart } from "@/components/admin/charts/OccupancyChart";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

import { getDashboardStatsAction } from "@/lib/actions";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeClients: 0,
    appointmentsCount: 0,
    revenue: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    getDashboardStatsAction().then(res => {
      if (res.success && res.stats) setStats(res.stats);
    });
  }, []);
  return (
    <div className="space-y-10">
      <SectionHeader
        title="Painel Executivo"
        subtitle="Bem-vindo de volta! Aqui está o resumo do desempenho da sua barbearia hoje."
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={item}>
          <KpiCard
            label="Clientes Ativos"
            value={stats.activeClients.toString()}
            icon={Users}
            trend={{ value: "0%", isUp: true }}
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            label="Agendamentos"
            value={stats.appointmentsCount.toString()}
            icon={CalendarClock}
            trend={{ value: "0%", isUp: true }}
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            label="Faturamento Total"
            value={`R$ ${stats.revenue.toFixed(2).replace('.', ',')}`}
            icon={TrendingUp}
            trend={{ value: "0%", isUp: true }}
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            label="Taxa de Ocupação"
            value={`${stats.occupancyRate}%`}
            icon={UserRound}
            trend={{ value: "0%", isUp: false }}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TiltCard className="p-8 glass-premium lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Desempenho de Receita
              </h3>
              <p className="text-sm text-stone-500">Fluxo de caixa dos últimos 7 dias</p>
            </div>
          </div>
          <RevenueChart />
        </TiltCard>

        <TiltCard className="p-8 glass-premium">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-xl font-bold mb-6">Ocupação da Agenda</h3>
            <OccupancyChart />
            <div className="mt-8 space-y-2 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Horários Reservados</span>
                <span className="text-amber-500 font-bold">{stats.appointmentsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Total Agendamentos</span>
                <span className="text-stone-600 font-bold">{stats.appointmentsCount}</span>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-premium rounded-3xl p-6 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Serviços</p>
            <p className="text-xl font-bold">12 Ativos</p>
          </div>
        </div>
        <div className="glass-premium rounded-3xl p-6 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Estoque</p>
            <p className="text-xl font-bold">45 Itens</p>
          </div>
        </div>
        <div className="glass-premium rounded-3xl p-6 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <UserRound className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Equipe</p>
            <p className="text-xl font-bold">4 Barbeiros</p>
          </div>
        </div>
      </div>
    </div>
  );
}
