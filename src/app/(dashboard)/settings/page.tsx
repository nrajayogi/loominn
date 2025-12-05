"use client";

import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="max-w-xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/profile">
                    <button className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors" aria-label="Back to Profile">
                        <ChevronLeft size={24} />
                    </button>
                </Link>
                <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            </div>

            {/* Form */}
            <form className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-purple-500/20">
                        RN
                    </div>
                    <button type="button" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                        Change Photo
                    </button>
                </div>

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-400">Display Name</label>
                    <input
                        type="text"
                        id="name"
                        defaultValue="Rajayogi Nandina"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-zinc-400">Username</label>
                    <input
                        type="text"
                        id="username"
                        defaultValue="rajayogi_nandina"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium text-zinc-400">Bio</label>
                    <textarea
                        id="bio"
                        rows={4}
                        defaultValue="Full-stack developer passionate about AI and building beautiful user interfaces. Building the future of collaboration at Loominn."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-zinc-400">Location</label>
                    <input
                        type="text"
                        id="location"
                        defaultValue="San Francisco, CA"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium text-zinc-400">Website</label>
                    <input
                        type="url"
                        id="website"
                        defaultValue="https://github.com/rajayogi"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
