"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    Search, Send, Sparkles, Paperclip, MoreVertical, 
    ArrowLeft, Shield, CheckCheck, Compass, MessageSquare 
} from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { NetworkConnection, RelationshipTier } from "@/lib/types/schema";

interface ChatMessage {
    id: string;
    senderId: string; // "user-current" or peer.userId
    text: string;
    timestamp: string;
}

const INITIAL_CONVERSATIONS: Record<string, ChatMessage[]> = {
    "u-pratyusha": [
        {
            id: "m-1",
            senderId: "u-pratyusha",
            text: "Hey Alex! Loved the design tokens you shared on the state sync channel. The motion timing feels crisp.",
            timestamp: "10:24 AM"
        },
        {
            id: "m-2",
            senderId: "user-current",
            text: "Thanks Pratyusha! We just wired the WebSocket optimistic update to match those exact curves. Check out the new preview.",
            timestamp: "10:30 AM"
        },
        {
            id: "m-3",
            senderId: "u-pratyusha",
            text: "Reviewing now! Are we ready to merge the mobile deck layout for this release?",
            timestamp: "10:32 AM"
        }
    ],
    "u-siddharth": [
        {
            id: "m-4",
            senderId: "u-siddharth",
            text: "Benchmarking the state synchronization pipeline right now. Zero message drops across 100 concurrent peers!",
            timestamp: "Yesterday"
        },
        {
            id: "m-5",
            senderId: "user-current",
            text: "Huge milestone! That unlocks the multi-user workspace board smoothly.",
            timestamp: "Yesterday"
        }
    ],
    "u-elena": [
        {
            id: "m-6",
            senderId: "u-elena",
            text: "Shared the lattice cryptography paper in the discovery feed. Would love your feedback on the verification speed.",
            timestamp: "Sep 7"
        }
    ]
};

