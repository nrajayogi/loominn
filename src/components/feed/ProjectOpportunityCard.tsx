"use client";

import { useState } from "react";
import { Briefcase, ChevronRight, Shield, MessageSquare, Bookmark, Share2, MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";
import { ProjectOpportunityFeedContent } from "@/lib/types/schema";
import { useGlobalState } from "@/context/GlobalStateContext";
import CommentDrawer from "./CommentDrawer";
import SafetyModal from "./SafetyModal";
import CommitModal from "@/components/projects/CommitModal";

interface ProjectOpportunityCardProps {
    opportunity: ProjectOpportunityFeedContent;
}

export default function ProjectOpportunityCard({ opportunity }: ProjectOpportunityCardProps) {
    const { toggleSave, savedPosts, comments } = useGlobalState();
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [isSafetyOpen, setIsSafetyOpen] = useState(false);
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);

    const numericId = typeof opportunity.id === "string" ? parseInt(opportunity.id.replace(/\D/g, "")) || 101 : opportunity.id;
    const isSaved = savedPosts.includes(numericId);

    const currentComments = comments.filter(c => String(c.targetId) === String(opportunity.id));
    const totalComments = (opportunity.commentsCount || 0) + currentComments.length;

    const difficultyColors: Record<string, string> = {
        beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        advanced: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        expert: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };

    const handleShare = async () => {
        const shareData = {
            title: opportunity.title,
            text: `Open role on Loominn: ${opportunity.title} (${opportunity.category})`,
            url: typeof window !== "undefined" ? `${window.location.origin}/projects/${opportunity.projectId}` : ""
        };
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (e) {
                console.log(e);
            }
        } else if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(shareData.url);
            alert("Project link copied to clipboard!");
        }
    };

    return (
        <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-5 space-y-4 transition-all duration-300 shadow-xl shadow-blue-950/10 group">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link 
                    href={`/profile/${opportunity.author.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                        {opportunity.authorImage ? (
                            <img src={opportunity.authorImage} alt={opportunity.author} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            opportunity.author.charAt(0)
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{opportunity.author}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20 flex items-center gap-1">
                                <Briefcase size={10} /> Open Opportunity
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>{opportunity.authorRole || "Project Lead"}</span>
                            <span>•</span>
                            <span>{opportunity.time}</span>
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

            {/* Opportunity Pitch Banner */}
            <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                        {opportunity.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${difficultyColors[opportunity.difficulty] || difficultyColors.intermediate}`}>
                        {opportunity.difficulty}
                    </span>
                    {opportunity.membersCount && (
                        <span className="text-xs text-zinc-400 flex items-center gap-1 ml-auto">
                            <Users size={12} /> {opportunity.membersCount} Collaborators
                        </span>
                    )}
                </div>

                <Link href={`/projects/${opportunity.projectId}`} className="block group/title">
                    <h3 className="text-lg font-bold text-white group-hover/title:text-blue-400 transition-colors flex items-center gap-2">
                        {opportunity.title}
                        <ChevronRight size={18} className="text-zinc-500 group-hover/title:translate-x-1 transition-transform" />
                    </h3>
                </Link>

                <p className="text-sm text-zinc-300 leading-relaxed">
                    {opportunity.description}
                </p>
            </div>

            {/* Open Roles & Orbit Thresholds */}
            <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Available Roles</span>
                    <span className="text-[11px] text-zinc-500">Required Orbit Score</span>
                </div>

                <div className="space-y-2 pt-1">
                    {opportunity.roles.map((role, idx) => (
                        <div 
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all text-xs"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                <span className="font-medium text-white">{role.title}</span>
                                {role.filled && (
                                    <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded">Filled</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/40">
                                    {role.minScore}+ Score
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
                <div className="flex items-center gap-4">
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

                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                        <Share2 size={16} />
                        <span>Share</span>
                    </button>
                </div>

                <button 
                    onClick={() => setIsCommitModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                >
                    <Shield size={14} />
                    <span>Stake & Apply</span>
                </button>
            </div>

            {/* Modals */}
            <CommentDrawer 
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
                targetId={opportunity.id}
                targetTitle={opportunity.title}
            />

            <SafetyModal 
                isOpen={isSafetyOpen}
                onClose={() => setIsSafetyOpen(false)}
                targetType="project"
                targetId={String(opportunity.id)}
                targetName={opportunity.author}
            />

            <CommitModal 
                isOpen={isCommitModalOpen}
                onClose={() => setIsCommitModalOpen(false)}
                projectId={opportunity.projectId}
                projectTitle={opportunity.title}
                roles={opportunity.roles.filter(r => !r.filled)}
            />
        </div>
    );
}
