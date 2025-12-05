"use client";

import { Plus, Search, LayoutGrid, List, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PROJECTS = [
    {
        id: "hiring",
        title: "Hiring",
        description: "Project",
        status: "planning",
        members: 1,
        updated: "10 days ago",
        difficulty: "beginner",
        color: "from-blue-500 to-purple-600",
        initial: "H"
    },
    {
        id: "sample-logo",
        title: "sample logo",
        description: "Project",
        status: "planning",
        members: 1,
        updated: "about 1 month ago",
        difficulty: "beginner",
        color: "from-purple-500 to-pink-600",
        initial: "S"
    }
];

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = PROJECTS.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-zinc-400">Discover, manage, and collaborate on projects</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/projects/status">
                        <button className="px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
                            Check Status
                        </button>
                    </Link>
                    <Link href="/projects/create">
                        <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                            <Plus size={18} />
                            New Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Projects", value: "2", icon: LayoutGrid },
                    { label: "Active Projects", value: "0", icon: Filter },
                    { label: "Total Members", value: "2", icon: List },
                    { label: "Completion Rate", value: "0%", icon: Plus },
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl">
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-zinc-400 text-sm">{stat.label}</span>
                            <div className="p-2 rounded-lg bg-white/5 text-zinc-400">
                                <stat.icon size={18} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {["All Categories", "All Levels", "All Status"].map((filter) => (
                        <button key={filter} className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white whitespace-nowrap transition-colors">
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group cursor-pointer">
                            {/* Card Header */}
                            <div className={`h-48 bg-gradient-to-br ${project.color} p-6 relative`}>
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-medium text-white">
                                    {project.status}
                                </div>
                                <div className="absolute top-4 right-4 flex gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                </div>
                                <div className="h-full flex items-center justify-center flex-col">
                                    <h3 className="text-4xl font-bold text-white mb-2">{project.initial}</h3>
                                    <p className="text-white/80 text-sm">{project.description}</p>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4">{project.title}</h3>
                                <div className="flex items-center justify-between text-sm text-zinc-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">
                                            {project.members}
                                        </div>
                                        <span>{project.updated}</span>
                                    </div>
                                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-medium">
                                        {project.difficulty}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
                                        RN
                                    </div>
                                    <div>
                                        <p className="text-sm text-white">Rajayogi Nandina</p>
                                        <p className="text-xs text-zinc-500">Owner</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
