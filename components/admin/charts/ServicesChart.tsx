"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const data = [
    { name: "Corte", value: 450 },
    { name: "Barba", value: 320 },
    { name: "Combo", value: 580 },
    { name: "Lavagem", value: 120 },
    { name: "Penteado", value: 90 },
];

const COLORS = ['#D4AF37', '#B8860B', '#DAA520', '#A0522D', '#8B4513'];

export function ServicesChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#888', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: '#1c1917',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px'
                        }}
                    />
                    <Bar
                        dataKey="value"
                        radius={[6, 6, 0, 0]}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
