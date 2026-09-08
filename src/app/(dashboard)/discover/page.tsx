"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
    Search, Sparkles, Users, Briefcase, Layers, Hash, 
    ArrowUpRight, Shield, Check, UserPlus, Filter, 
    Zap, Compass, Play, ChevronRight, Award
} from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { RelationshipTier, Perspective, ProjectOpportunityFeedContent } from "@/lib/types/schema";
import SkillScoreBadge from "@/components/ui/SkillScoreBadge";
import CommitModal from "@/components/projects/CommitModal";
import PerspectiveModalViewer from "@/components/feed/PerspectiveModalViewer";

type DiscoverTab = "foryou" | "people" | "projects" | "perspectives" | "topics";

interface SuggestedPeer {
    id: string;
    name: string;
    handle: string;
    role: string;
    avatar: string;
    orbitScore: number;
    matchReason: string;
    sharedSkills: string[];
    tierRecommendation: RelationshipTier;
}

const PEERS: SuggestedPeer[] = [
    {
        id: "u-pratyusha",
        name: "Pratyusha Sharma",
        handle: "@pratyu",
        role: "Lead Product Designer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        orbitScore: 4850,
        matchReason: "Co-authored 3 design systems with 98% design token alignment",
        sharedSkills: ["Design Systems", "Figma", "UI Engineering"],
        tierRecommendation: "partner"
    },
    {
        id: "u-elena",
        name: "Elena Rostova",
        handle: "@elena_crypto",
        role: "Cryptography Researcher",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
        orbitScore: 6200,
        matchReason: "Top peer in Lattice Cryptography & Zero-Knowledge Verification",
        sharedSkills: ["Rust", "Zero Knowledge", "Protocol Security"],
        tierRecommendation: "colleague"
    },
    {
        id: "u-siddharth",
        name: "Siddharth Dev",
        handle: "@siddharth",
        role: "Distributed Systems Lead",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        orbitScore: 5120,
        matchReason: "Collaborated on state synchronization channels and benchmark telemetry",
        sharedSkills: ["Next.js", "WebRTC", "TypeScript"],
        tierRecommendation: "partner"
    },
    {
        id: "u-marcus",
        name: "Marcus Vance",
        handle: "@mvance",
        role: "Senior Engineering Director",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
        orbitScore: 7800,
        matchReason: "Active mentor in decentralized architecture and open-source governance",
        sharedSkills: ["Distributed Systems", "Architecture", "Engineering Strategy"],
        tierRecommendation: "ally"
    },
    {
        id: "u-aisha",
        name: "Aisha Patel",
        handle: "@aisha_ai",
        role: "Applied AI Researcher",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
        orbitScore: 5400,
        matchReason: "High mutual engagement in autonomous agent evaluations and benchmark datasets",
        sharedSkills: ["PyTorch", "LLM Evaluation", "Python"],
        tierRecommendation: "colleague"
    }
];

const DISCOVERY_PROJECTS = [
    {
        id: "loominn-rebuild",
        title: "Loominn Decentralized State Synchronization",
        category: "Distributed Systems",
        difficulty: "advanced" as const,
        description: "Seeking peer engineers to stress-test our live multiplayer state channels, optimistic UI updates, and cryptographic verification.",
        roles: [
            { title: "Protocol Security Auditor", minScore: 4500 },
            { title: "State Channel Engineer", minScore: 3500 },
            { title: "DX & Benchmarking Fellow", minScore: 1800 }
        ],
        members: 4,
        lead: "Rajayogi Nandina"
    },
    {
        id: "quantum-ledger",
        title: "Post-Quantum Consensus Engine & Key Exchange",
        category: "Cryptography & Security",
        difficulty: "expert" as const,
        description: "Designing lattice-based cryptography primitives for sovereign identity verification and non-repudiable peer contributions.",
        roles: [
            { title: "ZK Proof Verification Engineer", minScore: 5500 },
            { title: "Rust Protocol Optimizer", minScore: 4000 }
        ],
        members: 3,
        lead: "Elena Rostova"
    },
    {
        id: "agentic-canvas",
        title: "Autonomous Collaborative Canvas Protocol",
        category: "AI & Human Interface",
        difficulty: "intermediate" as const,
        description: "Interactive visual workspace supporting bi-directional human-AI pair design and generative prototyping.",
        roles: [
            { title: "Frontend Spatial Engineer", minScore: 2400 },
            { title: "Agentic Loop Designer", minScore: 3000 }
        ],
        members: 2,
        lead: "Pratyusha Sharma"
    }
];

