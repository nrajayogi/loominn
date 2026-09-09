"use client";

import { useState, use } from "react";
import { 
    Target, CheckCircle2, Clock, Users, Plus, Shield, 
    ArrowRight, Sparkles, MessageSquare, ExternalLink, 
    Layers, GitPullRequest, Info, Award, MessageCircle
} from "lucide-react";
import Link from "next/link";
import CommitModal from "@/components/projects/CommitModal";
import { useGlobalState } from "@/context/GlobalStateContext";
import { PROJECT_REGISTRY } from "@/lib/data/mock";
import { calculateSkillScore, SkillStats } from "@/lib/ai/skill-engine";
import { DEFAULT_NEW_USER_STATS } from "@/lib/types/schema";

export default function ProjectOverviewPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawProjectId } = use(params);
    const projectId = decodeURIComponent(rawProjectId);
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
    const [showFormula, setShowFormula] = useState(false);

    const { 
        workspaceTasks, 
        userProfile, 
        applications, 
        perspectives, 
        contributions,
        projectMembers 
    } = useGlobalState();

    const projectTitle = projectId
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const registryInfo = PROJECT_REGISTRY[projectTitle] || PROJECT_REGISTRY["Loominn Rebuild"];
    const projectRoles = registryInfo?.roles || [
        { title: "Lead Architect", minScore: 4000 },
        { title: "Core Contributor", minScore: 2000 },
        { title: "Security Auditor", minScore: 3500 }
    ];

    // Compute user's Orbit score
    const effectiveStats: SkillStats = userProfile?.stats ? {
        velocity: userProfile.stats.velocity,
        projectsCompleted: userProfile.stats.projectsCompleted,
        onTimeCompletion: userProfile.stats.onTimeCompletion,
        complexity: userProfile.stats.complexity,
        risk: userProfile.stats.risk
    } : DEFAULT_NEW_USER_STATS;
    const userScore = calculateSkillScore(effectiveStats).formatted;

    // Filter tasks for this project
    const projectTasks = workspaceTasks.filter(t => 
        String(t.projectId).toLowerCase() === projectId.toLowerCase() ||
        String(t.projectId).toLowerCase() === "loominn-rebuild"
    );

    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === "done").length;
    const inProgressTasks = projectTasks.filter(t => t.status === "progress" || t.status === "review").length;
    const todoTasks = projectTasks.filter(t => t.status === "todo").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Active members
    const members = projectMembers[projectId] || projectMembers["loominn-rebuild"] || [];

    // Project perspectives
    const relatedPerspectives = perspectives.filter(p => {
        const itemContent = p.items?.[0]?.content || "";
        const titleMatch = p.title.toLowerCase().includes(projectId.replace(/-/g, " "));
        const contentMatch = itemContent.toLowerCase().includes(projectId.replace(/-/g, " "));
        return titleMatch || contentMatch;
    }).slice(0, 3);

    // If no exact match, show recent high quality perspectives as workspace knowledge
    const displayPerspectives = relatedPerspectives.length > 0 
        ? relatedPerspectives 
        : perspectives.slice(0, 3);

    // Project completed proof deliverables
    const verifiedDeliverables = projectTasks.filter(t => t.status === "done");

    return (
        <div className="space-y-8">
            {/* Overview Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-purple-950/40 border border-white/10 rounded-2xl">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h2 className="text-lg font-bold text-white">Workspace Overview & Staking</h2>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                            Live Collaboration Sync
                        </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                        Domain: {registryInfo?.domain || "Distributed Systems"} • {members.length} Collaborators Active • Transparent Proof Verification
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCommitModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all"
                    >
                        <Shield size={14} />
                        <span>Stake & Apply for Role</span>
                    </button>

                    <Link
                        href={`/projects/${projectId}/board`}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                        <Plus size={14} />
                        <span>Open Board</span>
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                        <Target size={18} />
                    </div>
                    <div className="text-xs text-zinc-400">Total Workspace Tasks</div>
                    <div className="text-2xl font-bold text-white font-mono">{totalTasks}</div>
                    <div className="text-[10px] text-zinc-500">{todoTasks} backlog items</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={18} />
                    </div>
                    <div className="text-xs text-zinc-400">Verified Deliverables</div>
                    <div className="text-2xl font-bold text-white font-mono">{completedTasks}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{completionRate}% delivered</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Clock size={18} />
                    </div>
                    <div className="text-xs text-zinc-400">Under Peer Review</div>
                    <div className="text-2xl font-bold text-white font-mono">{inProgressTasks}</div>
                    <div className="text-[10px] text-zinc-500">Active code branches</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                        <Users size={18} />
                    </div>
                    <div className="text-xs text-zinc-400">Active Team</div>
                    <div className="text-2xl font-bold text-white font-mono">{members.length}</div>
                    <div className="text-[10px] text-purple-400">{projectRoles.length} target roles defined</div>
                </div>
            </div>

            {/* Orbit Score Guidance & Open Roles */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Sparkles size={16} className="text-blue-400" />
                            <span>Available Roles & Orbit Score Guidance</span>
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Your current Orbit Score is <strong className="text-white font-mono">{userScore.toLocaleString()}</strong>. Thresholds guide recommended domain mastery.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowFormula(!showFormula)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all self-start sm:self-auto"
                    >
                        <Info size={13} />
                        <span>{showFormula ? "Hide Orbit Formula" : "Explain Orbit Formula"}</span>
                    </button>
                </div>

                {/* Formula Explanation Alert */}
                {showFormula && (
                    <div className="p-4 bg-black/60 border border-purple-500/30 rounded-xl space-y-2 text-xs text-zinc-300 font-mono">
                        <div className="text-purple-300 font-bold">
                            Formula: Orbit Score = ((Velocity + Projects + Complexity) × Confidence) / Risk
                        </div>
                        <p className="text-zinc-400 text-[11px] font-sans leading-relaxed">
                            Loominn uses proof-of-work scoring based on peer-verified deliverable completions, code quality, and on-time execution. 
                            If you are below the recommended threshold, you are never blocked: you can submit portfolio links (GitHub repos, RFCs, demo deployments) for lead peer review.
                        </p>
                    </div>
                )}

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projectRoles.map((role, idx) => {
                        const isEligible = userScore >= role.minScore;
                        const scoreDiff = Math.abs(userScore - role.minScore);

                        return (
                            <div
                                key={idx}
                                className="bg-black/40 border border-white/5 hover:border-blue-500/30 p-5 rounded-xl space-y-3 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-sm font-bold text-white">{role.title}</h4>
                                        <span className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                                            {role.minScore}+ Score
                                        </span>
                                    </div>

                                    <p className="text-xs text-zinc-400">
                                        Focus: Architecture, sprint deliverables, and code review in {registryInfo?.domain || "Distributed Systems"}.
                                    </p>

                                    {/* Eligibility Indicator */}
                                    <div className="pt-2">
                                        {isEligible ? (
                                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                                                <CheckCircle2 size={13} />
                                                <span>Orbit Qualified (+{scoreDiff.toLocaleString()} pts)</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                                                <Info size={13} />
                                                <span>Portfolio Evidence Path (-{scoreDiff.toLocaleString()} pts)</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-white/5">
                                    <button
                                        onClick={() => setIsCommitModalOpen(true)}
                                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                            isEligible
                                                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20"
                                                : "bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30"
                                        }`}
                                    >
                                        <Shield size={13} />
                                        <span>{isEligible ? "Direct Stake & Commit" : "Apply with Portfolio Evidence"}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quick Workspace Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                    href={`/projects/${projectId}/board`}
                    className="p-5 bg-zinc-900/60 border border-white/5 hover:border-blue-500/30 rounded-2xl space-y-2 transition-all group"
                >
                    <div className="flex items-center justify-between text-blue-400">
                        <Target size={20} />
                        <ArrowRight size={16} className="text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300">Sprint Board</h4>
                    <p className="text-xs text-zinc-400">Kanban tasks, deliverable proof verification, and peer acknowledgements.</p>
                </Link>

                <Link
                    href={`/projects/${projectId}/channel`}
                    className="p-5 bg-zinc-900/60 border border-white/5 hover:border-purple-500/30 rounded-2xl space-y-2 transition-all group"
                >
                    <div className="flex items-center justify-between text-purple-400">
                        <MessageCircle size={20} />
                        <ArrowRight size={16} className="text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300">Project Channel</h4>
                    <p className="text-xs text-zinc-400">Real-time team sync, milestone broadcasts, and technical discussions.</p>
                </Link>

                <Link
                    href={`/projects/${projectId}/timeline`}
                    className="p-5 bg-zinc-900/60 border border-white/5 hover:border-emerald-500/30 rounded-2xl space-y-2 transition-all group"
                >
                    <div className="flex items-center justify-between text-emerald-400">
                        <Clock size={20} />
                        <ArrowRight size={16} className="text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">Timeline & Phases</h4>
                    <p className="text-xs text-zinc-400">Milestone roadmap, delivery checkpoints, and schedule projection.</p>
                </Link>

                <Link
                    href={`/projects/${projectId}/members`}
                    className="p-5 bg-zinc-900/60 border border-white/5 hover:border-pink-500/30 rounded-2xl space-y-2 transition-all group"
                >
                    <div className="flex items-center justify-between text-pink-400">
                        <Users size={20} />
                        <ArrowRight size={16} className="text-zinc-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-pink-300">Team & Review Queue</h4>
                    <p className="text-xs text-zinc-400">Active contributors, role assignments, and applicant review queue.</p>
                </Link>
            </div>

            {/* Project Perspectives Stream */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <MessageSquare size={16} className="text-purple-400" />
                            <span>Workspace Perspectives & Experiments</span>
                        </h3>
                        <p className="text-xs text-zinc-400">
                            Engineering discoveries, architecture discussions, and progress logs shared by collaborators.
                        </p>
                    </div>

                    <Link
                        href="/perspectives"
                        className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                    >
                        Browse All Perspectives →
                    </Link>
                </div>

                <div className="space-y-3">
                    {displayPerspectives.map(p => {
                        const snippet = p.items?.[0]?.content || p.items?.[0]?.caption || p.title;

                        return (
                            <div 
                                key={p.id}
                                className="bg-black/40 border border-white/5 hover:border-white/15 p-4 rounded-xl space-y-2 transition-all"
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                                            {p.userImage ? (
                                                <img src={p.userImage} alt={p.userName} className="w-full h-full object-cover" />
                                            ) : (
                                                p.userName.charAt(0)
                                            )}
                                        </div>
                                        <span className="font-semibold text-white">{p.userName}</span>
                                        <span className="text-zinc-500 font-mono text-[11px]">{p.role}</span>
                                    </div>
                                    <span className="text-[11px] text-zinc-500">{p.createdAt || "Recent"}</span>
                                </div>

                                <h4 className="text-xs font-bold text-white mt-1">{p.title}</h4>
                                <p className="text-xs text-zinc-300 leading-relaxed">
                                    {snippet}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Verified Proof Deliverables */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Award size={16} className="text-emerald-400" />
                            <span>Verified Milestone Deliverables</span>
                        </h3>
                        <p className="text-xs text-zinc-400">
                            Delivered tasks audited with proof artifacts and peer acknowledgements.
                        </p>
                    </div>

                    <Link
                        href="/history"
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                        <span>Audit Ledger</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="divide-y divide-white/5">
                    {verifiedDeliverables.length === 0 ? (
                        <div className="text-center py-8 text-xs text-zinc-500">
                            No verified deliverables recorded yet. Complete board tasks to verify proof of work.
                        </div>
                    ) : (
                        verifiedDeliverables.map(task => (
                            <div key={task.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-semibold text-white">{task.title}</h4>
                                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                                            +{task.scoreDelta || 35} Orbit
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 flex-wrap">
                                        <span>Delivered by: <strong className="text-zinc-200">{task.assigneeName || "Contributor"}</strong></span>
                                        {task.peerReviewer && (
                                            <>
                                                <span>•</span>
                                                <span>Audited by: <strong className="text-emerald-400">{task.peerReviewer}</strong></span>
                                            </>
                                        )}
                                        {task.acknowledgement && (
                                            <>
                                                <span>•</span>
                                                <span className="text-zinc-300 italic">&ldquo;{task.acknowledgement}&rdquo;</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {task.evidenceUrl && (
                                    <a
                                        href={task.evidenceUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1 shrink-0"
                                    >
                                        <span>Proof Artifact</span>
                                        <ExternalLink size={11} />
                                    </a>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Role Staking Modal */}
            <CommitModal
                isOpen={isCommitModalOpen}
                onClose={() => setIsCommitModalOpen(false)}
                projectId={projectId}
                projectTitle={projectTitle}
                roles={projectRoles}
            />
        </div>
    );
}
