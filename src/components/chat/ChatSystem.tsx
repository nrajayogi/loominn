"use client";

import { useState } from "react";
import { MessageCircle, X, Hash, User, Send, ChevronRight, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

type ChatTab = "projects" | "messages";

import { usePathname } from "next/navigation";

export default function ChatSystem() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ChatTab>("messages");
    const [activeConversation, setActiveConversation] = useState<number | null>(null);

    // Don't show on presentation pages
    if (pathname?.startsWith("/presentation")) return null;

    if (!session) return null;

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                aria-label="Open Chat"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center z-50 hover:bg-blue-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <MessageCircle size={28} />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold border-2 border-background">3</span>
            </motion.button>

            {/* Chat Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-background border-l border-white/10 shadow-2xl z-[70] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl">
                                <h2 className="text-xl font-bold text-white">Communications</h2>
                                <button onClick={() => setIsOpen(false)} aria-label="Close Chat" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} className="text-zinc-400" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-white/10">
                                <button
                                    onClick={() => { setActiveTab("messages"); setActiveConversation(null); }}
                                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "messages" ? "text-blue-500 border-b-2 border-blue-500 bg-blue-500/5" : "text-zinc-500 hover:text-white"}`}
                                >
                                    Direct Messages
                                </button>
                                <button
                                    onClick={() => { setActiveTab("projects"); setActiveConversation(null); }}
                                    className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "projects" ? "text-purple-500 border-b-2 border-purple-500 bg-purple-500/5" : "text-zinc-500 hover:text-white"}`}
                                >
                                    Project Rooms
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto">
                                {!activeConversation ? (
                                    // List View
                                    <div className="p-2">
                                        {activeTab === "messages" ? (
                                            <div className="space-y-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} onClick={() => setActiveConversation(i)} className="p-3 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-3 group transition-colors">
                                                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center relative">
                                                            <span className="font-bold text-sm text-zinc-400">U{i}</span>
                                                            {i === 1 && <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-zinc-900"></span>}
                                                        </div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <div className="flex justify-between items-baseline">
                                                                <h3 className="font-bold text-white text-sm">John Doe {i}</h3>
                                                                <span className="text-xs text-zinc-500">2m</span>
                                                            </div>
                                                            <p className="text-xs text-zinc-400 truncate group-hover:text-zinc-300">Hey, let's discuss the design updates...</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {["Loominn Rebuild", "Neon City Kit", "AI Marketing"].map((proj, i) => (
                                                    <div key={i} onClick={() => setActiveConversation(i + 10)} className="p-3 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-3 group transition-colors">
                                                        <div className="h-10 w-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                                            <Hash size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-baseline">
                                                                <h3 className="font-bold text-white text-sm">{proj}</h3>
                                                                {i === 0 && <span className="text-xs bg-red-500 text-white px-1.5 rounded-full">2</span>}
                                                            </div>
                                                            <p className="text-xs text-zinc-400 group-hover:text-zinc-300">#general • 5 members online</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Conversation View
                                    <div className="h-full flex flex-col">
                                        <div className="p-3 border-b border-white/5 flex items-center gap-3">
                                            <button onClick={() => setActiveConversation(null)} aria-label="Back to conversations" className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white">
                                                <ChevronRight size={20} className="rotate-180" />
                                            </button>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white text-sm">{activeTab === "messages" ? `John Doe ${activeConversation}` : "Loominn Rebuild"}</h3>
                                                <p className="text-xs text-zinc-500">{activeTab === "messages" ? "Online" : "#general"}</p>
                                            </div>
                                            <button aria-label="More options" className="text-zinc-400 hover:text-white"><MoreVertical size={18} /></button>
                                        </div>

                                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                            {/* Mock Messages */}
                                            <div className="flex gap-3">
                                                <div className="h-8 w-8 rounded-full bg-zinc-800 flex-shrink-0" />
                                                <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                                                    <p className="text-sm text-zinc-300">Hey, have you checked the new designs?</p>
                                                    <span className="text-[10px] text-zinc-500 mt-1 block">10:42 AM</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 justify-end">
                                                <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                                                    <p className="text-sm text-white">Yes! They look amazing. The dark mode is perfect.</p>
                                                    <span className="text-[10px] text-blue-200 mt-1 block text-right">10:45 AM</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 border-t border-white/10 bg-zinc-900/30">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder={`Message ${activeTab === 'messages' ? 'John...' : '#general...'}`}
                                                    className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                                />
                                                <button aria-label="Send message" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl transition-colors">
                                                    <Send size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
