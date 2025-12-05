"use client";

import { Home, LayoutGrid, Plus, User, Zap, LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useGlobalState } from "@/context/GlobalStateContext";

const NAV_ITEMS = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutGrid, label: "Projects", href: "/projects" },
    { icon: Plus, label: "Create", href: "/projects/create", highlight: true },
    { icon: Zap, label: "Feed", href: "/feed" },
    { icon: User, label: "Profile", href: "/profile", isProfile: true },
];

export default function Dock() {
    const pathname = usePathname();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { data: session } = useSession();
    const { userProfile } = useGlobalState();

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                className="flex items-end gap-3 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
                {NAV_ITEMS.map((item, index) => {
                    let { label, href, icon: Icon } = item;
                    // Override for unauthenticated profile
                    if (item.isProfile && !session) {
                        label = "Sign In";
                        href = "/login";
                        Icon = LogIn;
                    }

                    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
                    const isHovered = hoveredIndex === index;
                    const isProfile = item.isProfile;
                    // Only show profile image if logged in
                    const displayImage = isProfile && session ? (userProfile.image || session.user?.image) : null;
                    const showPopup = isProfile && session && isHovered;

                    return (
                        <div
                            key={item.href}
                            className="relative group"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <AnimatePresence>
                                {showPopup && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-1 flex flex-col gap-1 z-50"
                                    >
                                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                                            <p className="text-xs font-bold text-white truncate">{userProfile.name || session?.user?.name || "User"}</p>
                                            <p className="text-[10px] text-zinc-500 truncate">{userProfile.bio || session?.user?.email}</p>
                                        </div>
                                        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                            <User size={14} />
                                            View Profile
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                                        >
                                            <LogOut size={14} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Link href={href}>
                                <motion.div
                                    className="relative flex flex-col items-center justify-center"
                                >

                                    {/* Icon Container */}
                                    <motion.div
                                        className={`
                                            relative flex items-center justify-center transition-all duration-300
                                            ${item.highlight
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 px-4 rounded-xl'
                                                : isProfile && session
                                                    ? 'rounded-full border-2 border-white/10 px-0 overflow-hidden'
                                                    : isActive
                                                        ? 'bg-white/10 text-white px-4 rounded-xl'
                                                        : 'text-zinc-400 hover:text-white hover:bg-white/5 px-4 rounded-xl'
                                            }
                                        `}
                                        animate={{
                                            height: 48,
                                            width: isProfile && session ? 48 : 'auto',
                                            y: isHovered ? -4 : 0,
                                            scale: isProfile && session && isHovered ? 1.05 : 1,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        {displayImage ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={displayImage}
                                                    alt="Profile"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                                {/* Status Indicator */}
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black z-10"></div>
                                            </div>
                                        ) : (
                                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                        )}

                                        <AnimatePresence>
                                            {isHovered && (!isProfile || !session) && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                                    animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                                                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                                >
                                                    {label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>

                                        {/* Active Indicator Dot */}
                                        {isActive && !item.highlight && (!isProfile || !session) && !isHovered && (
                                            <motion.div
                                                layoutId="activeDot"
                                                className="absolute -bottom-1 w-1 h-1 bg-white rounded-full text-center mx-auto left-0 right-0"
                                            />
                                        )}
                                    </motion.div>
                                </motion.div>
                            </Link>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
