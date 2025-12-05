"use client";

import { Bookmark, Folder, MoreHorizontal, ArrowRight } from "lucide-react";

const BOOKMARKS = [
    { id: 1, title: "Design Inspiration 2024", count: 12, updated: "2 days ago" },
    { id: 2, title: "React Components", count: 45, updated: "1 week ago" },
    { id: 3, title: "Typography Resources", count: 8, updated: "3 weeks ago" },
    { id: 4, title: "AI Tools", count: 15, updated: "1 month ago" },
];

export default function BookmarksPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Bookmarks</h1>
                    <p className="text-zinc-400">Organize and save your favorite projects and resources.</p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2">
                    <Folder size={18} />
                    New Collection
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BOOKMARKS.map((collection) => (
                    <div
                        key={collection.id}
                        className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer flex flex-col h-48"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-primary/10 transition-colors">
                                <Bookmark size={24} />
                            </div>
                            <button className="text-zinc-500 hover:text-white transition-colors" aria-label="Collection Options">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="mt-auto">
                            <h3 className="font-bold text-white text-lg mb-1">{collection.title}</h3>
                            <div className="flex items-center justify-between text-sm text-zinc-500">
                                <span>{collection.count} items</span>
                                <span>Updated {collection.updated}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Placeholder */}
                <button className="border border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-zinc-500 hover:text-white hover:border-zinc-700 transition-all h-48">
                    <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center">
                        <Folder size={24} />
                    </div>
                    <span className="font-medium">Create New Collection</span>
                </button>
            </div>
        </div>
    );
}
