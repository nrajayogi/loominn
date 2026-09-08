"use client";

import { useState, use } from "react";
import { Target, CheckCircle2, Clock, Users, Plus, Shield, ArrowRight, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import CommitModal from "@/components/projects/CommitModal";
import { useGlobalState } from "@/context/GlobalStateContext";
import { PROJECT_REGISTRY } from "@/lib/data/mock";

export default function ProjectOverviewPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawProjectId } = use(params);
    const projectId = decodeURIComponent(rawProjectId);
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);

    const { workspaceTasks, userProfile, applications } = useGlobalState();

    const projectTitle = projectId
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const registryInfo = PROJECT_REGISTRY[projectTitle] || PROJECT_REGISTRY["Loominn Rebuild"];
    const projectRoles = registryInfo?.roles || [
        { title: "Lead Architect", minScore: 4000 },
        { title: "Core Contributor", minScore: 2000 }
    ];

    // Filter tasks for this project (or all if general)
    const projectTasks = workspaceTasks.filter(t => 
        String(t.projectId).toLowerCase() === projectId.toLowerCase() ||
        String(t.projectId).toLowerCase() === "loominn-rebuild"
    );

    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === "done").length;
    const inProgressTasks = projectTasks.filter(t => t.status === "progress" || t.status === "review").length;
    const todoTasks = projectTasks.filter(t => t.status === "todo").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const projectApplications = applications.filter(a => 
        String(a.projectId).toLowerCase() === projectId.toLowerCase() ||
        a.projectTitle.toLowerCase() === projectTitle.toLowerCase()
    );

    return (
        <div className="space-y-8">
            {/* Overview Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-purple-950/40 border border-white/10 rounded-2xl">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>Workspace Status</span>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                            Live Sync Active
                        </span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                        Domain: {registryInfo?.domain || "Distributed Systems"} • Multi-contributor Kanban & Proof Tracking
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
                    <div className="text-xs text-zinc-400">Total Tasks</div>
                    <div className="text-2xl font-bold text-white">{totalTasks}</div>
                    <div className="text-[10px] text-zinc-500">{todoTasks} backlog items</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={18} />
                    </div>
                    <div className="text-xs text-zinc-400">Completed</div>
                    <div className="text-2xl font-bold text-white">{completedTasks}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{completionRate}% delivered</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Clock size={18} />
                    </div>
                    <div className="text-xs text-zinc-400">Active In Progress</div>
                    <div className="text-2xl font-bold text-white">{inProgressTasks}</div>
                    <div className="text-[10px] text-zinc-500">Under code review</div>
                </div>

                <div className="bg-zinc-900/70 border border-white/5 p-5 rounded-2xl space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                        <Users size={18} />
                    </div>
                    <div className="text-xs text-zinc-400">Active Roles</div>
                    <div className="text-2xl font-bold text-white">{projectRoles.length}</div>
                    <div className="text-[10px] text-purple-400">{projectApplications.length} applications logged</div>
                </div>
            </div>

            {/* Open Roles Section */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Sparkles size={16} className="text-blue-400" />
                            <span>Available Project Roles</span>
                        </h3>
                        <p className="text-xs text-zinc-400">
                            Transparent Orbit guidance thresholds with portfolio evidence review.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCommitModalOpen(true)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                    >
                        Apply Now →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projectRoles.map((role, idx) => (
                        <div
                            key={idx}
                            className="bg-black/40 border border-white/5 hover:border-blue-500/30 p-4 rounded-xl space-y-2 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-white">{role.title}</h4>
                                <span className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                                    {role.minScore}+ Score
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400">
                                Open for direct skill staking or peer portfolio review.
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Tasks List */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Target size={16} className="text-emerald-400" />
                        <span>Recent Workspace Tasks</span>
                    </h3>
                    <Link
                        href={`/projects/${projectId}/board`}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                        <span>Full Board</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="divide-y divide-white/5">
                    {projectTasks.map(task => (
                        <div key={task.id} className="py-3 flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-semibold text-white">{task.title}</h4>
                                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                                    <span>Assigned to: {task.assigneeName || "Unassigned"}</span>
                                    <span>•</span>
                                    <span>{task.createdAt}</span>
                                </div>
                            </div>

                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono uppercase font-semibold ${
                                task.status === "done"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                    : task.status === "progress"
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                        : task.status === "review"
                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                            : "bg-zinc-800 text-zinc-400"
                            }`}>
                                {task.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Commit Modal */}
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
