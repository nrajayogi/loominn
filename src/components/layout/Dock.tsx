"use client";

import StatusMenu from "../ui/StatusMenu";

import { Home, LayoutGrid, Plus, User, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const NAV_ITEMS = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutGrid, label: "Projects", href: "/projects" },
    { icon: Zap, label: "Feed", href: "/feed" },
    { icon: Plus, label: "Create", href: "/projects/create", highlight: true },
    { icon: User, label: "Profile", href: "/profile" },
];

export default function Dock() {
    const pathname = usePathname();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                className="flex items-end gap-2 px-4 py-3 rounded-xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
                {NAV_ITEMS.map((item, index) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    const isHovered = hoveredIndex === index;

                    if (item.label === "Profile") {
                        return (
                            <motion.div
                                key={item.href}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                            >
                                <StatusMenu isActive={isActive} isHovered={isHovered} />
                            </motion.div>
                        );
                    }

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                className="relative flex flex-col items-center justify-center group"
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                            >

                                {/* Icon Container */}
                                <motion.div
                                    className={`
                                        relative flex items-center justify-center rounded-xl transition-colors duration-300 px-4
                                        ${item.highlight
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                            : isActive
                                                ? 'bg-white/10 text-white'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                    animate={{
                                        height: 48,
                                        y: isHovered ? -4 : 0,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />

                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                                animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                                                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Active Indicator Dot */}
                                    {isActive && !item.highlight && !isHovered && (
                                        <motion.div
                                            layoutId="activeDot"
                                            className="absolute -bottom-1 w-1 h-1 bg-white rounded-full text-center mx-auto left-0 right-0"
                                        />
                                    )}
                                </motion.div>
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
}
