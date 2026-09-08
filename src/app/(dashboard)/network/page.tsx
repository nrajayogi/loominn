"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
    Search, UserCheck, MessageSquare, MoreHorizontal, 
    Shield, Check, X, UserPlus, Filter, Sparkles, 
    ArrowUpRight, HeartHandshake, Award, VolumeX, Ban
} from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { RelationshipTier, NetworkConnection, ConnectionStatus } from "@/lib/types/schema";
import SafetyModal from "@/components/feed/SafetyModal";

type NetworkTab = "partners" | "colleagues" | "allies" | "requests";

export default function NetworkPage() {
    const { 
        networkConnections, 
        updateConnectionStatus, 
        toggleMuteUser, 
        toggleBlockUser 
    } = useGlobalState();

    const [activeTab, setActiveTab] = useState<NetworkTab>("partners");
    const [searchQuery, setSearchQuery] = useState("");
    const [safetyTarget, setSafetyTarget] = useState<{ id: string; name: string } | null>(null);

    // Counts for tabs
    const counts = useMemo(() => {
        return {
            partners: networkConnections.filter(c => c.status === "connected" && c.tier === "partner").length,
            colleagues: networkConnections.filter(c => c.status === "connected" && c.tier === "colleague").length,
            allies: networkConnections.filter(c => c.status === "connected" && c.tier === "ally").length,
            requests: networkConnections.filter(c => c.status === "request_received" || c.status === "request_sent").length
        };
    }, [networkConnections]);

    // Filter connections based on active tab and search
    const filteredConnections = useMemo(() => {
        return networkConnections.filter(conn => {
            // Tab filter
            if (activeTab === "partners") {
                if (conn.status !== "connected" || conn.tier !== "partner") return false;
            } else if (activeTab === "colleagues") {
                if (conn.status !== "connected" || conn.tier !== "colleague") return false;
            } else if (activeTab === "allies") {
                if (conn.status !== "connected" || conn.tier !== "ally") return false;
            } else if (activeTab === "requests") {
                if (conn.status !== "request_received" && conn.status !== "request_sent") return false;
            }

            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return conn.name.toLowerCase().includes(q) ||
                       conn.role.toLowerCase().includes(q) ||
                       conn.handle.toLowerCase().includes(q);
            }

            return true;
        });
    }, [networkConnections, activeTab, searchQuery]);

    const tierDescriptions: Record<Exclude<NetworkTab, "requests">, string> = {
        partners: "Co-creators and active project teammates with shared milestone delivery.",
        colleagues: "Domain peers who review code, exchange technical feedback, and align on craft.",
        allies: "Senior mentors, sponsors, and community guides who endorse proof of work."
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4 sm:px-6">
            {/* Header & Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                        <span>Professional Network</span>
                        <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-mono">
                            {counts.partners + counts.colleagues + counts.allies} Connections
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                        High-trust professional ties organized by collaboration depth — no vanity numbers.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/discover?tab=people"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    >
                        <UserPlus size={14} />
                        <span>Discover Peers</span>
                    </Link>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                    type="text"
                    placeholder="Search by name, handle, or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
            </div>

            {/* Relationship Tier Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto custom-scrollbar text-xs">
                <button
                    onClick={() => setActiveTab("partners")}
                    className={`pb-3 px-4 font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        activeTab === "partners"
                            ? "text-white border-blue-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Partners ({counts.partners})</span>
                </button>

                <button
                    onClick={() => setActiveTab("colleagues")}
                    className={`pb-3 px-4 font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        activeTab === "colleagues"
                            ? "text-white border-purple-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Colleagues ({counts.colleagues})</span>
                </button>

                <button
                    onClick={() => setActiveTab("allies")}
                    className={`pb-3 px-4 font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        activeTab === "allies"
                            ? "text-white border-pink-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                    <span>Allies ({counts.allies})</span>
                </button>

                <button
                    onClick={() => setActiveTab("requests")}
                    className={`pb-3 px-4 font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        activeTab === "requests"
                            ? "text-white border-amber-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Requests ({counts.requests})</span>
                </button>
            </div>

            {/* Active Tier Definition Helper */}
            {activeTab !== "requests" && (
                <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl text-xs text-zinc-400 flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-400 shrink-0" />
                    <span>{tierDescriptions[activeTab]}</span>
                </div>
            )}

            {/* Connection Cards Grid */}
            <div className="space-y-4">
                {filteredConnections.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-zinc-400">
                            <HeartHandshake size={24} />
                        </div>
                        <h3 className="text-white font-bold text-sm">
                            {activeTab === "requests" ? "No Pending Requests" : `No ${activeTab} Found`}
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                            {activeTab === "requests"
                                ? "All your connection invitations and received requests have been processed."
                                : `You haven't established any ${activeTab} connections yet. Discover peers through Orbit matching.`}
                        </p>
                        <Link
                            href="/discover?tab=people"
                            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all"
                        >
                            Explore Orbit Network
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredConnections.map(conn => (
                            <div 
                                key={conn.id}
                                className="bg-zinc-900/70 border border-white/5 hover:border-white/10 rounded-2xl p-5 space-y-4 transition-all"
                            >
                                {/* Member Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                                            <img src={conn.avatar} alt={conn.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-white text-sm">{conn.name}</h4>
                                                <span className="text-[10px] font-mono text-zinc-400">
                                                    {conn.orbitScore}+ Orbit
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-400">{conn.role}</p>
                                            <p className="text-[11px] text-zinc-500">{conn.handle}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSafetyTarget({ id: conn.userId, name: conn.name })}
                                        className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                                        title="Moderation & Safety"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>

                                {/* Context info */}
                                {conn.matchReason && (
                                    <p className="text-xs text-zinc-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                                        💡 {conn.matchReason}
                                    </p>
                                )}

                                {/* Card Actions */}
                                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                                    {conn.status === "connected" ? (
                                        <>
                                            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span>Tier: <strong>{conn.tier.toUpperCase()}</strong></span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {/* Tier Switch Dropdown / Quick toggles */}
                                                <select
                                                    value={conn.tier}
                                                    onChange={(e) => updateConnectionStatus(conn.id, "connected", e.target.value as RelationshipTier)}
                                                    className="bg-black/60 border border-white/10 text-[11px] text-zinc-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                                                >
                                                    <option value="partner">Partner</option>
                                                    <option value="colleague">Colleague</option>
                                                    <option value="ally">Ally</option>
                                                </select>

                                                <Link
                                                    href={`/messages?user=${conn.userId}`}
                                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                                                >
                                                    <MessageSquare size={13} />
                                                    <span>Chat</span>
                                                </Link>
                                            </div>
                                        </>
                                    ) : conn.status === "request_received" ? (
                                        <div className="w-full flex items-center justify-between gap-2">
                                            <span className="text-xs text-amber-400 font-mono">Incoming Request</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateConnectionStatus(conn.id, "connected", conn.tier)}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                                                >
                                                    <Check size={13} />
                                                    <span>Accept</span>
                                                </button>
                                                <button
                                                    onClick={() => updateConnectionStatus(conn.id, "declined")}
                                                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                                                >
                                                    <X size={13} />
                                                    <span>Decline</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full flex items-center justify-between">
                                            <span className="text-xs text-zinc-400 font-mono">
                                                Request sent as {conn.tier}
                                            </span>
                                            <button
                                                onClick={() => updateConnectionStatus(conn.id, "declined")}
                                                className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Moderation Safety Modal */}
            {safetyTarget && (
                <SafetyModal
                    isOpen={!!safetyTarget}
                    onClose={() => setSafetyTarget(null)}
                    targetType="user"
                    targetId={safetyTarget.id}
                    targetName={safetyTarget.name}
                />
            )}
        </div>
    );
}
