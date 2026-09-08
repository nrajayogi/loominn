"use client";

import { useState } from "react";
import { Hash, Video, Image as ImageIcon, MessageSquare, Plus, Mic, Monitor, UserPlus, Settings, MoreVertical, Send, Smile, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChannelsPage() {
    const [selectedChannel, setSelectedChannel] = useState("general");
    const [activeTab, setActiveTab] = useState<"chat" | "meeting" | "board">("chat");

    const CHANNELS = [
        { id: "general", name: "General", type: "text" },
        { id: "quantum-dev", name: "Quantum Dev", type: "text", locked: true },
        { id: "design-sync", name: "Design Sync", type: "voice" },
        { id: "random", name: "Random", type: "text" }
    ];

    const MESSAGES = [
        { id: 1, user: "Elena R.", avatar: "ER", content: "Has anyone reviewed the latest PR for the quantum bridge?", time: "10:30 AM" },
        { id: 2, user: "Rajayogi", avatar: "RN", content: "Looking at it right now. The encryption scheme looks solid.", time: "10:32 AM", isMe: true },
        { id: 3, user: "System", type: "system", content: "Deployed version v2.1.0 to staging" }
    ];

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 max-w-7xl mx-auto px-4 md:px-0">

            {/* Sidebar List */}
            <div className="w-64 flex flex-col gap-6 pt-4 h-full">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">Channels</h2>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                        <Plus size={18} />
                    </button>
                </div>

                <div className="space-y-1">
                    {CHANNELS.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${selectedChannel === channel.id
                                    ? "bg-blue-600/20 text-blue-400 font-medium"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {channel.type === "voice" ? <Mic size={16} /> : <Hash size={16} />}
                            {channel.name}
                        </button>
                    ))}
                </div>

                {/* Direct Messages */}
                <div className="mt-6">
                    <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-wider px-2 mb-2">Direct Messages</h3>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:bg-white/5 rounded-xl cursor-pointer">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Elena R.</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:bg-white/5 rounded-xl cursor-pointer">
                            <div className="w-2 h-2 rounded-full bg-zinc-700" />
                            <span>Liam K.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden backdrop-blur-sm">

                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
                    <div className="flex items-center gap-3">
                        <Hash className="text-zinc-500" />
                        <h3 className="text-white font-bold text-lg">#{selectedChannel}</h3>
                        <span className="text-xs text-zinc-500">Topic: Coordinating the launch of V2</span>
                    </div>

                    <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg">
                        <button onClick={() => setActiveTab("chat")} className={`p-2 rounded-md transition-colors ${activeTab === 'chat' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}><MessageSquare size={18} /></button>
                        <button onClick={() => setActiveTab("meeting")} className={`p-2 rounded-md transition-colors ${activeTab === 'meeting' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}><Video size={18} /></button>
                        <button onClick={() => setActiveTab("board")} className={`p-2 rounded-md transition-colors ${activeTab === 'board' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}><ImageIcon size={18} /></button>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <button className="p-2 text-zinc-500 hover:text-white"><Settings size={18} /></button>
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">

                        {/* CHAT VIEW */}
                        {activeTab === "chat" && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col"
                            >
                                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                                    {MESSAGES.map((msg) => (
                                        msg.type === 'system' ? (
                                            <div key={msg.id} className="flex items-center gap-4 opacity-50 justify-center text-xs">
                                                <div className="h-px bg-white/10 w-20" />
                                                <span>{msg.content}</span>
                                                <div className="h-px bg-white/10 w-20" />
                                            </div>
                                        ) : (
                                            <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                    {msg.avatar}
                                                </div>
                                                <div className={`max-w-[70%] space-y-1 ${msg.isMe ? 'items-end flex flex-col' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-bold text-sm">{msg.user}</span>
                                                        <span className="text-[10px] text-zinc-500">{msg.time}</span>
                                                    </div>
                                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.isMe
                                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                                            : 'bg-zinc-800 text-zinc-200 rounded-tl-sm'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                                <div className="p-4 border-t border-white/5 bg-zinc-900/50">
                                    <div className="flex items-center gap-3 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2">
                                        <button className="text-zinc-500 hover:text-white"><Plus size={20} /></button>
                                        <input type="text" placeholder="Message #general..." className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-600" />
                                        <button className="text-zinc-500 hover:text-white"><Smile size={20} /></button>
                                        <button className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"><Send size={16} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* MEETING VIEW */}
                        {activeTab === "meeting" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-full max-w-3xl grid grid-cols-2 gap-4 h-full max-h-[600px]">
                                    <div className="bg-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                        <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-3xl font-bold text-white">ER</div>
                                        <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs text-white backdrop-blur-md">Elena R.</div>
                                        <div className="absolute top-4 right-4 text-green-500"><Mic size={16} /></div>
                                    </div>
                                    <div className="bg-zinc-800 rounded-2xl flex items-center justify-center relative overflow-hidden group border-2 border-blue-500">
                                        <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-3xl font-bold text-white">RN</div>
                                        <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs text-white backdrop-blur-md">You</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-8">
                                    <button className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg cursor-pointer"><Mic size={24} /></button>
                                    <button className="p-4 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white cursor-pointer"><Video size={24} /></button>
                                    <button className="p-4 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white cursor-pointer"><Monitor size={24} /></button>
                                    <button className="px-6 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold">Leave</button>
                                </div>
                            </motion.div>
                        )}

                        {/* BOARD VIEW */}
                        {activeTab === "board" && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#0f0f11]"
                            >
                                {/* Mock Whiteboard Toolbar */}
                                <div className="absolute left-4 top-4 flex flex-col gap-2 bg-zinc-800 p-2 rounded-lg border border-white/5 z-10">
                                    <button className="p-2 hover:bg-white/10 rounded flex items-center justify-center text-white"><div className="w-4 h-4 border-2 border-white rounded-sm" /></button>
                                    <button className="p-2 hover:bg-white/10 rounded flex items-center justify-center text-white"><div className="w-4 h-4 border-2 border-white rounded-full" /></button>
                                    <button className="p-2 hover:bg-white/10 rounded flex items-center justify-center text-white font-serif">T</button>
                                    <button className="p-2 hover:bg-white/10 rounded flex items-center justify-center text-white"><Paperclip size={16} /></button>
                                </div>

                                {/* Mock Content */}
                                <div className="w-full h-full flex items-center justify-center opacity-30 pointer-events-none">
                                    <div className="text-center">
                                        <ImageIcon size={64} className="mx-auto mb-4 text-zinc-600" />
                                        <h3 className="text-zinc-500 font-bold">Concept Board</h3>
                                        <p className="text-zinc-600">Infinite canvas for brainstorming</p>
                                    </div>
                                </div>

                                <div className="absolute top-20 left-40 w-48 h-32 bg-yellow-200/10 border border-yellow-200/20 rounded p-4 rotate-3">
                                    <p className="text-yellow-100 font-handwriting text-sm">Ideally we need to secure the bridge before V2 launch.</p>
                                </div>
                                <div className="absolute top-40 left-80 w-48 h-48 bg-blue-500/10 border border-blue-500/20 rounded p-4 -rotate-2">
                                    <div className="w-full h-full border-2 border-dashed border-blue-500/30 flex items-center justify-center text-blue-200 text-xs">
                                        Mockup Area
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
