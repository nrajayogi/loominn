"use client";

import { UserPlus, Users, Search, RefreshCw } from "lucide-react";

const SUGGESTED_PEOPLE = [
    { id: 1, name: "Pratyusha Sharma", handle: "@pratyu", role: "Product Designer" },
    { id: 2, name: "Jahnavi Injam", handle: "@jahnavichinni2222", role: "Frontend Developer" },
    { id: 3, name: "Siddharth Dev", handle: "@siddharth", role: "Full Stack Engineer" },
];

const QUICK_SUGGESTIONS = [
    { id: 4, name: "Pratyusha Sharma", handle: "@pratyu" },
    { id: 5, name: "Jahnavi Injam", handle: "@jahnavichinni..." },
];

export default function SocialPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Discover People</h1>
                <p className="text-zinc-400">Connect with interesting people and grow your network.</p>
            </div>

            {/* Complete Profile Banner (Reused pattern) */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold text-white mb-1">Complete Your Profile</h2>
                    <p className="text-sm text-blue-200 mb-4">Select your technology interests to get personalized content recommendations and connect with like-minded developers.</p>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Select Interests
                    </button>
                </div>
                <button className="text-blue-400 hover:text-blue-300" aria-label="Dismiss Banner">×</button>
            </div>

            {/* Search */}
            <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                    type="text"
                    className="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="Search for people..."
                />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-border">
                <button className="pb-3 text-sm font-medium text-blue-500 border-b-2 border-blue-500 flex items-center gap-2">
                    <UserPlus size={16} />
                    Suggested
                </button>
                <button className="pb-3 text-sm font-medium text-zinc-500 hover:text-white transition-colors">Trending</button>
                <button className="pb-3 text-sm font-medium text-zinc-500 hover:text-white transition-colors">Discover</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <UserPlus size={18} className="text-blue-500" />
                            People you might want to partner with
                        </h3>
                        <button className="text-zinc-500 hover:text-white transition-colors" title="Refresh Suggestions">
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    <div className="bg-card border border-border rounded-xl divide-y divide-border">
                        {SUGGESTED_PEOPLE.map((person) => (
                            <div key={person.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                                        {person.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{person.name}</h4>
                                        <p className="text-xs text-zinc-500">{person.handle}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                                        <UserPlus size={14} />
                                        Partner
                                    </button>
                                    <button className="text-zinc-500 hover:text-white px-2" aria-label="Dismiss">×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Network Stats */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold text-white mb-4">Your Network</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Partners</p>
                                    <p className="text-xl font-bold text-white">3</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <UserPlus size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">Pending</p>
                                    <p className="text-xl font-bold text-white">3</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <UserPlus size={16} className="text-blue-500" />
                            Quick suggestions
                        </h3>
                        <div className="space-y-4">
                            {QUICK_SUGGESTIONS.map((person) => (
                                <div key={person.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-bold">
                                            {person.name[0]}
                                        </div>
                                        <div className="max-w-[100px]">
                                            <h4 className="font-bold text-white text-xs truncate">{person.name}</h4>
                                            <p className="text-[10px] text-zinc-500 truncate">{person.handle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-[10px] font-medium transition-colors">
                                            Partner
                                        </button>
                                        <button className="text-zinc-500 hover:text-white px-1" aria-label="Dismiss">×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
