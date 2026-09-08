"use client";

import { useState } from "react";
import { Play, MessageSquare, Heart, Bookmark, Share2, MoreHorizontal, Layers, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { Perspective, PerspectiveStatus } from "@/lib/types/schema";
import { useGlobalState } from "@/context/GlobalStateContext";
import CommentDrawer from "./CommentDrawer";
import SafetyModal from "./SafetyModal";

interface PerspectiveCardProps {
    perspective: Perspective;
    onOpenViewer?: (perspectiveId: string) => void;
}

export default function PerspectiveCard({ perspective, onOpenViewer }: PerspectiveCardProps) {
    const { 
        toggleSave, 
        savedPosts, 
        comments, 
        followingUsers, 
        toggleFollowUser 
    } = useGlobalState();

    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [isSafetyOpen, setIsSafetyOpen] = useState(false);
    const [likes, setLikes] = useState(24);
    const [hasLiked, setHasLiked] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    const numericId = parseInt(perspective.id.replace(/\D/g, "")) || 42;
    const isSaved = savedPosts.includes(numericId);

    const authorId = perspective.userName.toLowerCase().replace(/\s+/g, "-");
    const isFollowing = followingUsers.includes(authorId) || followingUsers.includes(perspective.userId);

    const currentComments = comments.filter(c => String(c.targetId) === String(perspective.id));
    const totalComments = currentComments.length;

    const handleLike = () => {
        setLikes(prev => hasLiked ? prev - 1 : prev + 1);
        setHasLiked(!hasLiked);
    };

    const handleShare = async () => {
        const shareData = {
            title: perspective.title,
            text: `Explore this perspective on Loominn: ${perspective.title}`,
            url: typeof window !== "undefined" ? window.location.href : ""
        };
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (e) {
                console.log(e);
            }
        } else if (typeof navigator !== "undefined" && navigator.clipboard) {
            await navigator.clipboard.writeText(shareData.url);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        }
    };

    const statusColors: Record<PerspectiveStatus, string> = {
        "Perspective": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "Planning": "bg-amber-500/10 text-amber-400 border-amber-500/20"
    };

    const firstItem = perspective.items && perspective.items.length > 0 ? perspective.items[0] : null;

    return (
        <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-5 space-y-4 transition-all duration-300 shadow-xl shadow-purple-950/10 group">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link 
                    href={`/profile/${authorId}`}
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-md">
                        {perspective.userImage ? (
                            <img src={perspective.userImage} alt={perspective.userName} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            perspective.userName.charAt(0)
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{perspective.userName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[perspective.status] || statusColors["Perspective"]}`}>
                                {perspective.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>{perspective.role}</span>
                            {perspective.location && (
                                <>
                                    <span>•</span>
                                    <span>{perspective.location}</span>
                                </>
                            )}
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleFollowUser(authorId)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                            isFollowing
                                ? "bg-white/10 text-zinc-300 hover:bg-white/20"
                                : "bg-purple-600/15 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30"
                        }`}
                    >
                        {isFollowing ? "Following" : "+ Follow"}
                    </button>

                    <button 
                        onClick={() => setIsSafetyOpen(true)}
                        className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        title="Options"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Title */}
            <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                    {perspective.title}
                </h3>
            </div>

            {/* Interactive Preview Canvas */}
            <div 
                onClick={() => onOpenViewer ? onOpenViewer(perspective.id) : null}
                className="relative rounded-xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-6 min-h-[160px] flex flex-col justify-between cursor-pointer group/canvas hover:border-purple-500/50 transition-all"
            >
                <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
                    <span className="flex items-center gap-1.5 bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-800/30">
                        <Layers size={13} /> {perspective.items?.length || 1} Perspective Slide{perspective.items?.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[11px] text-zinc-400 group-hover/canvas:text-white flex items-center gap-1 transition-colors">
                        Launch Reel <ArrowUpRight size={14} />
                    </span>
                </div>

                <div className="my-3">
                    <p className="text-sm text-zinc-300 font-medium line-clamp-3 leading-relaxed">
                        &ldquo;{firstItem?.content || "Exploring structural primitives and design trade-offs."}&rdquo;
                    </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-zinc-500">
                    <span>{perspective.createdAt || "Recent perspective"}</span>
                    <div className="flex items-center gap-1 text-purple-400 font-semibold group-hover/canvas:translate-x-1 transition-transform">
                        <Play size={12} className="fill-purple-400" />
                        <span>Interactive Reel</span>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
                <div className="flex items-center gap-6">
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
                        <span>Discuss {totalComments > 0 ? `(${totalComments})` : ""}</span>
                    </button>

                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-1.5 hover:text-purple-400 transition-colors"
                    >
                        {shareCopied ? (
                            <>
                                <Check size={14} className="text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Share2 size={16} />
                                <span>Share</span>
                            </>
                        )}
                    </button>
                </div>

                <button 
                    onClick={() => toggleSave(numericId)}
                    className={`p-1.5 rounded-lg transition-colors hover:bg-white/5 ${isSaved ? "text-yellow-400" : "hover:text-white"}`}
                    title="Save Perspective"
                >
                    <Bookmark size={16} className={isSaved ? "fill-yellow-400" : ""} />
                </button>
            </div>

            {/* Comment Drawer */}
            <CommentDrawer
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
                targetId={perspective.id}
                targetTitle={perspective.title}
            />

            {/* Safety Modal */}
            <SafetyModal
                isOpen={isSafetyOpen}
                onClose={() => setIsSafetyOpen(false)}
                targetId={perspective.id}
                targetType="perspective"
                targetName={perspective.userName}
            />
        </div>
    );
}
