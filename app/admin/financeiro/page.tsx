"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    DollarSign,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    PieChart as PieChartIcon,
    BarChart3
} from "lucide-react";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { KpiCard } from "@/components/admin/ui/KpiCard";
import { TiltCard } from "@/components/admin/ui/TiltCard";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { ServicesChart } from "@/components/admin/charts/ServicesChart";
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

export default function FinanceiroPage() {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="Análise Financeira"
                subtitle="Monitore o faturamento e o desempenho dos seus serviços em tempo real."
            />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <motion.div variants={item}>
                    <KpiCard
                        label="Receita Hoje"
                        value="R$ 1.240,00"
                        icon={DollarSign}
                        trend={{ value: "12%", isUp: true }}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <KpiCard
                        label="Ticket Médio"
                        value="R$ 85,50"
                        icon={TrendingUp}
                        trend={{ value: "5%", isUp: true }}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <KpiCard
                        label="Novos Clientes"
                        value="14"
                        icon={Users}
                        trend={{ value: "8%", isUp: true }}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <KpiCard
                        label="Taxa de Cancelamento"
                        value="3.2%"
                        icon={ArrowDownRight}
                        trend={{ value: "2%", isUp: false }}
                    />
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TiltCard className="p-6 glass-premium">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-amber-500" />
                            Faturamento Semanal
                        </h3>
                        <span className="text-xs text-stone-500">Últimos 7 dias</span>
                    </div>
                    <RevenueChart />
                </TiltCard>

                <TiltCard className="p-6 glass-premium">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-amber-500" />
                            Desempenho por Serviço
                        </h3>
                        <span className="text-xs text-stone-500">Volume de vendas</span>
                    </div>
                    <ServicesChart />
                </TiltCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <TiltCard className="p-6 glass-premium lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-amber-500" />
                            Ocupação
                        </h3>
                    </div>
                    <OccupancyChart />
                </TiltCard>

                <div className="lg:col-span-2 glass-premium rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-6">Resumo de Transações</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Corte + Barba Premium</p>
                                        <p className="text-xs text-stone-500">Há 15 minutos • João Silva</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-amber-500">R$ 120,00</p>
                                    <p className="text-xs text-stone-500">Pix</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
