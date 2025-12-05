"use client";

import { useState } from "react";
import { PenTool, Layout, Image as ImageIcon, Send, Rocket, Sparkles, FolderPlus } from "lucide-react";
import ProjectWizard from "@/components/projects/ProjectWizard";

export default function CreativeStudio() {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [draftContent, setDraftContent] = useState("");

    if (isWizardOpen) {
        return <ProjectWizard onCancel={() => setIsWizardOpen(false)} />;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Creative Studio</h1>
                    <p className="text-zinc-400">Your space to draft, create, and launch.</p>
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                    <Layout size={18} /> View Drafts
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Creation Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Draft */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-24 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-600/20 transition-colors"></div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <PenTool size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Quick Draft</h2>
                        </div>

                        <div className="relative">
                            <textarea
                                value={draftContent}
                                onChange={(e) => setDraftContent(e.target.value)}
                                placeholder="What are you working on? Draft your next big idea..."
                                className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 resize-none transition-colors"
                            />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                    <ImageIcon size={18} />
                                </button>
                                <button
                                    disabled={!draftContent.trim()}
                                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all"
                                >
                                    <Send size={16} /> Post
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Drafts List (Mock) */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles size={18} className="text-yellow-500" /> Recent Drafts
                        </h3>
                        <div className="grid gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">Untitled Draft {i}</h4>
                                            <p className="text-xs text-zinc-500">Last edited 2h ago</p>
                                        </div>
                                    </div>
                                    <button className="text-zinc-500 hover:text-white px-3 py-1 rounded-lg hover:bg-white/10 text-sm transition-colors">
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    {/* Launch Project Card */}
                    <div
                        onClick={() => setIsWizardOpen(true)}
                        className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-transform group"
                    >
                        <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Rocket size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Launch Project</h3>
                        <p className="text-sm text-blue-200/60 mb-4">Start a new collaborative project. Invite team members and set timelines.</p>
                        <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                            Start Wizard <ChevronRight size={16} />
                        </span>
                    </div>

                    {/* Create Portfolio Item */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-white/20 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                <FolderPlus size={18} />
                            </div>
                            <h3 className="font-bold text-white">Add to Portfolio</h3>
                        </div>
                        <p className="text-sm text-zinc-500">Upload finished work to your profile showcase.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronRight({ size }: { size?: number }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
}

function FileText({ size }: { size?: number }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
}
