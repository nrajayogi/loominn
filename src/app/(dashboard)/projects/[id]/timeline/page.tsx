"use client";

import { use } from "react";
import { Plus, Calendar, ChevronRight, CheckCircle2, Clock, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";

const PHASES = [
    { id: 1, name: "Genesis & System Architecture", start: "Dec 01", end: "Dec 15", status: "completed", progress: 100, color: "bg-blue-500", domain: "Distributed Systems" },
    { id: 2, name: "Core Protocol & Real-time Engine", start: "Dec 16", end: "Jan 10", status: "in-progress", progress: 70, color: "bg-purple-500", domain: "Networking" },
    { id: 3, name: "Peer Verification & Audit Proofs", start: "Jan 11", end: "Feb 15", status: "in-progress", progress: 40, color: "bg-emerald-500", domain: "Security" },
    { id: 4, name: "Public Staking & Network Discovery", start: "Feb 01", end: "Feb 28", status: "pending", progress: 10, color: "bg-yellow-500", domain: "Ecosystem" },
    { id: 5, name: "Mainnet Federation & Production Launch", start: "Mar 01", end: "Mar 15", status: "pending", progress: 0, color: "bg-red-500", domain: "Deployment" },
];

export default function ProjectTimelinePage({
    params
}: {
    params?: Promise<{ id: string }>;
}) {
    const { workspaceTasks } = useGlobalState();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-white">Project Roadmap & Milestones</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
                        {PHASES.length} Delivery Phases
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Sprint Calendar</span>
                    </button>
                    <button className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/30 transition-all">
                        <Plus size={14} />
                        <span>Add Phase</span>
                    </button>
                </div>
            </div>

            {/* Gantt Chart Container */}
            <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 overflow-x-auto backdrop-blur-sm">
                {/* Timeline Header */}
                <div className="flex border-b border-white/5 pb-4 mb-4 min-w-[800px]">
                    <div className="w-72 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Milestone Phase</div>
                    <div className="flex-1 grid grid-cols-4 gap-4 text-xs font-mono text-zinc-400 text-center">
                        <div>Phase 1 (Dec)</div>
                        <div>Phase 2 (Jan)</div>
                        <div>Phase 3 (Feb)</div>
                        <div>Phase 4 (Mar)</div>
                    </div>
                </div>

                {/* Timeline Rows */}
                <div className="space-y-6 min-w-[800px]">
                    {PHASES.map((phase) => (
                        <div key={phase.id} className="relative group">
                            <div className="flex items-center">
                                <div className="w-72 pr-4">
                                    <div className="font-semibold text-white text-sm mb-0.5">{phase.name}</div>
                                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                                        <span>{phase.start} - {phase.end}</span>
                                        <span className={`w-1.5 h-1.5 rounded-full ${phase.color}`} />
                                        <span className="font-mono text-[10px] text-zinc-400">({phase.domain})</span>
                                    </div>
                                </div>
                                <div className="flex-1 relative h-10 bg-zinc-800/30 rounded-xl overflow-hidden flex items-center border border-white/5">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 grid grid-cols-4 gap-4 pointer-events-none">
                                        <div className="border-r border-white/5"></div>
                                        <div className="border-r border-white/5"></div>
                                        <div className="border-r border-white/5"></div>
                                        <div className="border-r border-white/5"></div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div
                                        className={`absolute h-7 rounded-lg ${phase.color} shadow-lg opacity-85 hover:opacity-100 transition-all cursor-pointer flex items-center px-3 group/bar`}
                                        style={{
                                            left: `${(phase.id - 1) * 18}%`,
                                            width: `${phase.id === 1 ? 25 : phase.id === 2 ? 35 : 22}%`
                                        }}
                                    >
                                        <span className="text-[11px] font-bold text-white whitespace-nowrap drop-shadow">
                                            {phase.progress}% Complete
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Link to Board Tasks */}
            <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Target size={18} className="text-blue-400" />
                    <div>
                        <h4 className="text-xs font-bold text-white">Deliverable Tracking Linkage</h4>
                        <p className="text-[11px] text-zinc-400">Each roadmap phase translates into Kanban sprint deliverables audited by peer reviews.</p>
                    </div>
                </div>

                <Link
                    href="./board"
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                    <span>View Sprint Board</span>
                    <ArrowRight size={13} />
                </Link>
            </div>
        </div>
    );
}
