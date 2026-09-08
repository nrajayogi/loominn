"use client";

import { useState, useMemo } from "react";
import { 
    ShieldCheck, Award, CheckCircle2, ArrowUpRight, 
    ExternalLink, Plus, Filter, Sparkles, Clock, X, Code2, Layers
} from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import { ContributionRecord } from "@/lib/types/schema";

type FilterType = "all" | "code" | "architecture" | "design" | "milestone";

export default function HistoryPage() {
    const { contributions, addContribution, userProfile } = useGlobalState();
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state for logging a milestone
    const [newTitle, setNewTitle] = useState("");
    const [newProject, setNewProject] = useState("Loominn Rebuild");
    const [newType, setNewType] = useState<"code" | "design" | "architecture" | "milestone">("code");
    const [newComplexity, setNewComplexity] = useState<"Beginner" | "Intermediate" | "Advanced" | "Expert">("Advanced");
    const [newScore, setNewScore] = useState(350);
    const [newVerifier, setNewVerifier] = useState("Elena Rostova");
    const [newEvidence, setNewEvidence] = useState("");

    const totalVerifiedScore = useMemo(() => {
        return contributions.reduce((acc, c) => acc + c.scoreDelta, 0);
    }, [contributions]);

    const filteredContributions = useMemo(() => {
        if (activeFilter === "all") return contributions;
        return contributions.filter(c => c.type === activeFilter);
    }, [contributions, activeFilter]);

    const handleAddContribution = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        addContribution({
            userId: userProfile?.id || "user-current",
            projectId: newProject.toLowerCase().replace(/\s+/g, "-"),
            projectTitle: newProject,
            title: newTitle.trim(),
            type: newType,
            date: "Today",
            complexity: newComplexity,
            scoreDelta: Number(newScore) || 300,
            verifiedBy: newVerifier.trim() || "Peer Auditor",
            evidenceUrl: newEvidence.trim() || undefined
        });

        setNewTitle("");
        setNewEvidence("");
        setIsAddModalOpen(false);
    };

    const complexityColors: Record<string, string> = {
        Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        Expert: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                            Auditable Proof Ledger
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                        Verified Proof of Work
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                        Non-repudiable contributions, milestone deliveries, and peer-reviewed score deltas.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
                >
                    <Plus size={15} />
                    <span>Log Verified Milestone</span>
                </button>
            </div>

            {/* Summary Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/70 border border-emerald-500/20 p-5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Ledger Score</span>
                        <Award size={16} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">
                        +{totalVerifiedScore.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-400">Orbit score delta earned</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Milestones</span>
                        <CheckCircle2 size={16} className="text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">
                        {contributions.length}
                    </div>
                    <div className="text-[10px] text-zinc-500">Verified deliverables</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Top Tier</span>
                        <Sparkles size={16} className="text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                        Expert
                    </div>
                    <div className="text-[10px] text-purple-300">Peak task complexity</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>Verification</span>
                        <ShieldCheck size={16} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                        100%
                    </div>
                    <div className="text-[10px] text-emerald-400">Peer verified record</div>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        activeFilter === "all"
                            ? "bg-white text-black font-bold shadow"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                    }`}
                >
                    All Types ({contributions.length})
                </button>
                <button
                    onClick={() => setActiveFilter("code")}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        activeFilter === "code"
                            ? "bg-emerald-600 text-white font-bold"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                    }`}
                >
                    Code Deliverables
                </button>
                <button
                    onClick={() => setActiveFilter("architecture")}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        activeFilter === "architecture"
                            ? "bg-purple-600 text-white font-bold"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                    }`}
                >
                    Architecture RFCs
                </button>
                <button
                    onClick={() => setActiveFilter("design")}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        activeFilter === "design"
                            ? "bg-pink-600 text-white font-bold"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                    }`}
                >
                    Design Systems
                </button>
            </div>

            {/* Ledger List */}
            <div className="space-y-4">
                {filteredContributions.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-2">
                        <Clock size={24} className="mx-auto text-zinc-500" />
                        <h4 className="text-white font-bold text-sm">No Contributions Found in this Category</h4>
                        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                            Complete milestone tasks in project workspaces to build verifiable proof of work.
                        </p>
                    </div>
                ) : (
                    filteredContributions.map(record => (
                        <div 
                            key={record.id}
                            className="bg-zinc-900/70 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 space-y-3 transition-all group"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Link 
                                        href={`/projects/${record.projectId}`}
                                        className="text-xs font-mono uppercase text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                                    >
                                        <span>{record.projectTitle}</span>
                                        <ArrowUpRight size={12} />
                                    </Link>
                                    <span className="text-zinc-600">•</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-mono font-semibold ${complexityColors[record.complexity]}`}>
                                        {record.complexity} Complexity
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40 self-start sm:self-auto">
                                    <Award size={13} />
                                    <span>+{record.scoreDelta} Orbit</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                                    {record.title}
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    <span>Peer verified by <strong className="text-zinc-200">{record.verifiedBy}</strong></span>
                                </div>

                                <div className="flex items-center gap-4 text-[11px]">
                                    <span>{record.date}</span>
                                    {record.evidenceUrl && (
                                        <a
                                            href={record.evidenceUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
                                        >
                                            <span>Proof Artifact</span>
                                            <ExternalLink size={11} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: Log Verified Milestone */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <h3 className="text-white font-bold text-sm">Log Proof-of-Work Milestone</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleAddContribution} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Milestone Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. End-to-end WebSocket channel sync"
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Project</label>
                                <input
                                    type="text"
                                    required
                                    value={newProject}
                                    onChange={(e) => setNewProject(e.target.value)}
                                    placeholder="Project Name"
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-300">Type</label>
                                    <select
                                        value={newType}
                                        onChange={(e) => setNewType(e.target.value as any)}
                                        className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="code">Code</option>
                                        <option value="architecture">Architecture</option>
                                        <option value="design">Design</option>
                                        <option value="milestone">Milestone</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-300">Complexity</label>
                                    <select
                                        value={newComplexity}
                                        onChange={(e) => setNewComplexity(e.target.value as any)}
                                        className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-300">Score Delta (+)</label>
                                    <input
                                        type="number"
                                        value={newScore}
                                        onChange={(e) => setNewScore(Number(e.target.value))}
                                        className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-300">Verified By</label>
                                    <input
                                        type="text"
                                        value={newVerifier}
                                        onChange={(e) => setNewVerifier(e.target.value)}
                                        className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Evidence / Git Commit URL</label>
                                <input
                                    type="url"
                                    value={newEvidence}
                                    onChange={(e) => setNewEvidence(e.target.value)}
                                    placeholder="https://github.com/.../commit/..."
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md"
                                >
                                    Commit to Ledger
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
