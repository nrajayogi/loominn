import { useState } from "react";
import { MessageCircle, Share2, MoreHorizontal, Bookmark, ShieldCheck, Heart, MessageSquare } from "lucide-react";
import ReactionButton from "./ReactionButton";
import SkillScoreBadge from "@/components/ui/SkillScoreBadge";
import { SkillStats } from "@/lib/ai/skill-engine";

import { useGlobalState } from "@/context/GlobalStateContext";

interface ProjectCardProps {
    id: number | string; // Creating a unique identifier for saving
    title: string;
    description: string;
    author: string;
    image: string;
    authorImage?: string;
    votes: number;
    comments: number;
    tags: string[];
    roles?: Array<{ title: string; minScore: number }>;
    onApply?: () => void;
}

export function ProjectCard({
    id,
    title,
    description,
    author,
    image,
    authorImage,
    votes: initialVotes,
    comments,
    tags,
    roles,
    onApply
}: ProjectCardProps) {
    const { toggleSave, savedPosts } = useGlobalState();

    // Check if this specific card (by ID if available, otherwise title fallback - strictly strictly ID is better but we use index in feed for now or post ID)
    // We parse ID if it comes in as string 'post-X'
    const numericId = typeof id === 'string'
        ? parseInt(id.replace(/\D/g, ''))
        : id;

    const isBookmarked = !isNaN(numericId) && savedPosts.includes(numericId);

    // Calculate the lowest entry barrier
    const lowestMinScore = roles && roles.length > 0
        ? Math.min(...roles.map(r => r.minScore))
        : null;

    const handleBookmark = () => {
        if (!isNaN(numericId)) {
            toggleSave(numericId);
        }
    };

    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                // Fallback to clipboard
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    const isProjectLaunch = (roles && roles.length > 0) || tags.includes("Project") || tags.includes("Launch");
    const hasImage = image && image.length > 0 && image !== "/placeholder-project-slide.jpg"; // Basic check

    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group relative">
            {/* Min Score Badge Overlay */}
            {lowestMinScore !== null && (
                <div className="absolute top-4 right-14 z-10 hidden md:block">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Requires</span>
                        <div className="flex items-center gap-1">
                            <ShieldCheck size={12} className={lowestMinScore > 5000 ? "text-purple-400" : "text-blue-400"} />
                            <span className="font-mono font-bold text-white text-xs">
                                {lowestMinScore >= 1000 ? (lowestMinScore / 1000).toFixed(1) + "k" : lowestMinScore}+
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-4 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-white/10">
                        {authorImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={authorImage} alt={author} className="w-full h-full object-cover" />
                        ) : (
                            author[0]
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">{author}</h3>
                        <p className="text-xs text-zinc-500">Just now</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Mobile Only Min Score Indicator */}
                    {lowestMinScore !== null && (
                        <div className="md:hidden flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-lg border border-white/5">
                            <ShieldCheck size={14} className="text-blue-400" />
                            <span className="text-xs font-mono font-bold text-white">
                                {lowestMinScore >= 1000 ? (lowestMinScore / 1000).toFixed(1) + "k" : lowestMinScore}
                            </span>
                        </div>
                    )}
                    <button className="text-zinc-500 hover:text-white transition-colors" aria-label="More Options">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                    {description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-zinc-300 border border-white/5"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Image / Project Launch Visual */}
            <div className="relative aspect-video w-full bg-zinc-800 overflow-hidden">
                {/* 1. Actual Image (if present) */}
                {hasImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : isProjectLaunch ? (
                    // 2. Project Presentation Mode (No Image)
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-zinc-900 to-black relative p-8 flex flex-col justify-center items-center text-center group-hover:scale-105 transition-transform duration-700">
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                        {/* Glowing Orb */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                                <ShieldCheck size={12} /> Project Launch
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2 leading-tight max-w-[80%] mx-auto">{title}</h3>
                            <p className="text-zinc-400 text-sm bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full inline-block">
                                {lowestMinScore ? `Requires ${lowestMinScore} Orbit Points` : 'Open for Collaboration'}
                            </p>
                        </div>
                    </div>
                ) : (
                    // 3. Fallback for non-project posts without images (if any)
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                        {/* Usually text posts don't show this area, but just in case */}
                        <div className="text-zinc-700">Loominn</div>
                    </div>
                )}

                {/* Fallback Gradient (Hidden by default if image exists) */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center hidden`}>
                    <div className="text-center p-4">
                        <h3 className="text-xl font-bold text-white/20 mb-1">{title}</h3>
                        <span className="text-sm text-white/10">Project Preview</span>
                    </div>
                </div>
            </div>

            {/* Interaction Footer */}
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-pink-500 transition-colors text-sm group">
                        <Heart size={18} className={`group-hover:scale-110 transition-transform ${initialVotes > 0 ? "fill-pink-500 text-pink-500" : ""}`} />
                        <span>{initialVotes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors text-sm group">
                        <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                        <span>{comments}</span>
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors text-sm group">
                        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                        <span>Share</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {roles && roles.length > 0 && onApply && (
                        <button
                            onClick={onApply}
                            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-bold transition-all hover:scale-105 shadow-lg shadow-blue-900/20"
                        >
                            <ShieldCheck size={14} />
                            Apply
                        </button>
                    )}
                    <button
                        onClick={handleBookmark}
                        className={`text-zinc-400 hover:text-yellow-400 transition-colors ${isBookmarked ? "text-yellow-400" : ""}`}
                    >
                        <Bookmark size={20} className={isBookmarked ? "fill-yellow-400" : ""} />
                    </button>
                </div>
            </div>
        </div>
    );
}
