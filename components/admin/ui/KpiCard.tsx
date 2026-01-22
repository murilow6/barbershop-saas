"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    delay?: number;
}

export function KpiCard({ label, value, icon: Icon, trend, delay = 0 }: KpiCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="glass glass-hover tech-glow-hover group relative overflow-hidden rounded-3xl p-6"
        >
            {/* Background Accent */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl transition-all group-hover:bg-amber-500/10" />

            <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                </div>

                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend.isUp ? 'text-green-400' : 'text-rose-400'}`}>
                        {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {trend.value}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-stone-400">{label}</p>
                <h3 className="mt-1 text-3xl font-bold tracking-tight text-white">{value}</h3>
            </div>

            {/* Subtle trail animation on hover */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 transition-all duration-500 group-hover:w-full" />
        </motion.div>
    );
}
