"use client";

import { useState } from "react";
import { Search, MoreHorizontal, UserCheck, Briefcase } from "lucide-react";

export default function NetworkPage() {
    const [activeTab, setActiveTab] = useState<"partners" | "requests">("partners");

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Network</h1>
                    <p className="text-zinc-400">Manage your partners and pending requests.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search partners..."
                        className="bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab("partners")}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "partners" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                    Partners (154)
                    {activeTab === "partners" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
                </button>
                <button
                    onClick={() => setActiveTab("requests")}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "requests" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                    Requests (3)
                    {activeTab === "requests" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeTab === "partners" ? (
                    // Mock Partners
                    [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:border-white/10 transition-colors">
                            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                                JD
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white">John Doe {i}</h3>
                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                    <Briefcase size={12} /> Senior Developer
                                </p>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors" title="More Options">
                                <MoreHorizontal size={20} />
                            </button>
                            <button className="p-2 hover:bg-blue-600/20 rounded-lg text-blue-500 hover:text-blue-400 transition-colors" title="Partnership Status">
                                <UserCheck size={20} />
                            </button>
                        </div>
                    ))
                ) : (
                    // Mock Requests
                    [1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
                                    AU
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Alex User {i}</h3>
                                    <p className="text-sm text-zinc-500">UX Designer at TechCo</p>
                                    <p className="text-xs text-zinc-600 mt-1">24 Mutual Partners</p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full mt-2">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl font-medium transition-colors">
                                    Partner
                                </button>
                                <button className="flex-1 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white py-2 rounded-xl font-medium transition-colors">
                                    Ignore
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
