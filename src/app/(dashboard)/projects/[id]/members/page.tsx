"use client";

import { Search, UserPlus, MoreHorizontal, Shield, Code, PenTool, BarChart, Hash, Award } from "lucide-react";
import { useState } from "react";

const ROLES = [
    { id: "frontend", label: "Frontend Developer", icon: Code, color: "text-blue-400" },
    { id: "backend", label: "Backend Developer", icon: Hash, color: "text-green-400" },
    { id: "fullstack", label: "Full Stack Developer", icon: Code, color: "text-purple-400" },
    { id: "designer", label: "UI/UX Designer", icon: PenTool, color: "text-pink-400" },
    { id: "marketer", label: "Marketer", icon: BarChart, color: "text-yellow-400" },
    { id: "social", label: "Social Media Manager", icon: Hash, color: "text-orange-400" },
    { id: "data", label: "Data Scientist", icon: BarChart, color: "text-cyan-400" },
];

export default function ProjectMembersPage() {
    const [selectedRole, setSelectedRole] = useState("fullstack");
    const [skillScore, setSkillScore] = useState(85);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-white">Project Members</h2>
                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400">1 member</span>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium flex items-center gap-2">
                        <UserPlus size={16} />
                        Join Requests
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                        <UserPlus size={16} />
                        Invite Member
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option>All Roles</option>
                    {ROLES.map(role => <option key={role.id} value={role.id}>{role.label}</option>)}
                </select>
                <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                    <option>All Status</option>
                    <option>Online</option>
                    <option>Offline</option>
                </select>
            </div>

            {/* Members List */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-lg relative">
                            RN
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-zinc-900"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white">Rajayogi Nandina</h3>
                                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs">You</span>
                            </div>
                            <div className="text-sm text-zinc-500">@rajayogi_nandina • rajayogi2000@gmail.com • Offline</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold flex items-center gap-1">
                                    <Shield size={12} /> OWNER
                                </span>
                                <span className="text-xs text-zinc-600">Joined 24/11/2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Role Assignment UI (Demo) */}
                    <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-zinc-500 font-medium uppercase">Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="bg-black/40 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                            >
                                {ROLES.map(role => (
                                    <option key={role.id} value={role.id}>{role.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 w-24">
                            <label className="text-xs text-zinc-500 font-medium uppercase flex items-center gap-1">
                                <Award size={12} /> Skill Score
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={skillScore}
                                    onChange={(e) => setSkillScore(parseInt(e.target.value))}
                                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <span className="text-xs font-bold text-blue-400">{skillScore}</span>
                            </div>
                        </div>

                        <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
