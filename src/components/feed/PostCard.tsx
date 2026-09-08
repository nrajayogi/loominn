"use client";

import { useState } from "react";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Check, UserPlus } from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import CommentDrawer from "./CommentDrawer";
import SafetyModal from "./SafetyModal";

interface PostCardProps {
    id: number | string;
    content: string;
    author: string;
    authorImage?: string;
    authorRole?: string;
    time: string;
    likes: number;
    commentsCount?: number;
    tags?: string[];
    image?: string;
}

export default function PostCard({
    id,
    content,
    author,
    authorImage,
    authorRole = "Creator",
    time,
    likes,
    commentsCount = 0,
    tags = [],
    image
}: PostCardProps) {
    const { 
        toggleLike, 
        toggleSave, 
        savedPosts, 
        comments, 
        followingUsers, 
        toggleFollowUser 
    } = useGlobalState();

    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [isSafetyOpen, setIsSafetyOpen] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    const numericId = typeof id === "string" ? parseInt(id.replace(/\D/g, "")) || 1 : id;
    const isSaved = savedPosts.includes(numericId);

    const authorId = author.toLowerCase().replace(/\s+/g, "-");
    const isFollowing = followingUsers.includes(authorId) || followingUsers.includes(`u-${authorId}`);

    // Live count of comments from state
    const currentComments = comments.filter(c => String(c.targetId) === String(id));
    const totalComments = commentsCount + currentComments.length;

    const handleShare = async () => {
        const shareData = {
            title: `Post by ${author} on Loominn`,
            text: content,
            url: typeof window !== "undefined" ? window.location.href : ""
        };
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (e) {
                console.log("Share cancelled or failed", e);
            }
        } else if (typeof navigator !== "undefined" && navigator.clipboard) {
            await navigator.clipboard.writeText(shareData.url);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        }
    };

    return (
        <div className="bg-zinc-900/60 border border-white/5 hover:border-white/10 rounded-2xl p-5 space-y-4 transition-all duration-300 backdrop-blur-sm group">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href={`/profile/${authorId}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-md">
                        {authorImage ? (
                            <img src={authorImage} alt={author} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            author.charAt(0)
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white hover:text-blue-400 transition-colors">{author}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-white/5">
                                {authorRole}
                            </span>
                        </div>
                        <span className="text-xs text-zinc-500">{time}</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleFollowUser(authorId)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                            isFollowing
                                ? "bg-white/10 text-zinc-300 hover:bg-white/20"
                                : "bg-blue-600/15 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30"
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

            {/* Content */}
            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
                {content}
            </p>

            {/* Optional Image */}
            {image && (
                <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-950/50 max-h-96">
                    <img src={image} alt="Attachment" className="w-full h-full object-cover" />
                </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag, i) => (
                        <span key={i} className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2.5 py-0.5 rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-zinc-400">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => toggleLike(numericId)}
                        className="flex items-center gap-1.5 hover:text-pink-400 transition-colors group/btn"
                    >
                        <Heart size={16} className={`group-hover/btn:scale-110 transition-transform ${likes > 0 ? "text-pink-500 fill-pink-500/20" : ""}`} />
                        <span>{likes}</span>
                    </button>

                    <button 
                        onClick={() => setIsCommentOpen(true)}
                        className="flex items-center gap-1.5 hover:text-blue-400 transition-colors group/btn"
                    >
                        <MessageSquare size={16} className="group-hover/btn:scale-110 transition-transform" />
                        <span>{totalComments}</span>
                    </button>

                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-1.5 hover:text-purple-400 transition-colors group/btn"
                    >
                        {shareCopied ? (
                            <>
                                <Check size={14} className="text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Share2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                <span>Share</span>
                            </>
                        )}
                    </button>
                </div>

                <button 
                    onClick={() => toggleSave(numericId)}
                    className={`p-1.5 rounded-lg transition-colors hover:bg-white/5 ${isSaved ? "text-yellow-400" : "hover:text-white"}`}
                    title={isSaved ? "Remove Bookmark" : "Bookmark Post"}
                >
                    <Bookmark size={16} className={isSaved ? "fill-yellow-400" : ""} />
                </button>
            </div>

            {/* Comment Drawer */}
            <CommentDrawer
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
                targetId={id}
                targetTitle={`Post by ${author}`}
            />

            {/* Safety & Moderation Modal */}
            <SafetyModal
                isOpen={isSafetyOpen}
                onClose={() => setIsSafetyOpen(false)}
                targetId={String(id)}
                targetType="post"
                targetName={author}
            />
        </div>
    );
}
