"use client";

import { Target, CheckCircle2, Clock, Users, Plus, BarChart2, Settings } from "lucide-react";

export default function ProjectOverviewPage() {
    return (
        <div className="space-y-8">
            {/* Header Info */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-500">
                    Created 10 days ago • Updated 10 days ago • Uncategorized
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium">
                        Bookmark
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                        <Plus size={16} />
                        Add Task
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Tasks", value: "0", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Completed", value: "0", sub: "0% complete", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "In Progress", value: "0", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                    { label: "Team Members", value: "1", sub: "0 active", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
                        <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon size={20} />
                        </div>
                        <div className="text-sm text-zinc-400 mb-1">{stat.label}</div>
                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                        {stat.sub && <div className="text-xs text-zinc-500 mt-1">{stat.sub}</div>}
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl hover:bg-zinc-800/50 transition-colors text-left flex items-start gap-4 group">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Plus size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-white">Create Task</div>
                            <div className="text-sm text-zinc-500">Add a new task to the project</div>
                        </div>
                    </button>
                    <button className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl hover:bg-zinc-800/50 transition-colors text-left flex items-start gap-4 group">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <BarChart2 size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-white">View Analytics</div>
                            <div className="text-sm text-zinc-500">See detailed project analytics</div>
                        </div>
                    </button>
                    <button className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl hover:bg-zinc-800/50 transition-colors text-left flex items-start gap-4 group">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Settings size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-white">Team Settings</div>
                            <div className="text-sm text-zinc-500">Manage team members and roles</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Tasks & Team */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 min-h-[300px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white">Recent Tasks</h3>
                        <button className="text-sm text-zinc-500 hover:text-white">View All</button>
                    </div>
                    <div className="h-48 flex flex-col items-center justify-center text-zinc-500">
                        <div className="p-4 rounded-full bg-zinc-800/50 mb-3">
                            <Target size={24} />
                        </div>
                        <p>No tasks yet</p>
                        <button className="mt-2 text-sm text-blue-500 hover:underline flex items-center gap-1">
                            <Plus size={14} /> Create first task
                        </button>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 min-h-[300px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white">Team Members</h3>
                        <button className="text-sm text-zinc-500 hover:text-white">Manage Team</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                RN
                            </div>
                            <div>
                                <div className="font-medium text-white">Rajayogi Nandina</div>
                                <div className="text-xs text-zinc-500 flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">owner</span>
                                    <span>Joined 10 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
