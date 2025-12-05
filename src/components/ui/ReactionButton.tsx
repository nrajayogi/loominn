"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const REACTIONS = [
    { id: "love", emoji: "❤️", label: "Love" },
    { id: "fire", emoji: "🔥", label: "Lit" },
    { id: "party", emoji: "🎉", label: "Party" },
    { id: "wow", emoji: "😲", label: "Wow" },
    { id: "thinking", emoji: "🤔", label: "Hmm" },
];

export default function ReactionButton({ initialCount }: { initialCount: number }) {
    const [count, setCount] = useState(initialCount);
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleReaction = (reaction: string) => {
        if (selectedReaction === reaction) {
            setSelectedReaction(null);
            setCount(c => c - 1);
        } else {
            if (!selectedReaction) setCount(c => c + 1);
            setSelectedReaction(reaction);
        }
        setIsHovered(false);
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -40, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute left-0 bottom-full bg-zinc-900 border border-white/10 rounded-full p-2 flex gap-1 shadow-xl z-50"
                    >
                        {REACTIONS.map((r, i) => (
                            <motion.button
                                key={r.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    handleReaction(r.emoji);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-xl hover:scale-125 hover:bg-white/10 rounded-full transition-transform"
                                title={r.label}
                            >
                                {r.emoji}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                className={`flex items-center gap-1 transition-colors ${selectedReaction ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!selectedReaction) handleReaction("❤️"); // Default like
                }}
            >
                {selectedReaction ? (
                    <span className="text-lg">{selectedReaction}</span>
                ) : (
                    <Heart size={14} className={selectedReaction ? "fill-current" : ""} />
                )}
                <span className="text-xs">{count}</span>
            </button>
        </div>
    );
}
