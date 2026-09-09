"use client";

import { useState, use, useRef, useEffect } from "react";
import { 
    Send, MessageSquare, Sparkles, ShieldCheck, Users, 
    Bot, Award, CheckCircle2, Paperclip, Smile, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import { ProjectChannelMessage } from "@/lib/types/schema";

export default function ProjectChannelPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawProjectId } = use(params);
    const projectId = decodeURIComponent(rawProjectId);

    const { 
        projectMessages, 
        sendProjectMessage, 
        projectMembers, 
        userProfile 
    } = useGlobalState();

    const [inputMessage, setInputMessage] = useState("");
    const [messageType, setMessageType] = useState<"message" | "milestone_announcement">("message");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const projectTitle = projectId
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const messages = projectMessages[projectId] || projectMessages["loominn-rebuild"] || [];
    const members = projectMembers[projectId] || projectMembers["loominn-rebuild"] || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.length]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        sendProjectMessage(projectId, inputMessage.trim(), messageType);
        setInputMessage("");
        setMessageType("message");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px]">
            {/* Main Chat Stream (3 Columns) */}
            <div className="lg:col-span-3 flex flex-col bg-zinc-900/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                {/* Channel Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                            #
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                <span>{projectTitle} Sync Channel</span>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                                    Encrypted Feed
                                </span>
                            </h2>
                            <p className="text-xs text-zinc-400">
                                Team synchronization, milestone audit notifications, and technical discussions.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={`/projects/${projectId}/board`}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                        <span>Sprint Board</span>
                        <ArrowRight size={13} />
                    </Link>
                </div>

                {/* Messages List Container */}
                <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 space-y-2">
                            <MessageSquare size={32} className="text-zinc-600" />
                            <h4 className="text-white text-sm font-semibold">Welcome to #{projectId}</h4>
                            <p className="text-xs text-zinc-400 max-w-sm">
                                This channel logs all verified milestones, role additions, and collaborator discussions. Say hello to get started!
                            </p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isCurrentUser = msg.authorHandle === (userProfile?.handle || "@rajayogi") || msg.authorName === userProfile?.name;
                            const isMilestone = msg.type === "milestone_announcement";

                            if (isMilestone) {
                                return (
                                    <div 
                                        key={msg.id}
                                        className="my-3 p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-purple-950/30 border border-emerald-500/30 shadow-lg space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                                    <Award size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-white font-mono">
                                                    MILESTONE DELIVERED
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-zinc-500 font-mono">{msg.timestamp}</span>
                                        </div>

                                        <p className="text-xs text-zinc-200 pl-8 leading-relaxed font-sans">
                                            {msg.content}
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <div 
                                    key={msg.id} 
                                    className={`flex items-start gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-zinc-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {msg.authorAvatar ? (
                                            <img src={msg.authorAvatar} alt={msg.authorName} className="w-full h-full object-cover" />
                                        ) : (
                                            msg.authorName.charAt(0)
                                        )}
                                    </div>

                                    <div className={`space-y-1 max-w-lg ${isCurrentUser ? "items-end text-right" : ""}`}>
                                        <div className={`flex items-center gap-2 text-xs ${isCurrentUser ? "justify-end" : ""}`}>
                                            <span className="font-semibold text-white">{msg.authorName}</span>
                                            <span className="text-[11px] text-zinc-500 font-mono">{msg.authorHandle}</span>
                                            <span className="text-[10px] text-zinc-500">• {msg.timestamp}</span>
                                        </div>

                                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                            isCurrentUser
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-zinc-800/80 text-zinc-200 border border-white/5 rounded-tl-none"
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input Bar */}
                <div className="p-4 border-t border-white/5 bg-black/30">
                    <form onSubmit={handleSendMessage} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder={`Message #${projectId} or discuss technical RFCs...`}
                                className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim()}
                                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                                    inputMessage.trim()
                                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30 cursor-pointer"
                                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                }`}
                            >
                                <span>Send</span>
                                <Send size={13} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                            <div className="flex items-center gap-2">
                                <span>Posting as: <strong className="text-zinc-300">{userProfile?.name || "Rajayogi Nandina"}</strong></span>
                            </div>
                            <span className="font-mono">Press Enter to send</span>
                        </div>
                    </form>
                </div>
            </div>

            {/* Sidebar: Active Collaborators Presence (1 Column) */}
            <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-sm space-y-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Users size={14} className="text-blue-400" />
                            <span>Team Presence</span>
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                            {members.length} Online
                        </span>
                    </div>

                    <div className="space-y-3">
                        {members.map(m => (
                            <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-zinc-800 flex items-center justify-center text-white text-xs font-bold">
                                    {m.avatar ? (
                                        <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                                    ) : (
                                        m.name.charAt(0)
                                    )}
                                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-zinc-900" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-semibold text-white truncate">{m.name}</h4>
                                    <p className="text-[10px] text-zinc-400 truncate">{m.role}</p>
                                </div>
                                <span className="text-[10px] font-mono text-purple-400">
                                    {m.orbitScore}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Proof Ledger Shortcut */}
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <ShieldCheck size={14} />
                        <span>Verifiable Activity</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Milestone completions and verified code reviews automatically broadcast proof to this channel.
                    </p>
                    <Link
                        href="/history"
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold block pt-1"
                    >
                        View Proof Ledger →
                    </Link>
                </div>
            </div>
        </div>
    );
}
