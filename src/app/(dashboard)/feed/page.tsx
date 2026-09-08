"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, Sparkles, Compass, Layers, Briefcase, Award, Megaphone, Plus, X, RefreshCw } from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import StoriesRail from "@/components/feed/StoriesRail";
import SuggestionNet from "@/components/feed/SuggestionNet";
import PostCard from "@/components/feed/PostCard";
import PerspectiveCard from "@/components/feed/PerspectiveCard";
import ProjectOpportunityCard from "@/components/feed/ProjectOpportunityCard";
import ContributionCard from "@/components/feed/ContributionCard";
import AnnouncementCard from "@/components/feed/AnnouncementCard";
import PerspectiveModalViewer from "@/components/feed/PerspectiveModalViewer";
import { AnyFeedItem, Perspective } from "@/lib/types/schema";

type FilterTab = "all" | "perspectives" | "opportunities" | "contributions" | "discussions";

export default function FeedPage() {
    const { data: session } = useSession();
    const { userProfile, posts, perspectives, contributions } = useGlobalState();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<FilterTab>("all");
    const [selectedPerspective, setSelectedPerspective] = useState<Perspective | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate initial loading to demonstrate high-fidelity skeleton states
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    // Build polymorphic feed
    const feedItems: AnyFeedItem[] = useMemo(() => {
        const items: AnyFeedItem[] = [];

        // 1. Official Platform Announcement
        items.push({
            type: "announcement",
            id: "ann-v2",
            author: "Loominn Architecture",
            authorRole: "Core Protocol",
            time: "Today",
            likes: 184,
            commentsCount: 38,
            tags: ["Release", "Protocol"],
            title: "Loominn v2.4 Live: Orbit Discovery & Transparent Staking",
            content: "We have shipped complete proof-of-work credibility tracking, explainable Orbit matching algorithms, and bidirectional project workspace collaboration. No arbitrary gates — build credibility with verified contributions.",
            badge: "Protocol v2.4",
            linkUrl: "/history",
            linkLabel: "Explore Proof Ledger"
        });

        // 2. High-priority Project Opportunity
        items.push({
            type: "project_opportunity",
            id: "opp-1",
            author: "Rajayogi Nandina",
            authorRole: "Lead Architect",
            authorImage: "",
            time: "2 hours ago",
            likes: 45,
            commentsCount: 12,
            tags: ["Distributed Systems", "WebRTC", "Next.js"],
            projectId: "loominn-rebuild",
            title: "Loominn Decentralized State Synchronization",
            description: "Seeking peer engineers to stress-test our live multiplayer state channels, optimistic UI updates, and role-based cryptographic verification.",
            category: "Distributed Systems",
            difficulty: "advanced",
            membersCount: 4,
            roles: [
                { title: "Protocol Security Auditor", minScore: 4500, filled: false },
                { title: "State Channel Engineer", minScore: 3500, filled: false },
                { title: "DX & Benchmarking Fellow", minScore: 1800, filled: false }
            ]
        });

        // 3. User Perspectives from Global State
        perspectives.forEach((p, idx) => {
            items.push({
                type: "perspective",
                id: `feed-p-${p.id}`,
                author: p.userName,
                authorRole: p.role,
                authorImage: p.userImage,
                time: p.createdAt || "Recently",
                likes: 28 + idx * 7,
                commentsCount: 4 + idx * 2,
                tags: ["Perspective", p.status],
                perspectiveId: p.id,
                title: p.title,
                summary: p.items?.[0]?.content || "Exploring structural primitives and design trade-offs.",
                status: p.status,
                itemsCount: p.items?.length || 1,
                previewItem: p.items?.[0],
                category: "Engineering & Craft",
                perspective: p
            });
        });

        // 4. Verified Contributions from Global State
        contributions.forEach((c, idx) => {
            items.push({
                type: "contribution",
                id: `feed-c-${c.id}`,
                author: "Rajayogi Nandina",
                authorRole: "Core Architect",
                authorImage: "",
                time: c.date,
                likes: 31 + idx * 4,
                commentsCount: 6 + idx,
                tags: [c.type, "Verified"],
                projectId: c.projectId,
                projectTitle: c.projectTitle,
                contributionType: c.type,
                milestoneTitle: c.title,
                summary: `Successfully verified and committed milestone with ${c.complexity} complexity rating. Scored delta added to Orbit profile.`,
                scoreDelta: c.scoreDelta,
                verifiedBy: c.verifiedBy,
                evidenceUrl: c.evidenceUrl
            });
        });

        // 5. Open Project Opportunity: Quantum Ledger
        items.push({
            type: "project_opportunity",
            id: "opp-2",
            author: "Elena Rostova",
            authorRole: "Cryptography Researcher",
            authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
            time: "Yesterday",
            likes: 62,
            commentsCount: 19,
            tags: ["Cryptography", "Rust", "Zero Knowledge"],
            projectId: "quantum-ledger",
            title: "Post-Quantum Consensus Engine & Key Exchange",
            description: "Designing lattice-based cryptography primitives for sovereign identity verification and non-repudiable peer contributions.",
            category: "Cryptography & Security",
            difficulty: "expert",
            membersCount: 3,
            roles: [
                { title: "ZK Proof Verification Engineer", minScore: 5500, filled: false },
                { title: "Rust Protocol Optimizer", minScore: 4000, filled: false }
            ]
        });

        // 6. Global User Posts & Discussions
        posts.forEach(post => {
            items.push({
                type: "post",
                id: post.id,
                author: post.author || "Community Contributor",
                authorRole: post.authorRole || "Creator",
                authorImage: post.authorImage,
                time: post.time || "Recently",
                likes: post.likes || 0,
                commentsCount: post.comments || 0,
                tags: post.tags || ["General"],
                content: post.content,
                image: post.image
            });
        });

        return items;
    }, [perspectives, contributions, posts]);

    // Counts for tabs
    const counts = useMemo(() => {
        return {
            all: feedItems.length,
            perspectives: feedItems.filter(i => i.type === "perspective").length,
            opportunities: feedItems.filter(i => i.type === "project_opportunity").length,
            contributions: feedItems.filter(i => i.type === "contribution").length,
            discussions: feedItems.filter(i => i.type === "post" || i.type === "announcement").length,
        };
    }, [feedItems]);

    // Filtering logic based on Active Tab and Search Query
    const filteredFeed = useMemo(() => {
        return feedItems.filter(item => {
            // Tab filter
            if (activeTab === "perspectives" && item.type !== "perspective") return false;
            if (activeTab === "opportunities" && item.type !== "project_opportunity") return false;
            if (activeTab === "contributions" && item.type !== "contribution") return false;
            if (activeTab === "discussions" && item.type !== "post" && item.type !== "announcement") return false;

            // Search query filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                if (item.type === "perspective") {
                    return item.title.toLowerCase().includes(query) ||
                           item.author.toLowerCase().includes(query);
                } else if (item.type === "project_opportunity") {
                    return item.title.toLowerCase().includes(query) ||
                           item.description.toLowerCase().includes(query) ||
                           item.category.toLowerCase().includes(query);
                } else if (item.type === "contribution") {
                    return item.milestoneTitle.toLowerCase().includes(query) ||
                           item.projectTitle.toLowerCase().includes(query) ||
                           item.author.toLowerCase().includes(query);
                } else if (item.type === "announcement") {
                    return item.title.toLowerCase().includes(query) ||
                           item.content.toLowerCase().includes(query);
                } else if (item.type === "post") {
                    return item.content.toLowerCase().includes(query) ||
                           item.author.toLowerCase().includes(query);
                }
            }

            return true;
        });
    }, [feedItems, activeTab, searchQuery]);

    const handleOpenPerspectiveViewer = (perspectiveId: string) => {
        const found = perspectives.find(p => p.id === perspectiveId);
        if (found) {
            setSelectedPerspective(found);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-24 px-4 sm:px-0">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-xl py-3 z-40 border-b border-white/5 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        <span>Loominn Feed</span>
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </h1>
                    <p className="text-xs text-zinc-400">Work, Perspectives, & Verified Proof</p>
                </div>

                <div className="flex items-center gap-2">
                    <Link 
                        href="/create"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    >
                        <Plus size={14} />
                        <span>Create</span>
                    </Link>

                    <Link href="/profile" aria-label="Profile">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-0.5 flex items-center justify-center text-white font-bold text-xs overflow-hidden hover:scale-105 transition-transform border border-white/10">
                            {userProfile?.image ? (
                                <img src={userProfile.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                "RN"
                            )}
                        </div>
                    </Link>
                </div>
            </div>

            {/* Stories Rail (Perspectives Carousel) */}
            <section className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Layers size={13} /> Active Perspectives
                    </span>
                    <span className="text-[11px] text-zinc-500">24h craft updates</span>
                </div>
                <StoriesRail />
            </section>

            {/* Suggestion Net (Explainable Orbit Discovery) */}
            <SuggestionNet />

            {/* Filter Tabs & Search Bar */}
            <div className="space-y-3 pt-2">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search perspectives, projects, contributions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                            title="Clear search"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            activeTab === "all"
                                ? "bg-white text-black font-semibold shadow-md"
                                : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
                        }`}
                    >
                        <Sparkles size={13} /> All ({counts.all})
                    </button>

                    <button
                        onClick={() => setActiveTab("perspectives")}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            activeTab === "perspectives"
                                ? "bg-purple-600 text-white font-semibold shadow-[0_0_12px_rgba(147,51,234,0.4)]"
                                : "bg-zinc-900 text-zinc-400 hover:text-purple-300 border border-white/5"
                        }`}
                    >
                        <Layers size={13} /> Perspectives ({counts.perspectives})
                    </button>

                    <button
                        onClick={() => setActiveTab("opportunities")}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            activeTab === "opportunities"
                                ? "bg-blue-600 text-white font-semibold shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                                : "bg-zinc-900 text-zinc-400 hover:text-blue-300 border border-white/5"
                        }`}
                    >
                        <Briefcase size={13} /> Opportunities ({counts.opportunities})
                    </button>

                    <button
                        onClick={() => setActiveTab("contributions")}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            activeTab === "contributions"
                                ? "bg-emerald-600 text-white font-semibold shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                                : "bg-zinc-900 text-zinc-400 hover:text-emerald-300 border border-white/5"
                        }`}
                    >
                        <Award size={13} /> Proof of Work ({counts.contributions})
                    </button>

                    <button
                        onClick={() => setActiveTab("discussions")}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            activeTab === "discussions"
                                ? "bg-pink-600 text-white font-semibold shadow-[0_0_12px_rgba(236,72,153,0.4)]"
                                : "bg-zinc-900 text-zinc-400 hover:text-pink-300 border border-white/5"
                        }`}
                    >
                        <Megaphone size={13} /> Discussions ({counts.discussions})
                    </button>
                </div>
            </div>

            {/* Polymorphic Feed Stream */}
            <div className="space-y-5">
                {isLoading ? (
                    // High fidelity Skeleton Loading State
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 space-y-4 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-3.5 bg-zinc-800 rounded w-1/3" />
                                        <div className="h-2.5 bg-zinc-850 rounded w-1/4" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                    <div className="h-3 bg-zinc-850 rounded w-full" />
                                    <div className="h-3 bg-zinc-850 rounded w-5/6" />
                                </div>
                                <div className="h-24 bg-zinc-950/60 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : filteredFeed.length === 0 ? (
                    searchQuery ? (
                        // No Search Results State
                        <div className="text-center py-16 px-4 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-zinc-400">
                                <Search size={22} />
                            </div>
                            <h3 className="text-white font-bold text-sm">No matches for &ldquo;{searchQuery}&rdquo;</h3>
                            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                                We couldn&apos;t find any perspectives, project roles, or verified proof matching your search query.
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
                            >
                                Clear Search Query
                            </button>
                        </div>
                    ) : (
                        // Empty Content State per category
                        <div className="text-center py-16 px-4 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-zinc-400">
                                <Compass size={24} />
                            </div>
                            <h3 className="text-white font-bold text-sm">
                                {activeTab === "perspectives" && "No Perspectives Shared Yet"}
                                {activeTab === "opportunities" && "No Open Project Opportunities"}
                                {activeTab === "contributions" && "No Proof of Work Logged Yet"}
                                {activeTab === "discussions" && "No Active Discussions"}
                                {activeTab === "all" && "Feed Stream is Quiet"}
                            </h3>
                            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                                {activeTab === "perspectives" && "Be the first to share an experiment, learning, or technical slide reel."}
                                {activeTab === "opportunities" && "Launch a collaborative workspace and open roles for peer engineers."}
                                {activeTab === "contributions" && "Verify completed milestone tasks to populate the proof of work ledger."}
                                {activeTab === "discussions" && "Start a technical discussion or question to engage the network."}
                                {activeTab === "all" && "Start interacting or switch to the Discover hub to find active peers."}
                            </p>

                            <div className="pt-2 flex justify-center gap-2">
                                {activeTab !== "all" && (
                                    <button
                                        onClick={() => setActiveTab("all")}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors"
                                    >
                                        View All Content
                                    </button>
                                )}
                                <Link
                                    href="/create"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
                                >
                                    + Create New
                                </Link>
                            </div>
                        </div>
                    )
                ) : (
                    filteredFeed.map(item => {
                        switch (item.type) {
                            case "perspective": {
                                const perspectiveObj: Perspective = item.perspective || {
                                    id: item.perspectiveId,
                                    userId: "u-current",
                                    userName: item.author,
                                    role: item.authorRole || "Creator",
                                    userImage: item.authorImage || "",
                                    title: item.title,
                                    status: item.status,
                                    items: item.previewItem ? [item.previewItem] : [],
                                    createdAt: item.time
                                };
                                return (
                                    <PerspectiveCard
                                        key={item.id}
                                        perspective={perspectiveObj}
                                        onOpenViewer={handleOpenPerspectiveViewer}
                                    />
                                );
                            }

                            case "project_opportunity":
                                return (
                                    <ProjectOpportunityCard
                                        key={item.id}
                                        opportunity={item}
                                    />
                                );

                            case "contribution":
                                return (
                                    <ContributionCard
                                        key={item.id}
                                        contribution={item}
                                    />
                                );

                            case "announcement":
                                return (
                                    <AnnouncementCard
                                        key={item.id}
                                        announcement={item}
                                    />
                                );

                            case "post":
                                return (
                                    <PostCard
                                        key={item.id}
                                        id={item.id}
                                        content={item.content}
                                        author={item.author}
                                        authorImage={item.authorImage}
                                        authorRole={item.authorRole}
                                        time={item.time}
                                        likes={item.likes}
                                        commentsCount={item.commentsCount}
                                        tags={item.tags}
                                        image={item.image}
                                    />
                                );

                            default:
                                return null;
                        }
                    })
                )}
            </div>

            {/* Interactive Perspective Slide Viewer Modal */}
            <PerspectiveModalViewer
                isOpen={!!selectedPerspective}
                onClose={() => setSelectedPerspective(null)}
                perspective={selectedPerspective}
            />
        </div>
    );
}
