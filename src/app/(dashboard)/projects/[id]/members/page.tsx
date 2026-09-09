"use client";

import { useState, use } from "react";
import { Users, UserPlus, Check, X, Shield, ExternalLink, Award, Sparkles, Clock } from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { ProjectApplication } from "@/lib/types/schema";

const CURRENT_MEMBERS = [
    {
        id: "m-1",
        name: "Rajayogi Nandina",
        role: "Lead Architect",
        handle: "@rajayogi",
        avatar: "",
        orbitScore: 6800,
        joinedAt: "Project Genesis"
    },
    {
        id: "m-2",
        name: "Pratyusha Sharma",
        role: "Lead Product Designer",
        handle: "@pratyu",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        orbitScore: 4850,
        joinedAt: "2 weeks ago"
    },
    {
        id: "m-3",
        name: "Siddharth Dev",
        role: "Distributed Systems Lead",
        handle: "@siddharth",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        orbitScore: 5120,
        joinedAt: "1 week ago"
    }
];

export default function ProjectMembersPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawProjectId } = use(params);
    const projectId = decodeURIComponent(rawProjectId);

    const { applications, reviewApplication, projectMembers } = useGlobalState();
    const [activeTab, setActiveTab] = useState<"members" | "applicants">("members");

    const activeMembers = projectMembers[projectId] || projectMembers["loominn-rebuild"] || CURRENT_MEMBERS;

    const projectTitle = projectId
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    // Get applications matching this project
    const projectApplications = applications.filter(a => 
        String(a.projectId).toLowerCase() === projectId.toLowerCase() ||
        a.projectTitle.toLowerCase() === projectTitle.toLowerCase() ||
        String(a.projectId).toLowerCase() === "loominn-rebuild"
    );

    const pendingCount = projectApplications.filter(a => a.status === "submitted" || a.status === "reviewing").length;

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white">Project Collaboration & Team</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/30">
                        {activeMembers.length} Active Collaborators
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setActiveTab("members")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === "members"
                                ? "bg-white text-black font-bold shadow"
                                : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        Active Members ({activeMembers.length})
                    </button>

                    <button
                        onClick={() => setActiveTab("applicants")}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            activeTab === "applicants"
                                ? "bg-purple-600 text-white font-bold shadow"
                                : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        <span>Applicant Review Queue</span>
                        {pendingCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* TAB 1: ACTIVE MEMBERS */}
            {activeTab === "members" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeMembers.map(member => (
                        <div 
                            key={member.id}
                            className="bg-zinc-900/60 border border-white/5 hover:border-white/15 rounded-2xl p-5 space-y-4 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                    {member.avatar ? (
                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        member.name.charAt(0)
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-white text-sm truncate">{member.name}</h4>
                                    <p className="text-xs text-zinc-400 truncate">{member.role}</p>
                                    <p className="text-[11px] text-zinc-500 font-mono">{member.handle}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                                <span className="font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30">
                                    {member.orbitScore.toLocaleString()} Orbit
                                </span>
                                <span className="text-zinc-500 text-[11px]">
                                    Joined: {member.joinedAt}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 2: APPLICANT REVIEW QUEUE */}
            {activeTab === "applicants" && (
                <div className="space-y-4">
                    <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl p-4 text-xs text-purple-200">
                        <strong className="text-white">Peer Applicant Review:</strong> Evaluate candidates based on verified Orbit Score, project motivation, and submitted proof-of-work evidence. No gatekeeping without transparent feedback.
                    </div>

                    {projectApplications.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-zinc-900/30 border border-white/5 rounded-2xl space-y-2">
                            <Clock size={24} className="mx-auto text-zinc-500" />
                            <h4 className="text-white font-bold text-sm">No Pending Applications</h4>
                            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                                All submitted role applications for this workspace have been reviewed.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projectApplications.map(app => {
                                const isEligible = app.applicantScore >= app.requiredScore;

                                return (
                                    <div 
                                        key={app.id}
                                        className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex items-start gap-3.5">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {app.applicantImage ? (
                                                        <img src={app.applicantImage} alt={app.applicantName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        app.applicantName.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-bold text-white text-base">{app.applicantName}</h4>
                                                        <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                                                            Role: {app.roleTitle}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                                                        <span>Submitted: {app.submittedAt}</span>
                                                        <span>•</span>
                                                        <span className="font-mono text-purple-300">
                                                            Score: {app.applicantScore.toLocaleString()} (Threshold: {app.requiredScore.toLocaleString()})
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
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

                                        {/* Motivation / Impact */}
                                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-1 text-xs">
                                            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                                                Applicant Motivation & Proposed Contribution
                                            </span>
                                            <p className="text-zinc-200 leading-relaxed pt-1">
                                                &ldquo;{app.motivation}&rdquo;
                                            </p>
                                        </div>

                                        {/* Evidence Links */}
                                        {app.evidence && app.evidence.length > 0 && (
                                            <div className="space-y-1.5">
                                                <span className="text-[10px] font-semibold uppercase text-zinc-400">
                                                    Submitted Portfolio & Proof Artifacts:
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {app.evidence.map((url, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-blue-500/30 transition-all"
                                                        >
                                                            <span>{url}</span>
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Review Actions */}
                                        {app.status !== "accepted" && app.status !== "declined" && (
                                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
                                                <button
                                                    onClick={() => reviewApplication(app.id, "declined", "Thank you for your interest. We are proceeding with another applicant.")}
                                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <X size={14} />
                                                    <span>Decline</span>
                                                </button>

                                                <button
                                                    onClick={() => reviewApplication(app.id, "accepted", "Application accepted! Welcome to the workspace.")}
                                                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/30"
                                                >
                                                    <Check size={14} />
                                                    <span>Accept & Welcome to Team</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
