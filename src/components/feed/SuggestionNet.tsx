import { useState, useMemo } from "react";
import { Plus, Zap, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "@/context/GlobalStateContext";
import { calculateRelevanceScore } from "@/lib/ai/relevance";
import { MOCK_USERS_DB } from "@/lib/data/mock";
import { UserProfile } from "@/lib/types/schema";

export default function SuggestionNet() {
    const { userProfile } = useGlobalState();
    const [connected, setConnected] = useState<Record<string, string>>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleConnect = (id: number | string, type: string = "Partner") => {
        setConnected(prev => ({ ...prev, [String(id)]: type }));
        setOpenDropdown(null);
    };

    // "AI" Relevance Algorithm
    const suggestions = useMemo(() => {
        return MOCK_USERS_DB.map(partner => {
            const result = calculateRelevanceScore(userProfile, partner);

            return {
                ...partner,
                relevance: result.percentage,
                scoreValue: result.score
            };
        }).sort((a, b) => b.scoreValue - a.scoreValue); // Sort by highest match
    }, [userProfile]); // Recalculate when user profile changes

    return (
        <div className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl p-6 relative">
            {/* Background Grid FX */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="relative z-10 flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Zap size={18} className="text-yellow-500 fill-current" />
                        Orbit Discovery
                    </h3>
                    <p className="text-zinc-500 text-xs mt-1">Found {suggestions.length} professionals matching your contributions.</p>
                </div>
                <button className="text-xs text-blue-400 hover:text-white transition-colors">Expand Radar</button>
            </div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggestions.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.03)" }}
                        className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center group cursor-pointer transition-colors"
                    >
                        <div className="relative mb-3">
                            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500">
                                <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-black" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-zinc-900 text-[10px] font-bold text-green-400 px-1.5 py-0.5 rounded-full border border-zinc-800 shadow-sm" title="AI Relevance Score based on shared skills & projects">
                                {user.relevance}
                            </div>
                        </div>

                        <h4 className="text-white font-bold text-sm mb-0.5">{user.name}</h4>
                        <p className="text-zinc-400 text-xs mb-3">{user.role} <br /><span className="opacity-50">at {user.company}</span></p>

                        <div className="relative w-full">
                            {!connected[String(user.id)] ? (
                                <div className="flex w-full group">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConnect(user.id as number | string, "Partner");
                                        }}
                                        className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-l-lg text-xs font-bold flex items-center justify-center gap-1 transition-all border-r border-black/20"
                                    >
                                        <Plus size={12} /> Partner
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdown(openDropdown === String(user.id) ? null : String(user.id));
                                        }}
                                        className={`px-2 bg-white/10 hover:bg-white/20 text-white rounded-r-lg transition-all ${openDropdown === String(user.id) ? "bg-white/20" : ""}`}
                                        aria-label="More connection options"
                                    >
                                        <ChevronDown size={12} className={`transition-transform duration-200 ${openDropdown === String(user.id) ? "rotate-180" : ""}`} />
                                    </button>
                                </div>
                            ) : (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all bg-green-500/10 text-green-500 border border-green-500/20 cursor-default"
                                >
                                    {connected[String(user.id)]}
                                </motion.button>
                            )}

                            {/* Creative Floating Dropdown */}
                            <AnimatePresence>
                                {openDropdown === String(user.id) && !connected[String(user.id)] && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-1.5 space-y-0.5">
                                            {[
                                                { type: "Partner", desc: "Collaborate on projects" },
                                                { type: "Colleague", desc: "Professional peer" },
                                                { type: "Ally", desc: "Supportive connection" }
                                            ].map((option) => (
                                                <button
                                                    key={option.type}
                                                    onClick={() => handleConnect(user.id as number | string, option.type)}
                                                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors group/item"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-white group-hover/item:text-blue-400 transition-colors">{option.type}</span>
                                                        {option.type === "Partner" && <Zap size={12} className="text-yellow-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />}
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500">{option.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
