import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp, Activity } from "lucide-react";


const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-indigo-500/50 rounded-xl p-3 shadow-2xl">
                <p className="text-slate-400 text-xs mb-1">{payload[0].payload.date}</p>
                <p className="text-white font-bold text-lg">{payload[0].value}</p>
            </div>
        );
    }
    return null;
};


export function TimeLineChart({ data, title = "Évolution temporelle", bgIcon1, bgIcon2, gradientColors = ["#22c55e", "#6366f1", "#a855f7"] }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl border border-slate-700/50">

            {/* Effet de lumière animé */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            {/* Icônes illustratives en arrière-plan */}
            {bgIcon1 && (
                <div className="absolute -bottom-12 -right-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
                    {React.cloneElement(bgIcon1, { className: "w-64 h-64", strokeWidth: 1 })}
                </div>
            )}
            {bgIcon2 && (
                <div className="absolute -top-8 -left-8 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500 rotate-12">
                    {React.cloneElement(bgIcon2, { className: "w-40 h-40", strokeWidth: 1 })}
                </div>
            )}

            {/* Cercles décoratifs */}
            <div className="absolute top-10 right-20 w-32 h-32 border-2 border-indigo-500/10 rounded-full opacity-50"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-purple-500/10 rounded-full opacity-40"></div>

            {/* Points décoratifs */}
            <div className="absolute top-8 left-16 w-2 h-2 bg-indigo-500/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-16 right-32 w-3 h-3 bg-purple-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/3 right-12 w-2 h-2 bg-indigo-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Titre */}
            <h3 className="relative z-10 text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">
                {title}
            </h3>

            {/* Graphique */}
            <div className="relative w-full -left-4 z-10">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={gradientColors[0]} />
                                <stop offset="50%" stopColor={gradientColors[1]} />
                                <stop offset="100%" stopColor={gradientColors[2]} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: '500' }} tickLine={false} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: '500' }} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            dot={{ fill: '#6366f1', strokeWidth: 2, r: 5, stroke: '#1e293b' }}
                            activeDot={{ r: 7, fill: '#a855f7', stroke: '#1e293b', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bordure lumineuse au hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/50 blur-sm"></div>
            </div>
        </div>
    );
}

// Valeurs par défaut pour les icônes illustratives
TimeLineChart.defaultProps = {
    bgIcon1: <TrendingUp />,
    bgIcon2: <Activity />,
};
