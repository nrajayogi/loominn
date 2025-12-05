"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VoteControlProps {
    initialVotes: number;
    initialUserVote?: "up" | "down" | null;
}

export function VoteControl({ initialVotes, initialUserVote = null }: VoteControlProps) {
    const [votes, setVotes] = useState(initialVotes);
    const [userVote, setUserVote] = useState<"up" | "down" | null>(initialUserVote);

    const handleVote = (type: "up" | "down") => {
        if (userVote === type) {
            // Toggle off
            setUserVote(null);
            setVotes(votes + (type === "up" ? -1 : 1));
        } else {
            // Switch vote or new vote
            let diff = 0;
            if (userVote === "up") diff = -1;
            if (userVote === "down") diff = 1;

            if (type === "up") diff += 1;
            if (type === "down") diff -= 1;

            setUserVote(type);
            setVotes(votes + diff);
        }
    };

    return (
        <div className="flex items-center gap-1 bg-zinc-900/50 rounded-lg p-1 border border-zinc-800">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleVote("up")}
                className={cn(
                    "p-1 rounded hover:bg-zinc-800 transition-colors",
                    userVote === "up" ? "text-orange-500" : "text-zinc-500"
                )}
            >
                <ChevronUp size={18} />
            </motion.button>

            <span className={cn(
                "text-sm font-bold min-w-[20px] text-center",
                userVote === "up" && "text-orange-500",
                userVote === "down" && "text-blue-500",
                !userVote && "text-zinc-400"
            )}>
                {votes}
            </span>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleVote("down")}
                className={cn(
                    "p-1 rounded hover:bg-zinc-800 transition-colors",
                    userVote === "down" ? "text-blue-500" : "text-zinc-500"
                )}
            >
                <ChevronDown size={18} />
            </motion.button>
        </div>
    );
}
