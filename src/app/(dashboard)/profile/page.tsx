"use client";

import { Share2, MoreHorizontal, Heart, Award, Image, Link as LinkIcon, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const USER_PROJECTS = [
    {
        id: 1,
        title: "I am new to this channel",
        description: "Hello 👋 Just joined Loominn and excited to connect with everyone here! I'm a full-stack developer working on some cool AI projects.",
        author: "Rajayogi Nandina",
        image: "/placeholder-1.jpg",
        votes: 24,
        comments: 5,
        tags: ["Introduction", "Developer"],
        color: "from-blue-500 to-purple-600",
        role: "Lead Developer",
        likes: 124,
        updated: "2 days ago"
    }
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("Projects");
    const [posts, setPosts] = useState([
        { id: 1, content: "Just deployed the new version of the Loominn platform! 🚀 The new holographic navigation is a game changer. Check it out and let me know what you think. #webdev #uiux #react", time: "2 hours ago", likes: 24, comments: 5, shares: 2 },
        { id: 2, content: "Working on some exciting new features for the dashboard. Stay tuned! 💻", time: "5 hours ago", likes: 12, comments: 2, shares: 0 }
    ]);
    const [newPostContent, setNewPostContent] = useState("");

    const handlePostSubmit = () => {
        if (!newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            content: newPostContent,
            time: "Just now",
            likes: 0,
            comments: 0,
            shares: 0
        };

        setPosts([newPost, ...posts]);
        setNewPostContent("");
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="flex items-end gap-6">
                        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center text-zinc-400 text-3xl font-bold relative z-10 shadow-2xl">
                            RN
                        </div>
                        <div className="mb-2">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-1">Rajayogi Nandina</h1>
                            <p className="text-zinc-300 text-lg">Full Stack Developer • UI/UX Enthusiast</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Stats Column */}
                <div className="space-y-6">
                    {/* Skill Mastery Card (New) */}
                    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <Award className="text-yellow-500" /> Skill Mastery
                        </h2>
                        <p className="text-xs text-blue-200 mb-4">Cumulative Score across all projects</p>

                        <div className="text-center py-4">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                                945
                            </div>
                            <div className="text-sm font-bold text-white">React Specialist</div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-xs text-zinc-300">
                                <span>Next.js</span>
                                <span>Lvl 85</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[85%]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-zinc-300">
                                <span>UI Design</span>
                                <span>Lvl 72</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[72%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-4">Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 text-center">
                                <div className="text-2xl font-bold text-white">12</div>
                                <div className="text-xs text-zinc-500">Projects</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 text-center">
                                <div className="text-2xl font-bold text-white">1.2k</div>
                                <div className="text-xs text-zinc-500">Followers</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 text-center">
                                <div className="text-2xl font-bold text-white">450</div>
                                <div className="text-xs text-zinc-500">Following</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 text-center">
                                <div className="text-2xl font-bold text-white">89</div>
                                <div className="text-xs text-zinc-500">Reputation</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "Python", "UI Design"].map((skill) => (
                                <span key={skill} className="px-3 py-1 rounded-full bg-white/5 text-zinc-300 text-sm border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="md:col-span-2 xl:col-span-3 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-white/10 pb-1">
                        {["Projects", "Posts", "About"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-lg font-bold transition-colors relative ${activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === "Projects" && (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
                                <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {USER_PROJECTS.map((project) => (
                                    <div key={project.id} className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20">
                                        <div className={`h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <div className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer">
                                                    <Share2 size={14} />
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer">
                                                    <MoreHorizontal size={14} />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4">
                                                <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs text-white border border-white/10">
                                                    {project.role}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                                <div className="flex items-center gap-1 text-zinc-500">
                                                    <Heart size={14} className="fill-current" />
                                                    <span className="text-xs">{project.likes}</span>
                                                </div>
                                            </div>
                                            <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="text-xs text-zinc-500">Updated {project.updated}</div>
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="h-6 w-6 rounded-full bg-zinc-800 border-2 border-zinc-900"></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === "Posts" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Create Post Input */}
                            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">RN</div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="What's on your mind?"
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handlePostSubmit()}
                                            className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg mb-4"
                                        />
                                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                            <div className="flex gap-4 text-blue-400">
                                                <button aria-label="Add image" className="hover:text-blue-300 transition-colors"><Image size={20} /></button>
                                                <button aria-label="Add link" className="hover:text-blue-300 transition-colors"><LinkIcon size={20} /></button>
                                            </div>
                                            <button
                                                onClick={handlePostSubmit}
                                                disabled={!newPostContent.trim()}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold text-sm transition-colors"
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Posts */}
                            {posts.map((post) => (
                                <div key={post.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex gap-4 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">RN</div>
                                        <div>
                                            <div className="font-bold text-white">Rajayogi Nandina</div>
                                            <div className="text-xs text-zinc-500">{post.time}</div>
                                        </div>
                                    </div>
                                    <p className="text-zinc-300 mb-4">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center gap-6 text-zinc-500 text-sm border-t border-white/5 pt-4">
                                        <button className="flex items-center gap-2 hover:text-red-500 transition-colors"><Heart size={18} /> {post.likes}</button>
                                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors"><MessageSquare size={18} /> {post.comments}</button>
                                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors"><Share2 size={18} /> Share</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
