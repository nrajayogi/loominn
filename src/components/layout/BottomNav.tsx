"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Zap,
    Compass,
    Briefcase,
    Tv,
    Users,
    Bookmark,
    Clock,
    Plus,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Zap, label: "Feed", href: "/feed" },
    { icon: Compass, label: "Explore", href: "/explore" },
    { icon: Briefcase, label: "Projects", href: "/projects" },
    { icon: Tv, label: "Channels", href: "/channels" },
    { icon: Users, label: "Social", href: "/social" },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
    { icon: Clock, label: "History", href: "/history" },
    { icon: User, label: "Profile", href: "/profile" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] lg:hidden">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group"
                        >
                            <div
                                className={cn(
                                    "p-3 rounded-xl transition-all duration-300 flex items-center justify-center",
                                    isActive
                                        ? "bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {/* Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-md border border-white/10">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                <div className="w-px h-8 bg-white/10 mx-1" />

                <Link href="/create">
                    <button className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95" aria-label="Create New Post">
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                </Link>
            </div>
        </div>
    );
}
