"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
    Search, Plus, Shield, Users, ArrowRight, Sparkles, 
    Layers, Award, CheckCircle2, ChevronRight, Filter, 
    Clock, Terminal, Code2, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "@/context/GlobalStateContext";
import { calculateSkillScore, SkillStats } from "@/lib/ai/skill-engine";
import { DEFAULT_NEW_USER_STATS } from "@/lib/types/schema";

interface ProjectRolePreview {
    title: string;
    minScore: number;
    skills: string[];
}

interface ProjectDiscoveryItem {
    id: string;
    slug: string;
    title: string;
    domain: string;
    difficulty: "Intermediate" | "Advanced" | "Expert";
    description: string;
    mission: string;
    leadName: string;
    leadRole: string;
    leadAvatar?: string;
    teamSize: number;
    collaboratorAvatars: string[];
    openRoles: ProjectRolePreview[];
    latestUpdate: string;
    verifiedDeliverables: number;
    gradient: string;
    seekingNeed: "roles" | "partners" | "reviewers";
}

const DISCOVERY_PROJECTS: ProjectDiscoveryItem[] = [
    {
        id: "p-loominn",
        slug: "loominn-rebuild",
        title: "Loominn Rebuild",
        domain: "Distributed Systems",
        difficulty: "Expert",
        description: "Rebuilding Loominn as a work-centered social network rejecting vanity metrics and arbitrary score walls.",
        mission: "Provide verifiable proof-of-work, peer audit trails, and collaborative project workspaces.",
        leadName: "Rajayogi Nandina",
        leadRole: "Lead Architect",
        leadAvatar: "",
        teamSize: 3,
        collaboratorAvatars: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
        ],
        openRoles: [
            { title: "Lead Architect", minScore: 6500, skills: ["Next.js 16", "Turbopack", "TypeScript"] },
            { title: "React Developer", minScore: 2500, skills: ["Tailwind", "Framer Motion", "State"] },
            { title: "UI Designer", minScore: 1500, skills: ["Design Systems", "Figma"] }
        ],
        latestUpdate: "Polymorphic feed cards and transparent Orbit score calculations deployed to production.",
        verifiedDeliverables: 14,
        gradient: "from-blue-600/20 via-indigo-600/10 to-purple-600/20",
        seekingNeed: "roles"
    },
    {
        id: "p-quantum",
        slug: "quantum-ledger",
        title: "Quantum Ledger",
        domain: "Cryptography & Web3",
        difficulty: "Expert",
        description: "Post-quantum decentralized identity verification protocol using zero-knowledge state channels.",
        mission: "Enable zero-trust identity verification resistant to quantum cryptanalysis.",
        leadName: "Elena R.",
        leadRole: "Security Protocol Lead",
        leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        teamSize: 4,
        collaboratorAvatars: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
        ],
        openRoles: [
            { title: "Security Protocol Auditor", minScore: 6000, skills: ["Zero-Knowledge", "Rust", "Formal Verification"] },
            { title: "Rust Core Developer", minScore: 4500, skills: ["Rust", "WASM", "Networking"] }
        ],
        latestUpdate: "Lattice-based signature benchmark testnet finalized with 99.4% verification rate.",
        verifiedDeliverables: 9,
        gradient: "from-cyan-600/20 via-blue-600/10 to-teal-600/20",
        seekingNeed: "partners"
    },
    {
        id: "p-nebula",
        slug: "nebula-ai",
        title: "Nebula AI",
        domain: "AI & Machine Learning",
        difficulty: "Advanced",
        description: "Generative spatial modeling and structural engineering simulation for autonomous physical architectures.",
        mission: "Bridging large language models with CAD geometry kernels and stress analysis.",
        leadName: "Marcus T.",
        leadRole: "AI Architecture Lead",
        leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        teamSize: 5,
        collaboratorAvatars: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
        ],
        openRoles: [
            { title: "Graph Neural Net Specialist", minScore: 5500, skills: ["PyTorch", "GNN", "CUDA"] },
            { title: "WebGL Visualizer", minScore: 3000, skills: ["Three.js", "Shaders", "TypeScript"] }
        ],
        latestUpdate: "Trained 3D diffusion checkpoint on 250,000 structural engineering blueprints.",
        verifiedDeliverables: 11,
        gradient: "from-purple-600/20 via-pink-600/10 to-rose-600/20",
        seekingNeed: "roles"
    },
    {
        id: "p-aura",
        slug: "design-system-v2",
        title: "Aura Design System",
        domain: "Design Systems",
        difficulty: "Intermediate",
        description: "Multi-platform design token engine powering high-density engineer tooling with zero runtime overhead.",
        mission: "Unifying accessibility, responsive tokenization, and semantic color theory.",
        leadName: "Pratyusha Sharma",
        leadRole: "Design Systems Lead",
        leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        teamSize: 3,
        collaboratorAvatars: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
        ],
        openRoles: [
            { title: "Design System Lead", minScore: 4800, skills: ["Figma Tokens", "CSS Architecture", "React"] },
            { title: "Iconographer & Motion Designer", minScore: 1800, skills: ["SVG", "Framer Motion", "Iconography"] }
        ],
        latestUpdate: "WCAG AAA contrast audit completed across all 144 surface tokens.",
        verifiedDeliverables: 16,
        gradient: "from-emerald-600/20 via-teal-600/10 to-green-600/20",
        seekingNeed: "reviewers"
    }
];

