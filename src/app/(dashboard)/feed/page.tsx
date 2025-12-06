"use client";

import { ProjectCard } from "@/components/ui/ProjectCard";
import { Filter, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useSession } from "next-auth/react";
import StoriesRail from "@/components/feed/StoriesRail";
import SuggestionNet from "@/components/feed/SuggestionNet";

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
    const { data: session } = useSession();
    const { userProfile, posts } = useGlobalState();
    const [searchQuery, setSearchQuery] = useState("");

    // Convert global posts to "ProjectCard" format to unify the feed
    const globalPostsAsProjects = posts.map(post => ({
        id: post.id,
        title: `Update from ${userProfile.name}`, // Generic title for social posts
        description: post.content,
        author: userProfile.name,
        image: userProfile.image || "",
        votes: post.likes,
        comments: post.comments,
        tags: ["Social", "Update"]
    }));

    // Combine static network projects with global user posts
    const combinedFeed = [...globalPostsAsProjects, ...PROJECTS];

    const filteredProjects = combinedFeed.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl p-4 -mx-4 z-40 border-b border-white/5">
                <h1 className="text-xl font-bold text-white">Network Feed</h1>
                <Link href="/profile">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold overflow-hidden cursor-pointer hover:scale-105 transition-transform border border-white/10" aria-label="Profile">
                        {userProfile.image || session?.user?.image ? (
                            <img src={userProfile.image || session?.user?.image || ""} alt={userProfile.name} className="w-full h-full object-cover" />
                        ) : (
                            "RN"
                        )}
                    </div>
                </Link>
            </div>

            {/* Briefs Rail */}
            <div className="-mx-4 px-4 bg-zinc-950/30 py-4 mb-4 border-b border-white/5">
                <StoriesRail />
            </div>

            {/* Search & Filter - Moved Above Orbit */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search updates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
                    />
                </div>
                <button className="px-3 rounded-xl bg-black/40 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center cursor-pointer" aria-label="Filter">
                    <Filter size={18} />
                </button>
            </div>

            {/* Creative Connection Discovery */}
            <div className="mb-6">
                <SuggestionNet />
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
                        No updates found matching "{searchQuery}"
                    </div>
                )}
            </div>

            <div className="text-center py-8 text-zinc-500 text-sm">
                You&apos;re all caught up!
            </div>
        </div>
    );
}
