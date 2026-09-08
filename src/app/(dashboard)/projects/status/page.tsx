"use client";

import { useState } from "react";
import { CheckCircle2, Clock, FileText, AlertCircle, ChevronRight, Plus, Shield, ArrowRight, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import { ProjectApplication } from "@/lib/types/schema";

export default function ApplicationStatusPage() {
    const { userProjects, approveProject, applications } = useGlobalState();
    const [activeTab, setActiveTab] = useState<"roles" | "projects">("roles");

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Application Tracker</h1>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                        Track role commitments, review status, and project launch approvals.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/projects">
                        <button className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl bg-zinc-900 border border-white/5 transition-colors">
                            Explore Projects
                        </button>
                    </Link>
                    <Link href="/projects/create">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                            <Plus size={14} /> Launch Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-1 text-xs font-semibold">
                <button
                    onClick={() => setActiveTab("roles")}
                    className={`pb-3 px-4 transition-all border-b-2 flex items-center gap-1.5 ${
                        activeTab === "roles"
                            ? "text-white border-blue-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <Shield size={14} className={activeTab === "roles" ? "text-blue-400" : ""} />
                    <span>Role Applications ({applications.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab("projects")}
                    className={`pb-3 px-4 transition-all border-b-2 flex items-center gap-1.5 ${
                        activeTab === "projects"
                            ? "text-white border-purple-500"
                            : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                >
                    <FileText size={14} className={activeTab === "projects" ? "text-purple-400" : ""} />
                    <span>Project Submissions ({userProjects.length})</span>
                </button>
            </div>

            {/* TAB 1: ROLE STAKING APPLICATIONS */}
            {activeTab === "roles" && (
                <div className="space-y-4">
                    {applications.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-3">
                            <Shield size={36} className="mx-auto text-zinc-500" />
                            <h3 className="text-white font-bold text-sm">No Role Applications Yet</h3>
                            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                                Explore projects on Loominn and stake your Orbit Score or submit portfolio evidence to collaborate.
                            </p>
                            <Link
                                href="/projects"
                                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all"
                            >
                                Browse Open Roles
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map(app => (
                                <div 
                                    key={app.id}
                                    className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6 space-y-4 transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div>
                                            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-semibold">
                                                Role Staking Application
                                            </span>
                                            <h3 className="text-lg font-bold text-white mt-0.5">{app.roleTitle}</h3>
                                            <p className="text-xs text-zinc-400">
                                                Project: <Link href={`/projects/${app.projectId}`} className="text-blue-400 hover:underline">{app.projectTitle}</Link>
                                            </p>
                                        </div>

                                        <span className={`text-xs px-3 py-1 rounded-full font-mono uppercase font-bold self-start ${
                                            app.status === "accepted"
                                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                : app.status === "declined"
                                                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                        }`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    {/* Application Context */}
                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                                        <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                                            <span>Submitted: {app.submittedAt}</span>
                                            <span className="font-mono text-purple-300">
                                                Score Staked: {app.applicantScore.toLocaleString()} (Threshold: {app.requiredScore.toLocaleString()})
                                            </span>
                                        </div>

                                        <p className="text-zinc-200 leading-relaxed pt-1">
                                            &ldquo;{app.motivation}&rdquo;
                                        </p>

                                        {app.feedback && (
                                            <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-300 flex items-center gap-1.5">
                                                <Sparkles size={12} className="text-emerald-400" />
                                                <span>Feedback from Lead: <strong>{app.feedback}</strong></span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Workspace Action */}
                                    {app.status === "accepted" && (
                                        <div className="pt-2 flex justify-end">
                                            <Link
                                                href={`/projects/${app.projectId}/board`}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/20"
                                            >
                                                <span>Enter Project Workspace</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: PROJECT SUBMISSIONS */}
            {activeTab === "projects" && (
                <div className="space-y-4">
                    {userProjects.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-2xl">
                            <FileText size={36} className="mx-auto text-zinc-500 mb-3" />
                            <h3 className="text-xl font-bold text-white mb-1">No Active Project Submissions</h3>
                            <p className="text-zinc-400 text-xs mb-6 max-w-md mx-auto">
                                You haven&apos;t submitted any projects for review yet. Start your journey by launching a new project workspace.
                            </p>
                            <Link href="/projects/create">
                                <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-6 rounded-xl transition-colors">
                                    Launch New Project
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {userProjects.map((project) => (
                                <div key={project.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6 relative z-10">
                                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-900/20 shrink-0">
                                            {project.title.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h2 className="text-xl font-bold text-white">{project.title}</h2>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase font-mono ${
                                                    project.status === 'approved'
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                    {project.status === 'submitted' ? 'In Review' : project.status}
                                                </span>
                                            </div>
                                            <p className="text-zinc-400 text-xs max-w-xl line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>

                                    {project.status === 'submitted' && (
                                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-xs text-zinc-500">Awaiting automated validation</span>
                                            <button 
                                                onClick={() => approveProject(project.id)}
                                                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline"
                                            >
                                                Simulate Auto-Approval
                                            </button>
                                        </div>
                                    )}

                                    {project.status === 'approved' && (
                                        <div className="pt-2 border-t border-white/5 flex justify-end">
                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                                            >
                                                <span>Go to Workspace</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
