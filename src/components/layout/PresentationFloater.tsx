"use client";

import { Projector, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PresentationFloater() {
    const pathname = usePathname();

    // Show ONLY on Home/Login pages as requested
    const isHomePage = pathname === "/" || pathname === "/login" || pathname === "/home";
    if (!isHomePage) return null;

    return (
        <AnimatePresence>
            <Link href="/presentation">
                <motion.div
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        transition: {
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 1
                        }
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-auto md:top-6 md:right-6 z-[100] group"
                >
                    <div className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-white/20 text-white hover:shadow-[0_0_50px_rgba(79,70,229,0.8)] transition-all overflow-hidden group-hover:pr-8">

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />

                        {/* Pulsing ring */}
                        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping pointer-events-none" />

                        <div className="relative z-10 flex items-center justify-center bg-white/10 p-2 rounded-full backdrop-blur-sm">
                            <Projector size={20} className="fill-current" />
                        </div>

                        <div className="relative z-10 flex flex-col items-start leading-none">
                            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-0.5">New Feature</span>
                            <span className="font-bold text-sm whitespace-nowrap">View Pitch Deck</span>
                        </div>

                        <ChevronRight className="w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 relative z-10" />
                    </div>
                </motion.div>
            </Link>
        </AnimatePresence>
    );
}
