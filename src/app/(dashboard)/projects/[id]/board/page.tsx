"use client";

import { Plus, MoreHorizontal } from "lucide-react";

const COLUMNS = [
    { id: "todo", title: "To Do", count: 0, color: "bg-zinc-800" },
    { id: "progress", title: "In Progress", count: 0, color: "bg-blue-900/20" },
    { id: "review", title: "In Review", count: 0, color: "bg-yellow-900/20" },
    { id: "done", title: "Done", count: 0, color: "bg-green-900/20" },
];

export default function ProjectBoardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-white">Task Board</h2>
                    <span className="px-2 py-1 rounded-full bg-zinc-800 text-xs text-zinc-400">Offline</span>
                    <span className="text-sm text-zinc-500">0 tasks</span>
                </div>
                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                    <Plus size={16} />
                    Add Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[600px]">
                {COLUMNS.map((col) => (
                    <div key={col.id} className={`rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden ${col.color === 'bg-zinc-800' ? 'bg-zinc-900/50' : col.color}`}>
                        {/* Column Header */}
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white">{col.title}</h3>
                                <span className="px-2 py-0.5 rounded bg-black/20 text-xs text-zinc-400">{col.count}</span>
                            </div>
                            <button className="text-zinc-500 hover:text-white">
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 p-4 flex flex-col items-center justify-center text-zinc-500 gap-2">
                            <Plus size={24} className="opacity-20" />
                            <p className="text-sm">No tasks in {col.title.toLowerCase()}</p>
                            <button className="text-xs text-zinc-600 hover:text-zinc-400">Add first task</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
