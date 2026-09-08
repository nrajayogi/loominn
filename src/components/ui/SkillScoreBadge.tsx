import { motion } from "framer-motion";
import { Activity, Shield, TrendingUp, Zap } from "lucide-react";
import { SkillStats, calculateSkillScore } from "@/lib/ai/skill-engine";
import { useState } from "react";

interface SkillScoreBadgeProps {
    stats: SkillStats;
    size?: "sm" | "md" | "lg" | "xl";
    showBreakdown?: boolean;
    expanded?: boolean;
}

export default function SkillScoreBadge({ stats, size = "md", showBreakdown = false, expanded = false }: SkillScoreBadgeProps) {
    const score = calculateSkillScore(stats);
    const [isHovered, setIsHovered] = useState(false);

    // Size mappings
    const sizeClasses = {
        sm: "w-10 h-10 text-xs",
        md: "w-20 h-20 text-lg",
        lg: "w-40 h-40",
        xl: "w-56 h-56"
    };

    const strokeWidth = size === "sm" ? 2 : size === "md" ? 3 : 4;
    const radius = size === "sm" ? 14 : size === "md" ? 34 : size === "lg" ? 70 : 100;
    const circumference = 2 * Math.PI * radius;

    let progress = 0;
    const raw = score.raw;

    if (raw < 500) progress = raw / 500;
    else if (raw < 1500) progress = (raw - 500) / 1000;
    else if (raw < 3000) progress = (raw - 1500) / 1500;
    else if (raw < 6000) progress = (raw - 3000) / 3000;
    else if (raw < 10000) progress = (raw - 6000) / 4000;
    else progress = 1;

    const offset = circumference - (progress * circumference);

    // Dynamic Font Scaling
    const getFontSize = (val: number) => {
        if (size === 'sm') return 'text-[10px]';
        const str = val.toString();
        if (size === 'md') return str.length > 4 ? 'text-xs' : 'text-sm';
        if (size === 'lg') return str.length > 6 ? 'text-2xl' : str.length > 4 ? 'text-3xl' : 'text-4xl';
        return str.length > 6 ? 'text-4xl' : 'text-6xl';
    };

    return (
        <div className="relative group inline-flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated Gauge */}
            <div className={`relative flex items-center justify-center ${sizeClasses[size]} font-bold font-mono`}>

                {/* Glow Effect Layer */}
                <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${score.color.replace('text-', 'bg-')}`} />

                {/* Background Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-lg">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        stroke="#27272a"
                        strokeWidth={strokeWidth}
                        className="opacity-50"
                    />
                    {/* Progress Ring with Glow */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="transparent"
                        className={`${score.color.replace('text-', 'stroke-')} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Score Number */}
                <span className={`${score.color} ${getFontSize(score.raw)} tracking-tighter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] z-10`}>
                    {size === "sm" && score.formatted >= 1000
                        ? (score.formatted / 1000).toFixed(1) + "k"
                        : score.formatted
                    }
                </span>
            </div>

            {/* Label */}
            {size !== "sm" && (
                <div className={`relative mt-4 px-4 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md`}>
                    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${score.color} drop-shadow-sm`}>
                        {score.label}
                    </span>
                </div>
            )}

            {/* Breakdown Card */}
            {(showBreakdown || isHovered || expanded) && (
                <motion.div
                    initial={expanded ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
                    animate={expanded ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                    exit={expanded ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    className={expanded
                        ? "w-full mt-8 bg-zinc-900/40 rounded-2xl p-6 border border-white/5 backdrop-blur-sm"
                        : "absolute bottom-full mb-4 z-50 w-80 p-5 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl left-1/2 -translate-x-1/2"
                    }
                >
                    {!expanded && (
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                            <span className="text-white font-bold text-sm tracking-wide">Orbit Score</span>
                            <div className={`px-2 py-0.5 rounded bg-white/5 border border-white/5 font-mono font-bold text-xs ${score.color}`}>
                                {score.formatted}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Headers */}
                        <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2">
                            <span>Metric</span>
                            <span>Growth</span>
                        </div>

                        {/* Stats Grid */}
                        <div className="space-y-2">
                            {/* BASE STATS */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors group/item">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <Zap size={14} className="text-yellow-500" />
                                        <span className="text-xs text-zinc-300 font-medium">Velocity</span>
                                    </div>
                                    <span className="text-xs font-mono text-white opacity-80">{stats.velocity}</span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors group/item">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={14} className="text-green-500" />
                                        <span className="text-xs text-zinc-300 font-medium">Projects</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-zinc-600">x10</span>
                                        <span className="text-xs font-mono text-green-400">+{Math.round(stats.projectsCompleted * 10).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors group/item">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={14} className="text-blue-500" />
                                        <span className="text-xs text-zinc-300 font-medium">On-Time</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-zinc-600">x5</span>
                                        <span className="text-xs font-mono text-blue-400">+{Math.round(stats.onTimeCompletion * 5).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MULTIPLIERS */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 flex flex-col gap-1 items-center justify-center">
                                <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                                    <Activity size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Complexity</span>
                                </div>
                                <span className="text-lg font-mono font-bold text-white">x {stats.complexity}</span>
                            </div>

                            <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20 flex flex-col gap-1 items-center justify-center">
                                <div className="flex items-center gap-1.5 text-red-400 mb-1">
                                    <Shield size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Risk</span>
                                </div>
                                <span className="text-lg font-mono font-bold text-white">/ {Math.max(stats.risk, 1)}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
