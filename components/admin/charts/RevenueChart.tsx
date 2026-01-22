"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
    { name: "01/01", value: 1200 },
    { name: "02/01", value: 1800 },
    { name: "03/01", value: 1400 },
    { name: "04/01", value: 2200 },
    { name: "05/01", value: 2600 },
    { name: "06/01", value: 2100 },
    { name: "07/01", value: 2900 },
];

export function RevenueChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                    </defs>
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
                        tickFormatter={(value) => `R$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1c1917',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#D4AF37' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#D4AF37"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
