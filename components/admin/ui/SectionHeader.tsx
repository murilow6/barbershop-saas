"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}

export function SectionHeader({ title, subtitle, actions }: SectionHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
                    {title}
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                </h1>
                {subtitle && (
                    <p className="mt-2 text-lg text-stone-400 font-medium">
                        {subtitle}
                    </p>
                )}
            </motion.div>

            {actions && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {actions}
                </motion.div>
            )}
        </div>
    );
}
