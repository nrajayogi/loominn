"use client";

import { useState } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useSession } from "next-auth/react";

interface CommentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string | number;
    targetTitle?: string;
}

export default function CommentDrawer({ isOpen, onClose, targetId, targetTitle }: CommentDrawerProps) {
    const { comments, addComment, userProfile } = useGlobalState();
    const { data: session } = useSession();
    const [newComment, setNewComment] = useState("");

    const itemComments = comments.filter(c => String(c.targetId) === String(targetId));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        addComment(
            targetId, 
            newComment.trim(), 
            userProfile.name || session?.user?.name || "Community Member",
            userProfile.image || session?.user?.image || ""
        );
        setNewComment("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        className="relative w-full max-w-md h-full bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col z-10"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                            <div className="flex items-center gap-2">
                                <MessageSquare size={18} className="text-blue-400" />
                                <div>
                                    <h3 className="text-white font-bold text-sm">Comments & Discussions</h3>
                                    {targetTitle && (
                                        <p className="text-xs text-zinc-500 truncate max-w-[260px]">{targetTitle}</p>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Comments Stream */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {itemComments.length > 0 ? (
                                itemComments.map(comment => (
                                    <div key={comment.id} className="bg-zinc-900/60 border border-white/5 rounded-xl p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                                                    {comment.authorImage ? (
                                                        <img src={comment.authorImage} alt={comment.authorName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        comment.authorName.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-white block leading-tight">{comment.authorName}</span>
                                                    {comment.authorHandle && (
                                                        <span className="text-[10px] text-zinc-500">{comment.authorHandle}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-zinc-500">{comment.createdAt}</span>
                                        </div>
                                        <p className="text-xs text-zinc-300 leading-relaxed pl-9">
                                            {comment.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                                    <MessageSquare size={32} className="opacity-20 mb-2" />
                                    <p className="text-sm font-medium text-zinc-400">No discussions yet</p>
                                    <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                                        Share technical feedback, ask about implementation choices, or suggest improvements.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-zinc-900/50 flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add to the discussion..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl transition-all"
                            >
                                <Send size={14} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
