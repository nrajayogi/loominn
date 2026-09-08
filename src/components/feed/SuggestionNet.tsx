"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Zap, ChevronDown, Shield, Check, UserCheck, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "@/context/GlobalStateContext";
import { calculateRelevanceScore } from "@/lib/ai/relevance";
import { MOCK_USERS_DB } from "@/lib/data/mock";
import { RelationshipTier } from "@/lib/types/schema";

const GRID_BACKGROUND_STYLE = {
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
    backgroundSize: '24px 24px'
};

export default function SuggestionNet() {
    const { 
        userProfile, 
        networkConnections, 
        sendConnectionRequest, 
        followingUsers, 
        toggleFollowUser 
    } = useGlobalState();

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleConnect = (userId: string, tier: RelationshipTier) => {
        sendConnectionRequest(userId, tier);
        setOpenDropdown(null);
    };

    // Relevance Algorithm
    const suggestions = useMemo(() => {
        return MOCK_USERS_DB.map(partner => {
            const result = calculateRelevanceScore(userProfile, partner);

            return {
                ...partner,
                relevance: result.percentage,
                scoreValue: result.score,
                breakdown: result.breakdown
            };
        }).sort((a, b) => b.scoreValue - a.scoreValue);
    }, [userProfile]);

    const getConnection = (userId: string) => {
        return networkConnections.find(c => c.userId === userId || c.name.toLowerCase() === userId.toLowerCase());
    };

    return (
        <div ref={dropdownRef} className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
            {/* Background Grid FX */}
            <div 
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={GRID_BACKGROUND_STYLE}
            />

            <div className="relative z-10 flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-white font-bold text-base flex items-center gap-2">
                        <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                        <span>Orbit Match Discovery</span>
                    </h3>
                    <p className="text-zinc-400 text-xs mt-0.5">
                        Matched via verified technical milestones and domain density.
                    </p>
                </div>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-800/30">
                    Transparent Algorithm
                </span>
            </div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggestions.map((user) => {
                    const userId = user.id || user.name.toLowerCase().replace(/\s+/g, '-');
                    const conn = getConnection(userId);
                    const isFollowing = followingUsers.includes(userId);

                    return (
                        <motion.div
                            key={userId}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -3 }}
                            className="bg-black/50 border border-white/5 hover:border-white/15 rounded-2xl p-4 flex flex-col items-center text-center group transition-all relative"
                        >
                            {/* Avatar & Match Score Badge */}
                            <div className="relative mb-3 group/score">
                                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500 relative shadow-lg">
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        fill
                                        className="rounded-full object-cover border-2 border-black"
                                        unoptimized
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-zinc-900 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full border border-zinc-700 shadow-md font-mono cursor-help">
                                    {user.relevance}
                                </div>

                                {/* Score Breakdown Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl opacity-0 invisible group-hover/score:opacity-100 group-hover/score:visible transition-all z-50 pointer-events-none">
                                    <h5 className="text-[11px] font-bold text-white mb-2 border-b border-white/10 pb-1 flex items-center justify-between">
                                        <span>Orbit Synergy</span>
                                        <span className="text-emerald-400 font-mono">{user.relevance}</span>
                                    </h5>
                                    <div className="space-y-1.5 text-[10px] text-zinc-400">
                                        <div className="flex justify-between items-center">
                                            <span>Skills Overlap</span>
                                            <span className="text-blue-400 font-mono">+{user.breakdown.skillScore}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Mutual Projects</span>
                                            <span className="text-purple-400 font-mono">+{user.breakdown.projectScore}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Domain Density</span>
                                            <span className="text-amber-400 font-mono">+{user.breakdown.domainScore}</span>
                                        </div>
                                        {user.breakdown.trustScore ? (
                                            <div className="flex justify-between items-center pt-1 mt-1 border-t border-zinc-800">
                                                <span className="text-emerald-400 flex items-center gap-1">
                                                    <Shield size={10} /> Verified Trust
                                                </span>
                                                <span className="text-emerald-400 font-mono">+{user.breakdown.trustScore}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-zinc-900 border-r border-b border-zinc-700" />
                                </div>
                            </div>

                            {/* User Info */}
                            <h4 className="text-white font-bold text-xs truncate max-w-[130px]">{user.name}</h4>
                            <p className="text-zinc-400 text-[11px] leading-tight mt-0.5 truncate max-w-[130px]">{user.role}</p>
                            <span className="text-[10px] text-zinc-500 mb-3 truncate max-w-[130px]">{user.company}</span>

                            {/* Connection Action */}
                            <div className="relative w-full mt-auto">
                                {conn?.status === "connected" ? (
                                    <div className="w-full py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                                        <Check size={12} />
                                        <span className="capitalize">{conn.tier}</span>
                                    </div>
                                ) : conn?.status === "request_sent" ? (
                                    <div className="w-full py-1.5 rounded-xl text-[10px] font-mono flex items-center justify-center bg-zinc-800 text-zinc-400 border border-white/5">
                                        Request Sent ({conn.tier})
                                    </div>
                                ) : (
                                    <div className="flex w-full">
                                        <button
                                            onClick={() => handleConnect(userId, "partner")}
                                            className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-l-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all border border-blue-500/30 border-r-0"
                                            title="Connect as Project Partner"
                                        >
                                            <Plus size={12} /> Partner
                                        </button>
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === userId ? null : userId)}
                                            className={`px-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-r-xl transition-all border border-blue-500/30 ${
                                                openDropdown === userId ? "bg-blue-600 text-white" : ""
                                            }`}
                                            aria-label="More relationship options"
                                        >
                                            <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === userId ? "rotate-180" : ""}`} />
                                        </button>
                                    </div>
                                )}

                                {/* Dropdown for other tiers */}
                                <AnimatePresence>
                                    {openDropdown === userId && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl p-1 space-y-1"
                                        >
                                            <button
                                                onClick={() => handleConnect(userId, "colleague")}
                                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-[11px] text-zinc-300 flex items-center justify-between"
                                            >
                                                <span>+ Colleague</span>
                                                <span className="text-[9px] text-zinc-500">Peer</span>
                                            </button>
                                            <button
                                                onClick={() => handleConnect(userId, "ally")}
                                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-[11px] text-zinc-300 flex items-center justify-between"
                                            >
                                                <span>+ Ally</span>
                                                <span className="text-[9px] text-zinc-500">Mentor</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    toggleFollowUser(userId);
                                                    setOpenDropdown(null);
                                                }}
                                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-[11px] text-purple-400 border-t border-white/5 mt-0.5"
                                            >
                                                {isFollowing ? "Unfollow" : "+ Follow Updates"}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
