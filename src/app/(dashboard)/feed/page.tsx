"use client";

import { ProjectCard } from "@/components/ui/ProjectCard";
import { Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PROJECTS = [
    {
        id: 1,
        title: "I am new to this channel",
        description: "Hello 👋 Just joined Loominn and excited to connect with everyone here! I'm a full-stack developer working on some cool AI projects.",
        author: "Rajayogi Nandina",
        image: "/placeholder-1.jpg",
        votes: 24,
        comments: 5,
        tags: ["Introduction", "Developer"]
    },
    {
        id: 2,
        title: "Welcome to the channel",
        description: "Hey all welcome! Feel free to share your projects and ideas. This is a safe space for creativity.",
        author: "Siddharth",
        image: "/placeholder-2.jpg",
        votes: 12,
        comments: 2,
        tags: ["Announcement", "Community"]
    },
    {
        id: 3,
        title: "👋 Welcome to Loominn — where ideas grow into something greater.",
        description: "We're thrilled to finally open the doors to our platform! Loominn is built for those who love to create, share, and collaborate. Check out our roadmap for upcoming features.",
        author: "Loominn Team",
        image: "/placeholder-3.jpg",
        votes: 156,
        comments: 42,
        tags: ["Official", "Launch"]
    }
];

export default function FeedPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = PROJECTS.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl p-4 -mx-4 z-40 border-b border-white/5">
                <h1 className="text-xl font-bold text-white">Home</h1>
                <Link href="/profile">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-black cursor-pointer hover:scale-105 transition-transform" aria-label="Profile">
                        RN
                    </div>
                </Link>
            </div>

            {/* Stories / Quick Actions Placeholder */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-zinc-800 border-2 border-blue-500 flex items-center justify-center text-blue-500">
                    <Plus size={24} />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0 w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 p-0.5">
                        <div className="w-full h-full rounded-full bg-zinc-700"></div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3 sticky top-[73px] bg-black/80 backdrop-blur-xl py-2 -mx-4 px-4 z-30">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <button className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" aria-label="Filter">
                    <Filter size={18} />
                </button>
            </div>

            {/* Feed Stream */}
            <div className="space-y-6">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        author={project.author}
                        image={project.image}
                        votes={project.votes}
                        comments={project.comments}
                        tags={project.tags}
                    />
                ))}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        No projects found matching "{searchQuery}"
                    </div>
                )}
            </div>

            <div className="text-center py-8 text-zinc-500 text-sm">
                You&apos;re all caught up!
            </div>
        </div>
    );
}
