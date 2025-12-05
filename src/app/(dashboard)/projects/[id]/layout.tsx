"use client";

import { ChevronLeft, MoreHorizontal, Star, Search, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
    { label: "Overview", href: "" },
    { label: "Board", href: "/board" },
    { label: "Timeline", href: "/timeline" },
    { label: "StoryBoard", href: "/storyboard" },
    { label: "Members", href: "/members" },
    { label: "Chat", href: "/chat" },
    { label: "Files", href: "/files" },
];

export default function ProjectLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const pathname = usePathname();
    const projectId = params.id;
    const baseUrl = `/projects/${projectId}`;

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                        H
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-white">Hiring</h1>
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs">planning</span>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <span>1 members</span>
                            <Star size={14} className="text-zinc-600 cursor-pointer hover:text-yellow-500" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                    <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
                        <Bell size={20} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-zinc-800 overflow-x-auto">
                <div className="flex items-center gap-1 min-w-max">
                    {TABS.map((tab) => {
                        const href = `${baseUrl}${tab.href}`;
                        // Exact match for overview (baseUrl), startsWith for others
                        const isActive = tab.href === ""
                            ? pathname === baseUrl
                            : pathname.startsWith(href);

                        return (
                            <Link
                                key={tab.label}
                                href={href}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                                    isActive
                                        ? "border-blue-500 text-blue-500"
                                        : "border-transparent text-zinc-400 hover:text-white hover:border-zinc-700"
                                )}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {children}
        </div>
    );
}
