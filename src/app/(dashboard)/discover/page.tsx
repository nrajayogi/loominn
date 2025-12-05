"use client";

import { Search } from "lucide-react";

const CATEGORIES = [
    "All", "Web Design", "Mobile", "Illustration", "3D", "Typography", "Branding", "Animation"
];

export default function DiscoverPage() {
    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto py-12">
                <h1 className="text-4xl font-bold text-white mb-4">Find Inspiration</h1>
                <p className="text-zinc-400 mb-8">Search through millions of projects from the world&apos;s best creative community.</p>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                        type="text"
                        className="w-full bg-card border border-border rounded-full py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-lg transition-all"
                        placeholder="Search for 'minimalist dashboard'..."
                    />
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((cat, i) => (
                    <button
                        key={cat}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${i === 0
                            ? "bg-white text-black"
                            : "bg-card border border-border text-zinc-400 hover:text-white hover:border-white/20"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500">Search results will appear here...</p>
            </div>
        </div>
    );
}
