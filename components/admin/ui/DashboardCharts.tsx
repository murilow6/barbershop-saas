"use client";

import { motion } from "framer-motion";

export function DashboardCharts() {
    const weeklyData = [45, 52, 38, 65, 48, 72, 58];
    const max = Math.max(...weeklyData);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Weekly Activity Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass rounded-3xl p-6"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Agendamentos Semanais</h3>
                    <span className="text-xs text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded-full">+12% vs last week</span>
                </div>

                <div className="flex h-48 items-end justify-between gap-2 px-2">
                    {weeklyData.map((val, i) => (
                        <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(val / max) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                                className="w-full rounded-t-lg bg-gradient-to-t from-amber-600/20 to-amber-500/60 transition-all group-hover:to-amber-400 group-hover:scale-x-105"
                            />
                            <span className="text-[10px] text-stone-500 uppercase font-bold">
                                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][i]}
                            </span>

                            {/* Tooltip on hover */}
                            <div className="absolute -top-10 scale-0 rounded bg-stone-800 px-2 py-1 text-[10px] text-white transition-transform group-hover:scale-100">
                                {val} agend.
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Capacity Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass rounded-3xl p-6"
            >
                <div className="mb-6">
                    <h3 className="font-semibold text-white">Ocupação da Agenda</h3>
                    <p className="text-xs text-stone-400 mt-1">Status em tempo real</p>
                </div>

                <div className="space-y-6">
                    {[
                        { label: 'Carlos Silva', val: 85, color: 'bg-amber-500' },
                        { label: 'André Ramos', val: 62, color: 'bg-amber-600' },
                        { label: 'Felipe Costa', val: 40, color: 'bg-stone-600' },
                    ].map((item, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-stone-300 font-medium">{item.label}</span>
                                <span className="text-white font-bold">{item.val}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800/50">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.val}%` }}
                                    transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                                    className={`h-full ${item.color} tech-glow shadow-[0_0_10px_rgba(212,175,55,0.3)]`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
