"use client";

import { Clock, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

const HISTORY_ITEMS = [
    {
        id: 1,
        title: "Welcome to the channel",
        author: "Siddharth",
        time: "1m ago",
        type: "view"
    },
    {
        id: 2,
        title: "I am new to this channel",
        author: "Rajayogi Nandina",
        time: "1w ago",
        type: "view"
    },
    {
        id: 3,
        title: "Design System 2.0 Proposal",
        author: "Design Team",
        time: "2w ago",
        type: "comment"
    },
];

export default function HistoryPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">History</h1>
                    <p className="text-zinc-400">View your recent activity and visited projects.</p>
                </div>
                <button className="text-red-400 hover:text-red-300 px-4 py-2 rounded-lg font-medium hover:bg-red-400/10 transition-colors flex items-center gap-2">
                    <Trash2 size={18} />
                    Clear History
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl divide-y divide-border">
                {HISTORY_ITEMS.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                <Clock size={18} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm mb-0.5">{item.title}</h4>
                                <p className="text-xs text-zinc-500">
                                    by <span className="text-zinc-300">{item.author}</span> • {item.time}
                                </p>
                            </div>
                        </div>

                        <Link
                            href="#"
                            className="opacity-0 group-hover:opacity-100 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-all"
                        >
                            View Project
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ))}
            </div>

            <div className="text-center pt-8">
                <p className="text-zinc-500 text-sm">Only showing history from the last 30 days.</p>
            </div>
        </div>
    );
}
