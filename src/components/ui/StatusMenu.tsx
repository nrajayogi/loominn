"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Check, Palette, Coffee, Zap, Moon } from "lucide-react";
import Link from "next/link";

const STATUS_OPTIONS = [
    { id: "online", label: "Online", color: "bg-green-500", icon: Zap },
    { id: "busy", label: "Busy", color: "bg-red-500", icon: Moon },
    { id: "vacation", label: "Vacation", color: "bg-orange-500", icon: Coffee },
    { id: "creative", label: "Creative", color: "bg-purple-500", icon: Palette },
];

export default function StatusMenu({ isActive, isHovered }: { isActive: boolean, isHovered: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(STATUS_OPTIONS[0]);

    return (
        <div className="relative" onMouseLeave={() => setIsOpen(false)}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col gap-1 min-w-[160px]"
                    >
                        <div className="text-xs font-medium text-zinc-500 px-3 py-2 uppercase tracking-wide">
                            Set Status
                        </div>
                        {STATUS_OPTIONS.map((status) => (
                            <button
                                key={status.id}
                                onClick={() => {
                                    setCurrentStatus(status);
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors w-full text-left group"
                            >
                                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                <span className="text-sm text-zinc-300 group-hover:text-white flex-1">{status.label}</span>
                                {currentStatus.id === status.id && <Check size={14} className="text-blue-500" />}
                            </button>
                        ))}
                        <div className="h-px bg-white/10 my-1" />
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors w-full text-left text-sm text-zinc-300 hover:text-white">
                            <User size={16} />
                            View Profile
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex flex-col items-center justify-center"
            >
                <motion.div
                    className={`
                        relative flex items-center justify-center rounded-xl transition-colors duration-300 px-4 h-12
                        ${isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}
                    `}
                    animate={{
                        y: isHovered ? -4 : 0,
                    }}
                >
                    <div className="relative">
                        <User size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${currentStatus.color}`} />
                    </div>

                    <AnimatePresence>
                        {isHovered && (
                            <motion.span
                                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                            >
                                Profile
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </button>
        </div>
    );
}