function MessagesContent() {
    const searchParams = useSearchParams();
    const targetUserId = searchParams.get("user");

    const { networkConnections, userProfile } = useGlobalState();
    const connectedPeers = networkConnections.filter(c => c.status === "connected");

    const [selectedUserId, setSelectedUserId] = useState<string>(
        targetUserId || (connectedPeers.length > 0 ? connectedPeers[0].userId : "")
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(INITIAL_CONVERSATIONS);
    const [inputText, setInputText] = useState("");
    const [mobileShowChat, setMobileShowChat] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (targetUserId) {
            setSelectedUserId(targetUserId);
            setMobileShowChat(true);
        }
    }, [targetUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [selectedUserId, chatHistory]);

    const activePeer = networkConnections.find(c => c.userId === selectedUserId) || connectedPeers[0];

    const handleSendMessage = () => {
        if (!inputText.trim() || !activePeer) return;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: "user-current",
            text: inputText.trim(),
            timestamp: now
        };

        setChatHistory(prev => ({
            ...prev,
            [activePeer.userId]: [...(prev[activePeer.userId] || []), newMsg]
        }));
        setInputText("");

        // Realistic peer reply after brief pause
        setTimeout(() => {
            const replies = [
                "Got it! Looking into that right away.",
                "Agreed, let's test it on the next release cycle.",
                "Awesome progress on this milestone! Staking score verified.",
                "Let's sync during the workspace channel session."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const peerMsg: ChatMessage = {
                id: `msg-reply-${Date.now()}`,
                senderId: activePeer.userId,
                text: randomReply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory(prev => ({
                ...prev,
                [activePeer.userId]: [...(prev[activePeer.userId] || []), peerMsg]
            }));
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const filteredPeers = connectedPeers.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tierBadges: Record<RelationshipTier, { bg: string; text: string }> = {
        partner: { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-400" },
        colleague: { bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-400" },
        ally: { bg: "bg-pink-500/10 border-pink-500/30", text: "text-pink-400" }
    };

    const currentMessages = activePeer ? (chatHistory[activePeer.userId] || []) : [];

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] min-h-[580px] bg-zinc-950/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col md:flex-row">
            {/* LEFT PANE: Conversation List */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-zinc-900/40 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
                {/* Search & Header */}
                <div className="p-4 border-b border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span>Direct Messages</span>
                            <span className="text-[11px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-mono border border-blue-500/20">
                                {connectedPeers.length} Active
                            </span>
                        </h2>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Conversation Items List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.03]">
                    {filteredPeers.length === 0 ? (
                        <div className="p-8 text-center text-xs text-zinc-500 space-y-2">
                            <p>No connected peers found.</p>
                            <Link href="/discover?tab=people" className="text-blue-400 hover:underline">
                                Connect with peers first →
                            </Link>
                        </div>
                    ) : (
                        filteredPeers.map(peer => {
                            const isSelected = activePeer?.userId === peer.userId;
                            const messages = chatHistory[peer.userId] || [];
                            const lastMsg = messages[messages.length - 1];
                            const badge = tierBadges[peer.tier] || tierBadges.colleague;

                            return (
                                <button
                                    key={peer.id}
                                    onClick={() => {
                                        setSelectedUserId(peer.userId);
                                        setMobileShowChat(true);
                                    }}
                                    className={`w-full p-4 flex items-start gap-3 text-left transition-all hover:bg-white/[0.03] ${
                                        isSelected ? "bg-white/[0.06] border-l-2 border-blue-500" : ""
                                    }`}
                                >
                                    <div className="relative">
                                        <img src={peer.avatar} alt={peer.name} className="w-11 h-11 rounded-full object-cover border border-white/10" />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className="text-xs font-bold text-white truncate">{peer.name}</h4>
                                            <span className="text-[10px] text-zinc-500">{lastMsg?.timestamp || "Recently"}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full border uppercase font-mono ${badge.bg} ${badge.text}`}>
                                                {peer.tier}
                                            </span>
                                            <span className="text-[10px] text-zinc-400 truncate">{peer.role}</span>
                                        </div>

                                        <p className="text-xs text-zinc-400 truncate">
                                            {lastMsg?.text || "Started conversation."}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* RIGHT PANE: Active Chat */}
            <div className={`flex-1 flex flex-col bg-zinc-950/60 ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
                {activePeer ? (
                    <>
                        {/* Chat Top Header */}
                        <div className="p-4 px-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setMobileShowChat(false)}
                                    className="md:hidden p-1 text-zinc-400 hover:text-white"
                                >
                                    <ArrowLeft size={18} />
                                </button>

                                <Link href={`/profile/${activePeer.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                        <img src={activePeer.avatar} alt={activePeer.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                                                {activePeer.name}
                                            </h3>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full border uppercase font-mono ${tierBadges[activePeer.tier]?.bg} ${tierBadges[activePeer.tier]?.text}`}>
                                                {activePeer.tier}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                                            <span>{activePeer.role}</span>
                                            <span>•</span>
                                            <span className="text-blue-400 font-mono">{activePeer.orbitScore}+ Orbit</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/profile/${activePeer.name.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="text-xs text-zinc-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
                                >
                                    View Proof Profile
                                </Link>
                            </div>
                        </div>

                        {/* Message Stream */}
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                            {/* Encryption handshake notice */}
                            <div className="text-center py-2">
                                <span className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500 bg-white/[0.02] border border-white/5 px-3 py-1 rounded-full font-mono">
                                    <Shield size={11} className="text-blue-400" />
                                    <span>Peer verified direct channel • End-to-end encrypted</span>
                                </span>
                            </div>

                            {currentMessages.map(msg => {
                                const isSelf = msg.senderId === "user-current";
                                return (
                                    <div 
                                        key={msg.id}
                                        className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                                    >
                                        <div className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                                            isSelf
                                                ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-blue-950/30"
                                                : "bg-zinc-900 border border-white/10 text-zinc-200 rounded-bl-none"
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-zinc-500 mt-1 px-1">
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Composer */}
                        <div className="p-4 border-t border-white/5 bg-zinc-950/80">
                            <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-2xl p-2 px-3 focus-within:border-blue-500/50 transition-all">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Message ${activePeer.name}...`}
                                    className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                                />

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputText.trim()}
                                    className={`p-2 rounded-xl text-white transition-all ${
                                        inputText.trim()
                                            ? "bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30"
                                            : "bg-white/5 text-zinc-600 cursor-not-allowed"
                                    }`}
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-white font-bold text-sm">Select a Conversation</h3>
                        <p className="text-xs text-zinc-400 max-w-xs">
                            Choose a connected peer from your network on the left to review collaborative tasks and coordinate on milestones.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading messenger...</div>}>
            <MessagesContent />
        </Suspense>
    );
}
