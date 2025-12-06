"use client";

import { Projector } from "lucide-react";
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
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed top-6 right-6 z-[100] group"
                >
                    <div className="relative flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/30 border border-white/20 text-white hover:shadow-blue-500/50 transition-shadow">
                        {/* Pulsing ring */}
                        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 group-hover:animate-ping" />

                        <Projector size={24} className="relative z-10 fill-current" />

                        {/* Tooltip */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-full mr-4 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            View Pitch Deck
                        </div>
                    </div>
                </motion.div>
            </Link>
        </AnimatePresence>
    );
}
