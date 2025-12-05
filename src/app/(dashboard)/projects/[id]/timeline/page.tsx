"use client";

import { Plus, Calendar, ChevronRight } from "lucide-react";

const PHASES = [
    { id: 1, name: "Planning & Research", start: "Dec 01", end: "Dec 15", status: "completed", progress: 100, color: "bg-blue-500" },
    { id: 2, name: "Design & Prototyping", start: "Dec 16", end: "Jan 10", status: "in-progress", progress: 45, color: "bg-purple-500" },
    { id: 3, name: "Frontend Development", start: "Jan 11", end: "Feb 15", status: "pending", progress: 0, color: "bg-green-500" },
    { id: 4, name: "Backend Integration", start: "Feb 01", end: "Feb 28", status: "pending", progress: 0, color: "bg-yellow-500" },
    { id: 5, name: "Testing & QA", start: "Mar 01", end: "Mar 15", status: "pending", progress: 0, color: "bg-red-500" },
];

export default function ProjectTimelinePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-white">Project Timeline</h2>
                    <span className="px-2 py-1 rounded-full bg-zinc-800 text-xs text-zinc-400">5 Phases</span>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium flex items-center gap-2">
                        <Calendar size={16} />
                        Calendar View
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                        <Plus size={16} />
                        Add Phase
                    </button>
                </div>
            </div>

            {/* Gantt Chart Container */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 overflow-x-auto">
                {/* Timeline Header */}
                <div className="flex border-b border-white/5 pb-4 mb-4 min-w-[800px]">
                    <div className="w-64 font-medium text-zinc-500 text-sm">Phase</div>
                    <div className="flex-1 grid grid-cols-4 gap-4 text-sm text-zinc-500 text-center">
                        <div>December</div>
                        <div>January</div>
                        <div>February</div>
                        <div>March</div>
                    </div>
                </div>

                {/* Timeline Rows */}
                <div className="space-y-6 min-w-[800px]">
                    {PHASES.map((phase) => (
                        <div key={phase.id} className="relative group">
                            <div className="flex items-center">
                                <div className="w-64 pr-4">
                                    <div className="font-medium text-white text-sm mb-1">{phase.name}</div>
                                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                                        <span>{phase.start} - {phase.end}</span>
                                        <span className={`w-2 h-2 rounded-full ${phase.color}`}></span>
                                    </div>
                                </div>
                                <div className="flex-1 relative h-10 bg-zinc-800/30 rounded-lg overflow-hidden flex items-center">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 grid grid-cols-4 gap-4 pointer-events-none">
                                        <div className="border-r border-white/5"></div>
                                        <div className="border-r border-white/5"></div>
                                        <div className="border-r border-white/5"></div>
                                        <div className="border-r border-white/5"></div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div
                                        className={`absolute h-6 rounded-md ${phase.color} shadow-lg opacity-80 hover:opacity-100 transition-all cursor-pointer flex items-center px-3 group/bar`}
                                        style={{
                                            left: `${(phase.id - 1) * 15}%`,
                                            width: `${phase.id === 2 ? 30 : 20}%`
                                        }}
                                    >
                                        <span className="text-xs font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                            {phase.progress}% Complete
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
