"use client";

import { useState } from "react";
import { Megaphone, ArrowUpRight, MessageSquare, Bookmark, Share2, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { AnnouncementFeedContent } from "@/lib/types/schema";
import { useGlobalState } from "@/context/GlobalStateContext";
import CommentDrawer from "./CommentDrawer";

interface AnnouncementCardProps {
    announcement: AnnouncementFeedContent;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
    const { toggleSave, savedPosts, comments } = useGlobalState();
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [likes, setLikes] = useState(announcement.likes || 42);
    const [hasLiked, setHasLiked] = useState(false);

    const numericId = typeof announcement.id === "string" ? parseInt(announcement.id.replace(/\D/g, "")) || 301 : announcement.id;
    const isSaved = savedPosts.includes(numericId);

    const currentComments = comments.filter(c => String(c.targetId) === String(announcement.id));
    const totalComments = (announcement.commentsCount || 0) + currentComments.length;

    const handleLike = () => {
        setLikes(prev => hasLiked ? prev - 1 : prev + 1);
        setHasLiked(!hasLiked);
    };

    const handleShare = async () => {
        const shareData = {
            title: announcement.title,
            text: announcement.content,
            url: typeof window !== "undefined" ? window.location.href : ""
        };
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (e) {
                console.log(e);
            }
        } else if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(shareData.url);
            alert("Announcement link copied to clipboard!");
        }
    };

    return (
        <div className="bg-gradient-to-r from-purple-950/40 via-zinc-900/90 to-indigo-950/40 border border-purple-500/30 hover:border-purple-500/50 rounded-2xl p-5 space-y-4 transition-all duration-300 shadow-xl shadow-purple-950/20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Megaphone size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{announcement.author || "Loominn Core"}</span>
                            {announcement.badge && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/30 font-mono">
                                    {announcement.badge}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-zinc-400">
                            <span>{announcement.time || "Official Update"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-purple-400 font-mono text-xs bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-800/40">
                    <Sparkles size={12} />
                    <span>System Milestone</span>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <h3 className="text-base font-bold text-white">
                    {announcement.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                    {announcement.content}
                </p>
            </div>

            {/* Optional Call to Action */}
            {announcement.linkUrl && (
                <div>
                    <Link
                        href={announcement.linkUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-700/40 px-3.5 py-2 rounded-xl transition-all"
                    >
                        <span>{announcement.linkLabel || "Learn more"}</span>
                        <ArrowUpRight size={13} />
                    </Link>
                </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
                <div className="flex items-center gap-5">
                    <button 
                        onClick={handleLike}
                        className="flex items-center gap-1.5 hover:text-pink-400 transition-colors"
                    >
                        <Heart size={16} className={hasLiked ? "text-pink-500 fill-pink-500" : ""} />
                        <span>{likes}</span>
                    </button>

                    <button 
                        onClick={() => setIsCommentOpen(true)}
                        className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                    >
                        <MessageSquare size={16} />
                        <span>Discuss ({totalComments})</span>
                    </button>

                    <button 
                        onClick={() => toggleSave(numericId)}
                        className={`flex items-center gap-1.5 hover:text-yellow-400 transition-colors ${isSaved ? "text-yellow-400" : ""}`}
                    >
                        <Bookmark size={16} className={isSaved ? "fill-yellow-400" : ""} />
                        <span>{isSaved ? "Saved" : "Save"}</span>
                    </button>
                </div>

                <button 
                    onClick={handleShare}
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                    <Share2 size={16} />
                    <span>Share</span>
                </button>
            </div>

            {/* Modals */}
            <CommentDrawer 
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
                targetId={announcement.id}
                targetTitle={announcement.title}
            />
        </div>
    );
}
