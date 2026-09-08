"use client";

import { Plus, Search, LayoutGrid, List, Filter, TrendingUp, Zap, Shield, Award, Users, ChevronRight, Rocket } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "@/context/GlobalStateContext";

export default function ProjectsPage() {
    const { userProjects, userProfile, commitToProject } = useGlobalState();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [investMode, setInvestMode] = useState<{ id: number, amount: number } | null>(null);

    // Merge static demo projects with dynamic user projects for a full marketplace feel
    // In a real app, this would come from a backend.
    const DEMO_PROJECTS = [
        {
            id: 901,
            title: "Quantum Ledger",
            description: "Decentralized identity verification protocol using post-quantum cryptography.",
            status: "approved",
            members: 12,
            updated: "2h ago",
            difficulty: "expert",
            color: "from-cyan-500 to-blue-600",
            initial: "QL",
            likes: 342,
            raised: 45000,
            tags: ["Crypto", "Security"]
        },
        {
            id: 902,
            title: "Nebula AI",
            description: "Generative model for architectural blueprints and structural analysis.",
            status: "approved",
            members: 8,
            updated: "5h ago",
            difficulty: "advanced",
            color: "from-purple-500 to-pink-600",
            initial: "NA",
            likes: 128,
            raised: 12000,
            tags: ["AI", "Engineering"]
        }
    ];

    const allProjects = useMemo(() => {
        // Filter only approved projects
        const dynamic = (userProjects || []).filter((p: any) => p.status === 'approved').map((p: any) => ({
            ...p,
            members: p.roles ? p.roles.length + 1 : 1,
            updated: "Just now",
            difficulty: p.difficulty || "intermediate",
            color: "from-green-500 to-emerald-600", // Default or dynamic
            initial: p.title.substring(0, 2).toUpperCase(),
            raised: p.likes * 100 // Simulating raised amount based on likes
        }));
        return [...DEMO_PROJECTS, ...dynamic];
    }, [userProjects]);

    const filteredProjects = allProjects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInvest = (id: number) => {
        if (commitToProject(100)) { // Invest 100 points
            // Visual feedback handled by global notification
        }
    };

    return (
        <div className="min-h-screen space-y-8 px-4 md:px-8 max-w-7xl mx-auto pb-20">

            {/* 1. INNOVATIVE FEATURE: Live Project Ticker */}
            <div className="w-full bg-zinc-900/50 border-y border-white/5 py-2 overflow-hidden flex items-center relative">
                <div className="absolute left-0 bg-gradient-to-r from-black to-transparent w-20 h-full z-10" />
                <div className="absolute right-0 bg-gradient-to-l from-black to-transparent w-20 h-full z-10" />
                <motion.div
                    className="flex items-center gap-12 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                >
                    {[...allProjects, ...allProjects, ...allProjects].map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                            <Rocket size={12} className="text-blue-500" />
                            <span className="font-bold text-white">{p.title}</span>
                            <span className="text-green-400">+{p.raised.toLocaleString()} XP Raised</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">PROJECTS<span className="text-blue-500">.</span></h1>
                    <p className="text-zinc-400 max-w-lg">
                        The Innovation Marketplace. Invest your Orbit Score in the next unicorn.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="block text-xs text-zinc-500 uppercase tracking-wider font-bold">Your Capital</span>
                        <div className="flex items-center justify-end gap-2">
                            <Award className="text-yellow-500" size={18} />
                            <span className="text-2xl font-mono font-bold text-white">{userProfile.stakedScore?.toLocaleString() || 0}</span>
                        </div>
                    </div>

                    <Link href="/projects/create">
                        <button className="h-12 px-6 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                            <Plus size={20} />
                            Launch Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Featured / Hero Project (Dynamic: Top Raised) */}
            {allProjects.length > 0 && (
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group cursor-pointer border border-white/10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${allProjects[0].color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp size={12} /> Top Trending
                            </span>
                            <span className="text-zinc-400 text-xs flex items-center gap-1">
                                <Users size={12} /> {allProjects[0].members} Contributors
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{allProjects[0].title}</h2>
                        <p className="text-zinc-300 mb-6 line-clamp-2 md:line-clamp-none">{allProjects[0].description}</p>

                        <div className="flex items-center gap-4">
                            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2">
                                View Details <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={() => handleInvest(allProjects[0].id)}
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-bold transition-all flex items-center gap-2 backdrop-blur-md"
                            >
                                <Zap size={16} className="text-yellow-400" /> Invest 100 XP
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="sticky top-4 z-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search marketplace..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-white focus:ring-0 pl-10 text-sm"
                    />
                </div>

                <div className="flex gap-1 overflow-x-auto w-full md:w-auto p-1">
                    {["all", "trending", "newest", "high-risk"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === tab ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: any) => (
                    <div key={project.id} className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1">

                        {/* Dynamic Gradient Overlay */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${project.color}`} />

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                    {project.initial}
                                </div>
                                <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-zinc-400">
                                    {project.difficulty?.toUpperCase().substring(0, 3)}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                            <p className="text-sm text-zinc-400 mb-6 line-clamp-2 min-h-[40px]">{project.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(project.tags || ["Innovation"]).slice(0, 3).map((tag: string, i: number) => (
                                    <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-zinc-500 border border-white/5">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Raised</span>
                                    <span className="text-sm font-mono font-bold text-green-400">XP {project.raised.toLocaleString()}</span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleInvest(project.id);
                                    }}
                                    className="p-2 rounded-lg bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"
                                    title="Invest 100 XP"
                                >
                                    <Zap size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-zinc-500">No projects found. Launch one!</p>
                </div>
            )}

        </div>
    );
}
