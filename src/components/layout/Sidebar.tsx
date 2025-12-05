
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
    Settings,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Zap, label: "Feed", href: "/feed" },
    { icon: Compass, label: "Explore", href: "/explore" },
    { icon: Briefcase, label: "Projects", href: "/projects" },
    { icon: Tv, label: "Channels", href: "/channels" },
    { icon: Users, label: "Partners", href: "/network" },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
    { icon: Clock, label: "History", href: "/history" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 h-[85vh] w-24 flex-col z-50 perspective-1000"
        >
            {/* Glass Rail Container */}
            <div className="relative w-full h-full rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center py-8 overflow-visible group transition-all duration-500 hover:w-72 hover:bg-black/40 hover:border-white/20 hover:shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)]">

                {/* Header / Logo */}
                <div className="mb-8 relative z-10 flex items-center gap-4 px-6 w-full overflow-hidden">
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="h-10 w-10 min-w-[2.5rem] relative flex items-center justify-center"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.png" alt="LoomInn" className="object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </motion.div>
                    <motion.h1
                        className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        LoomInn
                    </motion.h1>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 w-full px-4 space-y-3 flex flex-col items-center">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="w-full relative"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "relative flex items-center gap-4 rounded-2xl p-3 transition-all duration-300 group/item overflow-hidden",
                                        isActive
                                            ? "bg-blue-600/20 text-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)] border border-blue-500/30"
                                            : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    {/* Active Indicator Glow */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeGlow"
                                            className="absolute inset-0 bg-blue-500/10 blur-xl"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}

                                    <div className="relative z-10 flex items-center justify-center min-w-[24px]">
                                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>

                                    <span className="relative z-10 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                        {item.label}
                                    </span>

                                    {/* Hover Glint Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Create Action */}
                <div className="w-full px-4 mt-4 mb-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 overflow-hidden group/btn relative"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        <Plus size={24} className="relative z-10 min-w-[24px]" />
                        <span className="relative z-10 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Create</span>
                    </motion.button>
                </div>

                {/* User Profile */}
                <div className="w-full px-4 mt-auto">
                    <Link href="/settings">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer overflow-hidden"
                        >
                            <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 relative group/avatar">
                                <span className="font-bold group-hover/avatar:opacity-0 transition-opacity">RN</span>
                                <Settings size={18} className="absolute opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white" />
                            </div>
                            <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-sm font-bold text-white truncate">Rajayogi</p>
                                <p className="text-xs text-zinc-500 truncate">Pro Member</p>
                            </div>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.aside>
    );
}

