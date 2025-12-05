"use client";

import { useState } from "react";
import { MessageCircle, Share2, MoreHorizontal, Bookmark } from "lucide-react";
import ReactionButton from "./ReactionButton";

interface ProjectCardProps {
    title: string;
    description: string;
    author: string;
    image: string;
    votes: number;
    comments: number;
    tags: string[];
}

export function ProjectCard({
    title,
    description,
    author,
    image,
    votes: initialVotes,
    comments,
    tags,
}: ProjectCardProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleShare = async () => {
        if (navigator.share) {
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
            // Fallback
            alert("Share feature not supported on this browser");
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {author[0]}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">{author}</h3>
                        <p className="text-xs text-zinc-500">2 hours ago</p>
                    </div>
                </div>
                <button className="text-zinc-500 hover:text-white transition-colors" aria-label="More Options">
                    <MoreHorizontal size={20} />
                </button>
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

            {/* Image */}
            <div className="relative aspect-video w-full bg-zinc-800 overflow-hidden">
                {/* Placeholder for actual image */}
                {image.startsWith("/") ? (
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
                ) : null}

                {/* Fallback Gradient (Hidden by default if image exists) */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center ${image.startsWith("/") ? 'hidden' : ''}`}>
                    <div className="text-center p-4">
                        <h3 className="text-xl font-bold text-white/20 mb-1">{title}</h3>
                        <span className="text-sm text-white/10">Project Preview</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-6">
                    <ReactionButton initialCount={initialVotes} />
                    <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors" aria-label="Comments">
                        <MessageCircle size={22} />
                        <span className="text-sm font-medium">{comments}</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-zinc-400 hover:text-green-400 transition-colors"
                        aria-label="Share"
                    >
                        <Share2 size={22} />
                    </button>
                </div>
                <button
                    onClick={handleBookmark}
                    className={`transition-colors ${isBookmarked ? "text-blue-500" : "text-zinc-400 hover:text-white"}`}
                    aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                >
                    <Bookmark size={22} className={isBookmarked ? "fill-blue-500" : ""} />
                </button>
            </div>
        </div>
    );
}
