import { useState, useMemo } from "react";
import { Plus, UserPlus, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalState } from "@/context/GlobalStateContext";
import { calculateRelevanceScore } from "@/lib/ai/relevance";

// Potential Partners Database with Rich Data for "AI" Matching
const POTENTIAL_PARTNERS = [
    {
        id: 1,
        name: "Elena R.",
        role: "AI Researcher",
        company: "DeepMind",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        skills: ["AI", "Machine Learning", "Python", "Research"],
        projects: ["DeepLearning", "Eco-Tracker"]
    },
    {
        id: 2,
        name: "James K.",
        role: "Product Design",
        company: "Airbnb",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
        skills: ["UI/UX", "Design Systems", "Figma", "React"],
        projects: ["Loominn Rebuild", "Design System V2"]
    },
    {
        id: 3,
        name: "Sofia L.",
        role: "Frontend Dev",
        company: "Vercel",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        skills: ["React", "Next.js", "TypeScript", "Performance"],
        projects: ["Commerce V1"]
    },
    {
        id: 4,
        name: "Marcus T.",
        role: "CTO",
        company: "StartUp",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        skills: ["Leadership", "Cloud Architecture", "Go", "AI"],
        projects: ["Startup Launch"]
    },
];

export default function SuggestionNet() {
    const { userProfile } = useGlobalState();
    const [connected, setConnected] = useState<number[]>([]);

    const handleConnect = (id: number) => {
        setConnected(prev => [...prev, id]);
    };

    // "AI" Relevance Algorithm
    const suggestions = useMemo(() => {
        return POTENTIAL_PARTNERS.map(partner => {
            const result = calculateRelevanceScore(userProfile, partner);

            return {
                ...partner,
                relevance: result.percentage,
                scoreValue: result.score
            };
        }).sort((a, b) => b.scoreValue - a.scoreValue); // Sort by highest match
    }, [userProfile]); // Recalculate when user profile changes

    return (
        <div className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
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

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleConnect(user.id);
                            }}
                            disabled={connected.includes(user.id)}
                            className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${connected.includes(user.id)
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-white/10 hover:bg-white/20 text-white"
                                }`}
                        >
                            {connected.includes(user.id) ? "Partnered" : <><UserPlus size={12} /> Partner</>}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
