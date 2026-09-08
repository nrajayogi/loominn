"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

export default function SocialPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/discover?tab=people");
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse">
                <Users size={24} />
            </div>
            <div>
                <h3 className="text-white font-bold text-base">Redirecting to Orbit People Discovery...</h3>
                <p className="text-xs text-zinc-500 mt-1">Loominn Social has unified into the Discover Hub.</p>
            </div>
        </div>
    );
}
