"use client";

import { useState } from "react";
import { CheckCircle2, Award, ArrowUpRight, MessageSquare, Bookmark, Share2, MoreHorizontal, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ContributionFeedContent } from "@/lib/types/schema";
import { useGlobalState } from "@/context/GlobalStateContext";
import CommentDrawer from "./CommentDrawer";
import SafetyModal from "./SafetyModal";

interface ContributionCardProps {
    contribution: ContributionFeedContent;
}

export default function ContributionCard({ contribution }: ContributionCardProps) {
    const { toggleSave, savedPosts, comments } = useGlobalState();
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [isSafetyOpen, setIsSafetyOpen] = useState(false);

    const numericId = typeof contribution.id === "string" ? parseInt(contribution.id.replace(/\D/g, "")) || 201 : contribution.id;
    const isSaved = savedPosts.includes(numericId);

    const currentComments = comments.filter(c => String(c.targetId) === String(contribution.id));
    const totalComments = (contribution.commentsCount || 0) + currentComments.length;

    const handleShare = async () => {
        const shareData = {
            title: `Verified Contribution by ${contribution.author}`,
            text: `${contribution.author} completed: ${contribution.milestoneTitle} on ${contribution.projectTitle}`,
            url: typeof window !== "undefined" ? `${window.location.origin}/history` : ""
        };
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (e) {
                console.log(e);
            }
        } else if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(shareData.url);
            alert("Contribution link copied to clipboard!");
        }
    };

    const typeBadges: Record<string, string> = {
        code: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
        architecture: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        milestone: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };

    return (
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-all duration-300 shadow-xl shadow-emerald-950/10 group">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link 
                    href={`/profile/${contribution.author.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                        {contribution.authorImage ? (
                            <img src={contribution.authorImage} alt={contribution.author} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            contribution.author.charAt(0)
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{contribution.author}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                                <ShieldCheck size={11} /> Proof of Work
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>{contribution.authorRole || "Contributor"}</span>
                            <span>•</span>
                            <span>{contribution.time}</span>
                        </div>
                    </div>
                </Link>

                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setIsSafetyOpen(true)}
                        className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            {/* Project & Milestone Banner */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <Link 
                        href={`/projects/${contribution.projectId}`}
                        className="text-xs font-mono uppercase tracking-wider text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                        Project: {contribution.projectTitle} <ArrowUpRight size={12} />
                    </Link>

                    <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                        <Award size={12} />
                        <span>+{contribution.scoreDelta} Orbit</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                        {contribution.milestoneTitle}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${typeBadges[contribution.contributionType] || typeBadges.code}`}>
                        {contribution.contributionType}
                    </span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5">
                    {contribution.summary}
                </p>
            </div>

            {/* Verification Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-emerald-950/20 border border-emerald-900/30 px-3.5 py-2 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-400">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Peer verified by <strong className="text-emerald-300">{contribution.verifiedBy}</strong></span>
                </div>

                {contribution.evidenceUrl && (
                    <a 
                        href={contribution.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] underline"
                    >
                        View Proof Artifact <ExternalLink size={11} />
                    </a>
                )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
                <div className="flex items-center gap-5">
                    <button 
                        onClick={() => setIsCommentOpen(true)}
                        className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                    >
                        <MessageSquare size={16} />
                        <span>Congratulate ({totalComments})</span>
                    </button>

                    <button 
                        onClick={() => toggleSave(numericId)}
                        className={`flex items-center gap-1.5 hover:text-yellow-400 transition-colors ${isSaved ? "text-yellow-400" : ""}`}
                    >
                        <Bookmark size={16} className={isSaved ? "fill-yellow-400" : ""} />
                        <span>{isSaved ? "Saved" : "Save"}</span>
                    </button>

                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                        <Share2 size={16} />
                        <span>Share</span>
                    </button>
                </div>

                <Link 
                    href="/history" 
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
                >
                    Audit Ledger <ArrowUpRight size={13} />
                </Link>
            </div>

            {/* Modals */}
            <CommentDrawer 
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
                targetId={contribution.id}
                targetTitle={contribution.milestoneTitle}
            />

            <SafetyModal 
                isOpen={isSafetyOpen}
                onClose={() => setIsSafetyOpen(false)}
                targetType="post"
                targetId={String(contribution.id)}
                targetName={contribution.author}
            />
        </div>
    );
}
