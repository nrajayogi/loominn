"use client";

import { Plus, Search, LayoutGrid, List, Filter, ArrowUpRight, FolderGit2, CheckCircle2, Users, Layers } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useGlobalState } from "@/context/GlobalStateContext";

export default function MyProjectsPage() {
    const { userProjects, applications, workspaceTasks, userProfile } = useGlobalState();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Dynamic stats computation
    const totalProjects = userProjects.length;
    const activeProjects = userProjects.filter(p => p.status === 'approved').length;
    const pendingReview = userProjects.filter(p => p.status === 'in_review' || p.status === 'submitted').length;
    const totalTasks = workspaceTasks.length;

    const categories = useMemo(() => {
        const cats = new Set<string>();
        userProjects.forEach(p => {
            if (p.category) cats.add(p.category);
        });
        return ["all", ...Array.from(cats)];
    }, [userProjects]);

    const filteredProjects = useMemo(() => {
        return userProjects.filter(project => {
            const matchesSearch =
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && project.status === "approved") ||
                (statusFilter === "review" && (project.status === "in_review" || project.status === "submitted"));

            const matchesCategory =
                categoryFilter === "all" ||
                project.category?.toLowerCase() === categoryFilter.toLowerCase();

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [userProjects, searchQuery, statusFilter, categoryFilter]);

    return (
        <div className="space-y-8 px-4 md:px-8 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">My Project Workspaces</h1>
                    <p className="text-zinc-400 text-sm">Manage collaborative builds, roles, milestones, and peer submissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/projects/status">
                        <button className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors text-sm font-medium">
                            Application Status ({applications.length})
                        </button>
                    </Link>
                    <Link href="/projects/create">
                        <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-95 text-sm">
                            <Plus size={18} />
                            New Project
                        </button>
                    </Link>
                </div>
            </div>

            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Workspaces</span>
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                            <LayoutGrid size={18} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{totalProjects}</div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">Created or led by you</span>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Active Builds</span>
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 size={18} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{activeProjects}</div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">Workspaces in execution</span>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Pending Review</span>
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                            <Filter size={18} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{pendingReview}</div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">Community peer proposals</span>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Workspace Tasks</span>
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                            <List size={18} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white">{totalTasks}</div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">Kanban sprint commitments</span>
                </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search your workspaces by title, description or tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-500"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                            statusFilter === "all"
                                ? "bg-white text-black font-bold"
                                : "bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        All Status
                    </button>
                    <button
                        onClick={() => setStatusFilter("active")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                            statusFilter === "active"
                                ? "bg-emerald-500 text-white font-bold"
                                : "bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        Active Builds
                    </button>
                    <button
                        onClick={() => setStatusFilter("review")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                            statusFilter === "review"
                                ? "bg-amber-500 text-white font-bold"
                                : "bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white"
                        }`}
                    >
                        Under Review
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/30 border border-white/5 rounded-2xl p-8">
                    <FolderGit2 className="mx-auto text-zinc-600 mb-3" size={40} />
                    <h3 className="text-base font-bold text-white mb-1">No Projects Found</h3>
                    <p className="text-zinc-400 text-xs max-w-sm mx-auto mb-6">
                        {searchQuery
                            ? `No projects matching "${searchQuery}". Try a different keyword.`
                            : "You haven't launched any collaborative workspaces yet."}
                    </p>
                    <div className="flex justify-center gap-3">
                        <Link href="/projects/create">
                            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/30">
                                Launch Project Workspace
                            </button>
                        </Link>
                        <Link href="/discover">
                            <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold rounded-xl text-xs transition-colors">
                                Discover Open Roles
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 group flex flex-col justify-between shadow-xl"
                        >
                            {/* Card Header */}
                            <div className={`h-40 bg-gradient-to-br ${project.color || "from-blue-600 to-indigo-700"} p-5 relative flex flex-col justify-between`}>
                                <div className="flex justify-between items-start">
                                    <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-white border border-white/10">
                                        {project.status === "approved" ? "Active Workspace" : project.status || "In Review"}
                                    </span>
                                    <Link href={`/projects/${project.id === "loominn-rebuild" ? "loominn-rebuild" : project.id}`}>
                                        <button
                                            aria-label={`View ${project.title}`}
                                            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"
                                        >
                                            <ArrowUpRight size={14} />
                                        </button>
                                    </Link>
                                </div>
                                <div className="text-white">
                                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">{project.category || "Workspace"}</span>
                                    <h3 className="text-xl font-bold leading-snug drop-shadow-md">{project.title}</h3>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-3">
                                        {project.description}
                                    </p>
                                    {project.roles && project.roles.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {project.roles.map((r: any, idx: number) => (
                                                <span key={idx} className="text-[10px] bg-white/5 text-zinc-300 px-2 py-0.5 rounded border border-white/5">
                                                    {r.title}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <div className="flex items-center justify-between text-xs text-zinc-500">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} />
                                            <span>{project.members || 1} contributors</span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-semibold uppercase">
                                            {project.difficulty || "verified"}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Link
                                            href={`/projects/${project.id === "loominn-rebuild" ? "loominn-rebuild" : project.id}/board`}
                                            className="flex-1"
                                        >
                                            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20">
                                                <Layers size={13} />
                                                Board
                                            </button>
                                        </Link>
                                        <Link
                                            href={`/projects/${project.id === "loominn-rebuild" ? "loominn-rebuild" : project.id}`}
                                            className="flex-1"
                                        >
                                            <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-semibold transition-colors">
                                                Overview
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
