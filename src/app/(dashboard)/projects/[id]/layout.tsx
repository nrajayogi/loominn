"use client";

import { use } from "react";
import { ChevronLeft, MoreHorizontal, Star, Search, Bell, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROJECT_REGISTRY } from "@/lib/data/mock";

const TABS = [
    { label: "Overview", href: "" },
    { label: "Board", href: "/board" },
    { label: "Timeline", href: "/timeline" },
    { label: "Channel", href: "/channel" },
    { label: "Members", href: "/members" },
];

export default function ProjectLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const pathname = usePathname();
    const { id: rawProjectId } = use(params);
    const projectId = decodeURIComponent(rawProjectId);
    const baseUrl = `/projects/${projectId}`;

    // Format human readable title
    const projectTitle = projectId
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const registryInfo = PROJECT_REGISTRY[projectTitle] || PROJECT_REGISTRY["Loominn Rebuild"];

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4 sm:px-6">
            {/* Top Bar Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4">
                    <Link
                        href="/projects"
                        className="p-2 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white transition-all"
                        title="Back to Projects"
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-900/30">
                        {projectTitle.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl font-bold text-white">{projectTitle}</h1>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20">
                                {registryInfo?.domain || "Engineering"}
                            </span>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Active Project" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                            <span>Collaborative Workspace</span>
                            <span>•</span>
                            <span className="text-purple-400 font-mono">Verified Proof Enabled</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/history"
                        className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                        <Shield size={14} className="text-emerald-400" />
                        <span>Proof Ledger</span>
                    </Link>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-white/10 overflow-x-auto custom-scrollbar">
                <div className="flex items-center gap-2 min-w-max pb-1">
                    {TABS.map((tab) => {
                        const href = `${baseUrl}${tab.href}`;
                        const isActive = tab.href === ""
                            ? pathname === baseUrl
                            : pathname.startsWith(href);

                        return (
                            <Link
                                key={tab.label}
                                href={href}
                                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    isActive
                                        ? "bg-white text-black shadow-md font-bold"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Workspace Tab Content */}
            <div className="pt-2">
                {children}
            </div>
        </div>
    );
}