const DOMAINS = [
    { id: "all", label: "All Domains" },
    { id: "Distributed Systems", label: "Distributed Systems" },
    { id: "AI & Machine Learning", label: "AI & Machine Learning" },
    { id: "Design Systems", label: "Design Systems" },
    { id: "Cryptography & Web3", label: "Cryptography & Web3" }
];

export default function ProjectsPage() {
    const { userProjects, userProfile, applications } = useGlobalState();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("all");
    const [selectedNeed, setSelectedNeed] = useState<"all" | "roles" | "partners" | "reviewers">("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "Intermediate" | "Advanced" | "Expert">("all");

    // Calculate user's effective Orbit Score for transparent eligibility preview
    const effectiveStats: SkillStats = userProfile?.stats ? {
        velocity: userProfile.stats.velocity,
        projectsCompleted: userProfile.stats.projectsCompleted,
        onTimeCompletion: userProfile.stats.onTimeCompletion,
        complexity: userProfile.stats.complexity,
        risk: userProfile.stats.risk
    } : DEFAULT_NEW_USER_STATS;

    const userOrbitScore = calculateSkillScore(effectiveStats).formatted;

    // Merge user created projects
    const allProjects: ProjectDiscoveryItem[] = useMemo(() => {
        const dynamicUserProjects: ProjectDiscoveryItem[] = (userProjects || [])
            .filter((p: any) => p.status === 'approved' || p.title)
            .map((p: any) => {
                const slug = (p.title || "custom-project").toLowerCase().replace(/\s+/g, "-");
                return {
                    id: `up-${p.id}`,
                    slug,
                    title: p.title || "Untitled Project",
                    domain: p.domain || "Distributed Systems",
                    difficulty: (p.difficulty || "Intermediate") as "Intermediate" | "Advanced" | "Expert",
                    description: p.description || "Community-driven collaborative project on Loominn.",
                    mission: p.description || "Building proof of work together.",
                    leadName: p.author || userProfile.name,
                    leadRole: "Project Lead",
                    leadAvatar: userProfile.image,
                    teamSize: p.roles ? p.roles.length + 1 : 2,
                    collaboratorAvatars: [],
                    openRoles: (p.roles || []).map((r: any) => ({
                        title: r.title || "Collaborator",
                        minScore: r.minScore || 2000,
                        skills: ["TypeScript", "Collaboration"]
                    })),
                    latestUpdate: "Newly approved and active in the Loominn discovery network.",
                    verifiedDeliverables: 1,
                    gradient: "from-blue-600/20 via-zinc-800/20 to-purple-600/20",
                    seekingNeed: "roles"
                };
            });

        return [...DISCOVERY_PROJECTS, ...dynamicUserProjects];
    }, [userProjects, userProfile]);

    // Filtering
    const filteredProjects = useMemo(() => {
        return allProjects.filter(project => {
            const matchesSearch = 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.openRoles.some(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesDomain = selectedDomain === "all" || project.domain === selectedDomain;
            const matchesNeed = selectedNeed === "all" || project.seekingNeed === selectedNeed;
            const matchesDiff = selectedDifficulty === "all" || project.difficulty === selectedDifficulty;

            return matchesSearch && matchesDomain && matchesNeed && matchesDiff;
        });
    }, [allProjects, searchQuery, selectedDomain, selectedNeed, selectedDifficulty]);

    return (
        <div className="min-h-screen space-y-8 px-4 md:px-8 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
                            Work-Centered Discovery Hub
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Collaborative Projects<span className="text-blue-500">.</span>
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-xl mt-2 leading-relaxed">
                        Discover open initiatives, explore high-impact roles, stake your skills, and build non-repudiable proof of work through peer-reviewed milestones.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/projects/status"
                        className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-2"
                    >
                        <Shield size={14} className="text-blue-400" />
                        <span>My Applications ({applications.length})</span>
                    </Link>

                    <Link
                        href="/projects/create"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02]"
                    >
                        <Plus size={16} />
                        <span>Launch Project</span>
                    </Link>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl">
                    <div className="text-[11px] text-zinc-400">Your Orbit Score</div>
                    <div className="text-xl md:text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                        {userOrbitScore.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Verified Proof-of-Work rating</div>
                </div>

                <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl">
                    <div className="text-[11px] text-zinc-400">Active Workspaces</div>
                    <div className="text-xl md:text-2xl font-bold font-mono text-white mt-0.5">
                        {allProjects.length}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Collaborative engineering hubs</div>
                </div>

                <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl">
                    <div className="text-[11px] text-zinc-400">Open Project Roles</div>
                    <div className="text-xl md:text-2xl font-bold font-mono text-blue-400 mt-0.5">
                        {allProjects.reduce((acc, p) => acc + p.openRoles.length, 0)}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Transparent Orbit guidance</div>
                </div>

                <div className="bg-zinc-900/60 border border-white/5 p-4 rounded-2xl">
                    <div className="text-[11px] text-zinc-400">Verified Deliverables</div>
                    <div className="text-xl md:text-2xl font-bold font-mono text-purple-400 mt-0.5">
                        {allProjects.reduce((acc, p) => acc + p.verifiedDeliverables, 0)}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Audited milestone proofs</div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-4 bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search projects by title, mission, domain, or role requirements..."
                            className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Needs Filter */}
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {(["all", "roles", "partners", "reviewers"] as const).map(need => (
                            <button
                                key={need}
                                onClick={() => setSelectedNeed(need)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                                    selectedNeed === need
                                        ? "bg-white text-black font-bold shadow-md"
                                        : "bg-black/40 text-zinc-400 hover:text-white border border-white/5"
                                }`}
                            >
                                {need === "all" ? "All Needs" : need === "roles" ? "Open Roles" : need === "partners" ? "Seeking Partners" : "Seeking Reviewers"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Domain Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {DOMAINS.map(d => (
                        <button
                            key={d.id}
                            onClick={() => setSelectedDomain(d.id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                selectedDomain === d.id
                                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                                    : "bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="py-20 text-center bg-zinc-900/30 border border-white/5 rounded-3xl space-y-3">
                    <Compass size={36} className="mx-auto text-zinc-600" />
                    <h3 className="text-white font-bold text-base">No Projects Match Your Search</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                        No active collaborative workspaces found for &ldquo;{searchQuery || selectedDomain}&rdquo;. Try widening your filters or launch a new initiative.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedDomain("all"); setSelectedNeed("all"); setSelectedDifficulty("all"); }}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-colors"
                        >
                            Reset All Filters
                        </button>
                        <Link
                            href="/projects/create"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
                        >
                            Launch Project
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProjects.map(project => {
                        const difficultyColor = 
                            project.difficulty === "Expert" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
                            project.difficulty === "Advanced" ? "text-purple-400 bg-purple-500/10 border-purple-500/30" :
                            "text-blue-400 bg-blue-500/10 border-blue-500/30";

                        return (
                            <div
                                key={project.id}
                                className={`bg-gradient-to-br ${project.gradient} bg-zinc-900/80 border border-white/10 hover:border-white/20 rounded-3xl p-6 md:p-7 space-y-5 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between group`}
                            >
                                {/* Card Header */}
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-900/30 shrink-0">
                                                {project.title.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-zinc-400 font-medium">
                                                        {project.domain}
                                                    </span>
                                                    <span>•</span>
                                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${difficultyColor}`}>
                                                        {project.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0 flex items-center gap-1">
                                            <CheckCircle2 size={11} />
                                            <span>{project.verifiedDeliverables} Verified</span>
                                        </span>
                                    </div>

                                    <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Team Presence */}
                                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {project.collaboratorAvatars.map((avatar, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={avatar}
                                                        alt="Collaborator"
                                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-zinc-900 object-cover"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[11px] text-zinc-400">
                                                Lead: <strong>{project.leadName}</strong> ({project.teamSize} contributors)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Open Roles Section */}
                                <div className="space-y-2.5 pt-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                                            Open Collaboration Roles ({project.openRoles.length})
                                        </span>
                                        <span className="text-[10px] text-zinc-500">
                                            Recommended Orbit Guidance
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {project.openRoles.map((role, idx) => {
                                            const meetsScore = userOrbitScore >= role.minScore;

                                            return (
                                                <div 
                                                    key={idx}
                                                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-white">{role.title}</span>
                                                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                                                meetsScore 
                                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                                                                    : "bg-purple-500/10 text-purple-300 border-purple-500/25"
                                                            }`}>
                                                                {role.minScore.toLocaleString()}+ Orbit
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {role.skills.map((skill, sIdx) => (
                                                                <span key={sIdx} className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="shrink-0 text-right">
                                                        {meetsScore ? (
                                                            <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                                                                <CheckCircle2 size={12} /> Eligible to Stake
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-semibold text-purple-400 flex items-center gap-1">
                                                                <Sparkles size={12} /> Portfolio Review Path
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Latest Technical Update */}
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-zinc-300 flex items-start gap-2">
                                    <Clock size={14} className="text-blue-400 shrink-0 mt-0.5" />
                                    <div className="min-w-0">
                                        <strong className="text-white">Milestone Log: </strong>
                                        <span>{project.latestUpdate}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 pt-2">
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-900/20"
                                    >
                                        <span>View Scope & Roles</span>
                                        <ArrowRight size={14} />
                                    </Link>

                                    <Link
                                        href={`/projects/${project.slug}/board`}
                                        className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-white/5"
                                    >
                                        <Layers size={14} />
                                        <span>Workspace</span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
