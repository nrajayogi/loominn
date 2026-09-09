"use client";

import { useState } from "react";
import { Hash, Video, Image as ImageIcon, MessageSquare, Plus, Mic, Monitor, UserPlus, Settings, MoreVertical, Send, Smile, Paperclip, X, MicOff, VideoOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";

interface ChannelMessage {
    id: number | string;
    channelId: string;
    user: string;
    avatar: string;
    content: string;
    time: string;
    isMe?: boolean;
    type?: "message" | "system";
}

export default function ChannelsPage() {
    const { userProfile } = useGlobalState();
    const [selectedChannel, setSelectedChannel] = useState("general");
    const [activeTab, setActiveTab] = useState<"chat" | "meeting" | "board">("chat");
    const [inputMessage, setInputMessage] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [showAddChannel, setShowAddChannel] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [boardNotes, setBoardNotes] = useState<string[]>([
        "Secure peer handshake before v2 launch.",
        "Ensure Orbit score formula transparency is visible on profile."
    ]);
    const [newNote, setNewNote] = useState("");

    const [channels, setChannels] = useState([
        { id: "general", name: "General", type: "text" },
        { id: "quantum-dev", name: "Quantum Dev", type: "text", locked: true },
        { id: "design-sync", name: "Design Sync", type: "voice" },
        { id: "orbit-mesh", name: "Orbit Mesh", type: "text" }
    ]);

    const [messages, setMessages] = useState<ChannelMessage[]>([
        { id: 1, channelId: "general", user: "Elena R.", avatar: "ER", content: "Has anyone reviewed the latest PR for the quantum bridge?", time: "10:30 AM" },
        { id: 2, channelId: "general", user: userProfile.name || "Rajayogi", avatar: "RN", content: "Looking at it right now. The cryptographic audit trail looks solid.", time: "10:32 AM", isMe: true },
        { id: 3, channelId: "general", user: "System", avatar: "SYS", type: "system", content: "Milestone Verified: Core State Sync v2.1.0 deployed to workspace", time: "10:35 AM" },
        { id: 4, channelId: "quantum-dev", user: "Dev Singh", avatar: "DS", content: "Benchmarking the CRDT tree sync against high concurrency.", time: "09:15 AM" },
        { id: 5, channelId: "orbit-mesh", user: "Maya Patel", avatar: "MP", content: "Orbit Score peer verification contracts are active on testnet.", time: "Yesterday" }
    ]);

    const activeMessages = messages.filter(m => m.channelId === selectedChannel || m.channelId === "general");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMsg: ChannelMessage = {
            id: Date.now(),
            channelId: selectedChannel,
            user: userProfile.name || "Rajayogi Nandina",
            avatar: (userProfile.name?.charAt(0) || "R") + (userProfile.name?.split(" ")[1]?.charAt(0) || "N"),
            content: inputMessage.trim(),
            time: "Just now",
            isMe: true
        };

        setMessages(prev => [...prev, newMsg]);
        setInputMessage("");
    };

    const handleAddChannel = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim()) return;
        const slug = newChannelName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        setChannels(prev => [...prev, { id: slug, name: newChannelName.trim(), type: "text" }]);
        setSelectedChannel(slug);
        setNewChannelName("");
        setShowAddChannel(false);
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        setBoardNotes(prev => [...prev, newNote.trim()]);
        setNewNote("");
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6 max-w-7xl mx-auto px-4 pb-12">

            {/* Sidebar List */}
            <div className="w-64 flex flex-col gap-6 pt-2 h-full flex-shrink-0">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">Channels</h2>
                    <button
                        onClick={() => setShowAddChannel(true)}
                        className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white"
                        title="Add Channel"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <div className="space-y-1">
                    {channels.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                                selectedChannel === channel.id
                                    ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            {channel.type === "voice" ? <Mic size={16} /> : <Hash size={16} />}
                            <span className="truncate">{channel.name}</span>
                        </button>
                    ))}
                </div>

                {/* Direct Messages */}
                <div className="mt-4 pt-4 border-t border-white/5">
                    <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-2 mb-2">Direct Messages</h3>
                    <div className="space-y-1">
                        {[
                            { name: "Elena Rostova", initial: "ER", online: true },
                            { name: "Liam Kovacs", initial: "LK", online: false },
                            { name: "Maya Patel", initial: "MP", online: true }
                        ].map(dm => (
                            <Link
                                key={dm.name}
                                href={`/messages?user=${encodeURIComponent(dm.name)}`}
                                className="flex items-center justify-between px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer text-xs group transition-colors"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className={`w-2 h-2 rounded-full ${dm.online ? "bg-green-500" : "bg-zinc-700"}`} />
                                    <span>{dm.name}</span>
                                </div>
                                <span className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-400 transition-opacity">Open Chat →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden backdrop-blur-sm shadow-xl">

                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Hash className="text-blue-400" size={20} />
                        <div>
                            <h3 className="text-white font-bold text-base">#{selectedChannel}</h3>
                            <span className="text-[11px] text-zinc-400">Workspace sync channel for architecture & build coordination</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setActiveTab("chat")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                activeTab === 'chat' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <MessageSquare size={14} /> Chat
                        </button>
                        <button
                            onClick={() => setActiveTab("meeting")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                activeTab === 'meeting' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <Video size={14} /> Sync Room
                        </button>
                        <button
                            onClick={() => setActiveTab("board")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                activeTab === 'board' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <ImageIcon size={14} /> Whiteboard
                        </button>
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <AnimatePresence mode="wait">

                        {/* CHAT VIEW */}
                        {activeTab === "chat" && (
                            <motion.div
                                key="chat"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col"
                            >
                                <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                                    {activeMessages.map((msg) => (
                                        msg.type === 'system' ? (
                                            <div key={msg.id} className="flex items-center gap-4 opacity-70 justify-center text-xs py-2">
                                                <div className="h-px bg-white/10 w-24" />
                                                <span className="text-zinc-400 text-center font-mono text-[11px] bg-white/5 px-3 py-1 rounded-full">{msg.content}</span>
                                                <div className="h-px bg-white/10 w-24" />
                                            </div>
                                        ) : (
                                            <div key={msg.id} className={`flex gap-3.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">
                                                    {msg.avatar}
                                                </div>
                                                <div className={`max-w-[70%] space-y-1 ${msg.isMe ? 'items-end flex flex-col' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-bold text-xs">{msg.user}</span>
                                                        <span className="text-[10px] text-zinc-500">{msg.time}</span>
                                                    </div>
                                                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                                                        msg.isMe
                                                            ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-600/20'
                                                            : 'bg-zinc-800/90 text-zinc-200 rounded-tl-sm border border-white/5'
                                                    }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-zinc-900/80">
                                    <div className="flex items-center gap-3 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 focus-within:border-blue-500 transition-colors">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder={`Message #${selectedChannel}...`}
                                            className="flex-1 bg-transparent border-none focus:outline-none text-white text-xs placeholder:text-zinc-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!inputMessage.trim()}
                                            className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-all shadow-md shadow-blue-600/20"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* MEETING VIEW */}
                        {activeTab === "meeting" && (
                            <motion.div
                                key="meeting"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-full max-w-3xl grid grid-cols-2 gap-4 h-full max-h-[460px]">
                                    <div className="bg-zinc-800/80 rounded-2xl flex items-center justify-center relative overflow-hidden group border border-white/5">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">ER</div>
                                        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white backdrop-blur-md">Elena Rostova</div>
                                        <div className="absolute top-4 right-4 text-emerald-400 bg-black/40 p-1.5 rounded-full"><Mic size={14} /></div>
                                    </div>
                                    <div className="bg-zinc-800/80 rounded-2xl flex items-center justify-center relative overflow-hidden group border-2 border-blue-500/50">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                                            {userProfile.name?.charAt(0) || "U"}
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white backdrop-blur-md">
                                            You ({userProfile.name || "Rajayogi"})
                                        </div>
                                        <div className="absolute top-4 right-4 text-emerald-400 bg-black/40 p-1.5 rounded-full">
                                            {isMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} />}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className={`p-3.5 rounded-full transition-colors shadow-lg ${isMuted ? 'bg-red-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
                                    >
                                        {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                                    </button>
                                    <button
                                        onClick={() => setIsVideoOff(!isVideoOff)}
                                        className={`p-3.5 rounded-full transition-colors shadow-lg ${isVideoOff ? 'bg-red-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
                                    >
                                        {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("chat")}
                                        className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg transition-colors"
                                    >
                                        Leave Room
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* BOARD VIEW */}
                        {activeTab === "board" && (
                            <motion.div
                                key="board"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#0f0f12] p-6 flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Collaborative Concept Board</h4>
                                        <p className="text-xs text-zinc-400">Add sticky notes and architecture memos for the #{selectedChannel} squad</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="New note idea..."
                                            className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 w-56"
                                        />
                                        <button
                                            onClick={handleAddNote}
                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                                        >
                                            Add Note
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto">
                                    {boardNotes.map((note, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs shadow-md h-32 flex flex-col justify-between"
                                        >
                                            <p className="leading-relaxed">{note}</p>
                                            <span className="text-[10px] text-amber-400/60 font-mono">Note #{index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* Add Channel Modal */}
            {showAddChannel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <form onSubmit={handleAddChannel} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <h3 className="text-sm font-bold text-white">Create New Channel</h3>
                            <button type="button" onClick={() => setShowAddChannel(false)} className="text-zinc-400 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1.5 font-semibold">Channel Name</label>
                            <input
                                type="text"
                                required
                                value={newChannelName}
                                onChange={(e) => setNewChannelName(e.target.value)}
                                placeholder="e.g. security-audit"
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setShowAddChannel(false)}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/25"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
