"use client";

import { ChevronLeft, Send, Image as ImageIcon, Hash } from "lucide-react";
import Link from "next/link";

export default function CreatePostPage() {
    return (
        <div className="max-w-xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/feed">
                    <button className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors" aria-label="Back to Feed">
                        <ChevronLeft size={24} />
                    </button>
                </Link>
                <h1 className="text-2xl font-bold text-white">Create Post</h1>
            </div>

            {/* Form */}
            <form className="space-y-6">
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Title your masterpiece..."
                        className="w-full bg-transparent border-none text-3xl font-bold text-white placeholder:text-zinc-700 focus:outline-none px-0"
                    />
                </div>

                <div className="space-y-2">
                    <textarea
                        placeholder="What's on your mind?"
                        rows={8}
                        className="w-full bg-transparent border-none text-lg text-zinc-300 placeholder:text-zinc-700 focus:outline-none resize-none px-0"
                    />
                </div>

                {/* Media & Tags */}
                <div className="flex gap-4">
                    <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <ImageIcon size={20} />
                        <span className="text-sm font-medium">Add Image</span>
                    </button>
                    <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <Hash size={20} />
                        <span className="text-sm font-medium">Add Tags</span>
                    </button>
                </div>

                {/* Submit */}
                <div className="pt-8 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Send size={20} />
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}