const TOPICS = [
    { id: "dist-sys", name: "Distributed Systems", count: "142 Projects", perspectives: "320 Perspectives", following: false },
    { id: "zk-crypto", name: "Zero Knowledge & Cryptography", count: "89 Projects", perspectives: "194 Perspectives", following: true },
    { id: "ai-agents", name: "Agentic Systems & LLMs", count: "215 Projects", perspectives: "512 Perspectives", following: false },
    { id: "ui-craft", name: "Design Systems & UI Craft", count: "178 Projects", perspectives: "430 Perspectives", following: true },
    { id: "rust-wasm", name: "Rust & High-Perf WebAssembly", count: "96 Projects", perspectives: "185 Perspectives", following: false },
    { id: "peer-gov", name: "Decentralized Protocols & Governance", count: "64 Projects", perspectives: "128 Perspectives", following: false }
];

function DiscoverContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab") as DiscoverTab;

    const [activeTab, setActiveTab] = useState<DiscoverTab>(tabParam || "foryou");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPerspective, setSelectedPerspective] = useState<Perspective | null>(null);
    const [commitProject, setCommitProject] = useState<any | null>(null);
    const [followingTopics, setFollowingTopics] = useState<Record<string, boolean>>({
        "zk-crypto": true,
        "ui-craft": true
    });

    const { 
        networkConnections, 
        sendConnectionRequest, 
        updateConnectionStatus, 
        perspectives 
    } = useGlobalState();

    useEffect(() => {
        if (tabParam && ["foryou", "people", "projects", "perspectives", "topics"].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (tab: DiscoverTab) => {
        setActiveTab(tab);
        router.push(`/discover?tab=${tab}`, { scroll: false });
    };

    const toggleTopic = (id: string) => {
        setFollowingTopics(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Helper to get connection status for a peer
    const getConnection = (peerId: string) => {
        return networkConnections.find(c => c.userId === peerId);
    };

    const filteredPeers = useMemo(() => {
        if (!searchQuery.trim()) return PEERS;
        const q = searchQuery.toLowerCase();
        return PEERS.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.role.toLowerCase().includes(q) ||
            p.sharedSkills.some(s => s.toLowerCase().includes(q))
        );
    }, [searchQuery]);

    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return DISCOVERY_PROJECTS;
        const q = searchQuery.toLowerCase();
        return DISCOVERY_PROJECTS.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    const filteredPerspectives = useMemo(() => {
        if (!searchQuery.trim()) return perspectives;
        const q = searchQuery.toLowerCase();
        return perspectives.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.userName.toLowerCase().includes(q)
        );
    }, [perspectives, searchQuery]);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4 sm:px-6">
            {/* Page Header */}
            <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
                        Orbit Intelligence
                    </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Discovery Hub
                </h1>
                <p className="text-sm text-zinc-400 max-w-xl">
                    Explore transparently recommended peers, collaborative project roles, deep-work perspectives, and specialized craft domains.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by skill, domain, perspective title, or name..."
                    className="w-full pl-11 pr-4 py-3 bg-zinc-900/80 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all backdrop-blur-sm"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 custom-scrollbar text-xs">
                <button
                    onClick={() => handleTabChange("foryou")}
                    className={`pb-3 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === "foryou"
                            ? "text-white border-purple-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <Sparkles size={14} className={activeTab === "foryou" ? "text-purple-400" : ""} />
                    <span>For You</span>
                </button>

                <button
                    onClick={() => handleTabChange("people")}
                    className={`pb-3 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === "people"
                            ? "text-white border-blue-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <Users size={14} className={activeTab === "people" ? "text-blue-400" : ""} />
                    <span>People ({PEERS.length})</span>
                </button>

                <button
                    onClick={() => handleTabChange("projects")}
                    className={`pb-3 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === "projects"
                            ? "text-white border-cyan-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <Briefcase size={14} className={activeTab === "projects" ? "text-cyan-400" : ""} />
                    <span>Projects ({DISCOVERY_PROJECTS.length})</span>
                </button>

                <button
                    onClick={() => handleTabChange("perspectives")}
                    className={`pb-3 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === "perspectives"
                            ? "text-white border-pink-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <Layers size={14} className={activeTab === "perspectives" ? "text-pink-400" : ""} />
                    <span>Perspectives ({perspectives.length})</span>
                </button>

                <button
                    onClick={() => handleTabChange("topics")}
                    className={`pb-3 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === "topics"
                            ? "text-white border-amber-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <Hash size={14} className={activeTab === "topics" ? "text-amber-400" : ""} />
                    <span>Topics ({TOPICS.length})</span>
                </button>
            </div>

            {/* TAB 1: FOR YOU */}
            {activeTab === "foryou" && (
                <div className="space-y-8">
                    {/* Top Orbit Recommendations */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span>High Affinity Orbit Peers</span>
                                </h3>
                                <p className="text-xs text-zinc-400">Matched via verified contribution overlap & shared skills</p>
                            </div>
                            <button
                                onClick={() => handleTabChange("people")}
                                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                            >
                                View All <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {PEERS.slice(0, 2).map(peer => {
                                const conn = getConnection(peer.id);
                                return (
                                    <div key={peer.id} className="bg-zinc-900/60 border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 space-y-4 transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={peer.avatar} alt={peer.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{peer.name}</h4>
                                                    <p className="text-xs text-zinc-400">{peer.role}</p>
                                                    <span className="text-[10px] font-mono text-purple-300">
                                                        {peer.orbitScore.toLocaleString()} Orbit Score
                                                    </span>
                                                </div>
                                            </div>

                                            <span className="text-[10px] px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/30 uppercase font-mono">
                                                Suggest: {peer.tierRecommendation}
                                            </span>
                                        </div>

                                        <p className="text-xs text-zinc-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                                            💡 {peer.matchReason}
                                        </p>

                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex gap-1">
                                                {peer.sharedSkills.slice(0, 2).map((s, idx) => (
                                                    <span key={idx} className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>

                                            {conn?.status === "connected" ? (
                                                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                                    <Check size={14} /> Connected
                                                </span>
                                            ) : conn?.status === "request_sent" ? (
                                                <span className="text-xs text-zinc-400 font-mono">Request Sent</span>
                                            ) : (
                                                <button
                                                    onClick={() => sendConnectionRequest(peer.id, peer.tierRecommendation)}
                                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
                                                >
                                                    <UserPlus size={13} />
                                                    <span>Connect</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Featured Open Collaboration */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Briefcase size={16} className="text-blue-400" />
                                    <span>Recommended Open Collaborations</span>
                                </h3>
                                <p className="text-xs text-zinc-400">Projects with active open roles matching your profile</p>
                            </div>
                            <button
                                onClick={() => handleTabChange("projects")}
                                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                            >
                                View All <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900/80 to-purple-950/40 border border-blue-500/20 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                                    {DISCOVERY_PROJECTS[0].category}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full border bg-blue-500/10 text-blue-300 border-blue-500/30 uppercase font-mono">
                                    {DISCOVERY_PROJECTS[0].difficulty}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-white hover:text-blue-300 transition-colors">
                                    <Link href={`/projects/${DISCOVERY_PROJECTS[0].id}`}>
                                        {DISCOVERY_PROJECTS[0].title}
                                    </Link>
                                </h4>
                                <p className="text-sm text-zinc-300 mt-1">
                                    {DISCOVERY_PROJECTS[0].description}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
                                <div className="text-xs text-zinc-400">
                                    {DISCOVERY_PROJECTS[0].roles.length} Open Roles • Lead by {DISCOVERY_PROJECTS[0].lead}
                                </div>
                                <button
                                    onClick={() => setCommitProject(DISCOVERY_PROJECTS[0])}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                >
                                    <Shield size={14} />
                                    <span>Stake & Join</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Fresh Perspective Highlight */}
                    {perspectives.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <Layers size={16} className="text-pink-400" />
                                        <span>Deep Work Perspectives</span>
                                    </h3>
                                    <p className="text-xs text-zinc-400">Interactive slide decks from technical leaders</p>
                                </div>
                                <button
                                    onClick={() => handleTabChange("perspectives")}
                                    className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
                                >
                                    Explore More <ChevronRight size={14} />
                                </button>
                            </div>

                            <div 
                                onClick={() => setSelectedPerspective(perspectives[0])}
                                className="bg-zinc-900/60 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-6 cursor-pointer group transition-all"
                            >
                                <div className="flex items-center justify-between mb-3 text-xs text-zinc-400">
                                    <span>By {perspectives[0].userName} • {perspectives[0].role}</span>
                                    <span className="text-purple-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                                        <Play size={12} className="fill-purple-400" /> Launch Reel
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                    {perspectives[0].title}
                                </h4>
                                <p className="text-sm text-zinc-300 mt-2 line-clamp-2">
                                    {perspectives[0].items?.[0]?.content}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: PEOPLE (Orbit Network Discovery) */}
            {activeTab === "people" && (
                <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
                        <div className="text-xs text-blue-200">
                            <strong className="text-white">Explainable Relationship Tiers:</strong> Connect as a <span className="text-blue-300 font-semibold">Partner</span> (direct co-creator), <span className="text-purple-300 font-semibold">Colleague</span> (domain peer), or <span className="text-pink-300 font-semibold">Ally</span> (sponsor/mentor).
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPeers.map(peer => {
                            const conn = getConnection(peer.id);
                            return (
                                <div key={peer.id} className="bg-zinc-900/70 border border-white/10 hover:border-blue-500/30 rounded-2xl p-5 space-y-4 transition-all">
                                    <div className="flex items-start gap-3.5">
                                        <img src={peer.avatar} alt={peer.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-white text-sm truncate">{peer.name}</h4>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full border bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
                                                    {peer.orbitScore.toLocaleString()} Orbit
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-400">{peer.role}</p>
                                            <p className="text-[11px] text-zinc-500">{peer.handle}</p>
                                        </div>
                                    </div>

                                    {/* Match Reason */}
                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1 text-xs">
                                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block font-semibold">
                                            Orbit Match Rationale
                                        </span>
                                        <p className="text-zinc-300 text-[11px] leading-relaxed">
                                            {peer.matchReason}
                                        </p>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {peer.sharedSkills.map((s, idx) => (
                                            <span key={idx} className="text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded">
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Tier Connection Buttons */}
                                    <div className="pt-2 border-t border-white/5">
                                        {conn?.status === "connected" ? (
                                            <div className="w-full py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                                                <Check size={14} /> Connected as {conn.tier.toUpperCase()}
                                            </div>
                                        ) : conn?.status === "request_sent" ? (
                                            <div className="w-full py-2 bg-zinc-800 rounded-xl text-center text-xs font-medium text-zinc-400">
                                                Connection Request Sent ({conn.tier})
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => sendConnectionRequest(peer.id, "partner")}
                                                    className="py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors border border-blue-500/30 text-center"
                                                >
                                                    + Partner
                                                </button>
                                                <button
                                                    onClick={() => sendConnectionRequest(peer.id, "colleague")}
                                                    className="py-1.5 px-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors border border-purple-500/30 text-center"
                                                >
                                                    + Colleague
                                                </button>
                                                <button
                                                    onClick={() => sendConnectionRequest(peer.id, "ally")}
                                                    className="py-1.5 px-2 bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors border border-pink-500/30 text-center"
                                                >
                                                    + Ally
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 3: PROJECTS */}
            {activeTab === "projects" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProjects.map(proj => (
                            <div key={proj.id} className="bg-zinc-900/70 border border-white/10 hover:border-cyan-500/30 rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">{proj.category}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-500/20 uppercase font-mono">
                                            {proj.difficulty}
                                        </span>
                                    </div>

                                    <h4 className="font-bold text-white text-base hover:text-cyan-300 transition-colors">
                                        <Link href={`/projects/${proj.id}`}>{proj.title}</Link>
                                    </h4>

                                    <p className="text-xs text-zinc-300 leading-relaxed">
                                        {proj.description}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-white/5">
                                    <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                                        Available Roles:
                                    </div>
                                    <div className="space-y-1.5">
                                        {proj.roles.map((r, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/30 border border-white/5">
                                                <span className="text-zinc-200">{r.title}</span>
                                                <span className="font-mono text-cyan-400">{r.minScore}+ Score</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCommitProject(proj)}
                                        className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                    >
                                        <Shield size={14} />
                                        <span>Stake Score & Apply</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 4: PERSPECTIVES */}
            {activeTab === "perspectives" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPerspectives.map(p => (
                            <div 
                                key={p.id}
                                onClick={() => setSelectedPerspective(p)}
                                className="bg-zinc-900/70 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-5 space-y-3 cursor-pointer group transition-all"
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{p.userName}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/20">
                                            {p.status}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-zinc-500 font-mono">
                                        {p.items?.length || 1} Slides
                                    </span>
                                </div>

                                <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                                    {p.title}
                                </h4>

                                <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                                    {p.items?.[0]?.content}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
                                    <span>{p.createdAt || "Recently"}</span>
                                    <span className="text-purple-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        <Play size={12} className="fill-purple-400" /> Watch Reel
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 5: TOPICS */}
            {activeTab === "topics" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TOPICS.map(topic => {
                        const isFollowing = followingTopics[topic.id];
                        return (
                            <div key={topic.id} className="bg-zinc-900/70 border border-white/10 hover:border-amber-500/30 rounded-2xl p-5 space-y-3 transition-all flex items-start justify-between">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <Hash size={16} className="text-amber-400" />
                                        <h4 className="font-bold text-white text-sm">{topic.name}</h4>
                                    </div>
                                    <div className="text-xs text-zinc-400 flex items-center gap-3">
                                        <span>{topic.count}</span>
                                        <span>•</span>
                                        <span>{topic.perspectives}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleTopic(topic.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                        isFollowing
                                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                            : "bg-white/10 text-white hover:bg-white/20"
                                    }`}
                                >
                                    {isFollowing ? "Following" : "+ Follow"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Perspective Modal Viewer */}
            <PerspectiveModalViewer
                isOpen={!!selectedPerspective}
                onClose={() => setSelectedPerspective(null)}
                perspective={selectedPerspective}
            />

            {/* Project Role Staking Modal */}
            {commitProject && (
                <CommitModal
                    isOpen={!!commitProject}
                    onClose={() => setCommitProject(null)}
                    projectId={commitProject.id}
                    projectTitle={commitProject.title}
                    roles={commitProject.roles}
                />
            )}
        </div>
    );
}

export default function DiscoverPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading discovery engine...</div>}>
            <DiscoverContent />
        </Suspense>
    );
}
