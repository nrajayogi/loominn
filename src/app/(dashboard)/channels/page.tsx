"use client";

import { Hash, Users, MessageSquare } from "lucide-react";

const CHANNELS = [
    { id: 1, name: "General", members: 1240, description: "General discussion for all creators." },
    { id: 2, name: "UI/UX Design", members: 856, description: "Share designs, get feedback, and discuss trends." },
    { id: 3, name: "Development", members: 2048, description: "Code help, tech stack discussions, and more." },
    { id: 4, name: "Announcements", members: 5000, description: "Official updates from the Loominn team." },
    { id: 5, name: "Jobs", members: 450, description: "Find work or hire talent." },
];

export default function ChannelsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Channels</h1>
                    <p className="text-zinc-400">Join communities to connect with like-minded professionals.</p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
                    Create Channel
                </button>
            </div>

            <div className="grid gap-4">
                {CHANNELS.map((channel) => (
                    <div
                        key={channel.id}
                        className="group flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-primary/10 transition-colors">
                                <Hash size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{channel.name}</h3>
                                <p className="text-sm text-zinc-400">{channel.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-zinc-500">
                            <div className="flex items-center gap-1.5">
                                <Users size={16} />
                                <span>{channel.members}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MessageSquare size={16} />
                                <span>Active</span>
                            </div>
                            <button className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                Join
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
