"use client";

import { useState, useEffect } from "react";
import { Plus, X, MoreHorizontal, Heart, Send, Briefcase, FileText, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

// Mock Data - Professional Context
const MOCK_BRIEFS = [
    {
        id: "b1",
        userId: "u2",
        userName: "Sarah Chen",
        role: "Lead Designer",
        userImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80",
        title: "The Future of Design Systems",
        status: "Perspective",
        items: [
            { id: "bi1", type: "text", content: "Atomic design is evolving. We need to think more about composition over rigid structures.", background: "bg-zinc-900 border border-blue-500/30", duration: 5000 },
            { id: "bi2", type: "image", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80", caption: "Fluid Typography Scaling", duration: 5000 }
        ]
    },
    {
        id: "b2",
        userId: "u3",
        userName: "Mike Ross",
        role: "Frontend Dev",
        userImage: "",
        title: "Authentication Flow",
        status: "In Progress",
        items: [
            { id: "bi3", type: "text", content: "Debugging the OAuth callback issue. Expect a fix in 2 hours.", background: "bg-zinc-900 border border-yellow-500/30", duration: 4000 }
        ]
    },
    {
        id: "b3",
        userId: "u4",
        userName: "Jessica Lee",
        role: "Product Manager",
        userImage: "",
        title: "Sprint Goals",
        status: "Planning",
        items: [
            { id: "bi4", type: "text", content: "Priorities for next sprint: 1. Mobile Responsiveness 2. User Onboarding.", background: "bg-zinc-900 border border-purple-500/30", duration: 5000 }
        ]
    }
];

export default function StoriesRail() {
    const [briefs, setBriefs] = useState(MOCK_BRIEFS);
    const [selectedBriefIndex, setSelectedBriefIndex] = useState<number | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [newPerspectiveContent, setNewPerspectiveContent] = useState("");
    const [newPerspectiveImage, setNewPerspectiveImage] = useState("");

    const closeViewer = () => {
        setSelectedBriefIndex(null);
        setCurrentSlideIndex(0);
    };

    const handleCreatePerspective = () => {
        if (!newPerspectiveContent.trim()) return;

        const newBrief = {
            id: `b-${Date.now()}`,
            userId: "u1", // Current user
            userName: "Rajayogi", // Mock current user
            role: "Pro Member",
            userImage: "",
            title: "New Perspective",
            status: "Perspective",
            items: [
                {
                    id: `bi-${Date.now()}`,
                    type: newPerspectiveImage ? "image" : "text",
                    content: newPerspectiveContent,
                    url: newPerspectiveImage,
                    background: "bg-zinc-900 border border-blue-500/30",
                    duration: 5000
                }
            ]
        };

        // @ts-expect-error - Mock data types are loose
        setBriefs([newBrief, ...briefs]);
        setIsCreating(false);
        setNewPerspectiveContent("");
        setNewPerspectiveImage("");
    };

    const handleNextSlide = () => {
        if (selectedBriefIndex === null) return;
        const currentBrief = briefs[selectedBriefIndex];
        if (currentSlideIndex < currentBrief.items.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            if (selectedBriefIndex < briefs.length - 1) {
                setSelectedBriefIndex(selectedBriefIndex + 1);
                setCurrentSlideIndex(0);
            } else {
                closeViewer();
            }
        }
    };

    const handlePrevSlide = () => {
        if (selectedBriefIndex === null) return;
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        } else {
            if (selectedBriefIndex > 0) {
                setSelectedBriefIndex(selectedBriefIndex - 1);
                setCurrentSlideIndex(0);
            }
        }
    };


    return (
        <div className="mb-8">
            {/* Professional Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700">
                        <Briefcase size={14} className="text-zinc-400" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Perspectives</h3>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View All</button>
            </div>

            {/* "Brief Files" Scroll Rail */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide snap-x">
                {/* Create Perspective Card */}
                <motion.div
                    onClick={() => setIsCreating(true)}
                    whileHover={{ y: -2 }}
                    className="relative min-w-[160px] h-[220px] bg-zinc-900 border border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer group hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all flex-shrink-0 snap-start"
                >
                    <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/50 transition-colors">
                        <Plus size={24} />
                    </div>
                    <div className="text-center px-4">
                        <span className="block text-sm font-bold text-zinc-300 group-hover:text-white mb-1">Share</span>
                        <span className="block text-xs text-zinc-500 group-hover:text-zinc-400">Perspective</span>
                    </div>
                </motion.div>

                {/* Brief Cards */}
                {briefs.map((brief, index) => (
                    <motion.div
                        key={brief.id}
                        onClick={() => setSelectedBriefIndex(index)}
                        whileHover={{ y: -4 }}
                        className="relative min-w-[200px] h-[220px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer snap-start group shadow-sm hover:shadow-xl hover:shadow-black/50 hover:border-zinc-700 transition-all flex-shrink-0 flex flex-col"
                    >
                        {/* Card Background / Hero Image if available (fallback to gradient) */}
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-zinc-950 z-0"></div>

                        {/* Status Strip */}
                        <div className={`absolute top-0 left-0 right-0 h-1 z-10 ${brief.status === 'Perspective' ? 'bg-blue-500' : brief.status === 'In Progress' ? 'bg-yellow-500' : 'bg-purple-500'}`}></div>

                        <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                            {/* Author Header */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-700 shadow-lg">
                                    {brief.userImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={brief.userImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white font-bold">{brief.userName.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-white truncate">{brief.userName}</p>
                                    <p className="text-[10px] text-zinc-500 truncate">{brief.role}</p>
                                </div>
                            </div>

                            {/* Main Title Content */}
                            <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                    {brief.status === 'Perspective' && <CheckCircle2 size={12} className="text-blue-500" />}
                                    {brief.status === 'In Progress' && <Clock size={12} className="text-yellow-500" />}
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${brief.status === 'Perspective' ? 'text-blue-500' : brief.status === 'In Progress' ? 'text-yellow-500' : 'text-purple-500'}`}>
                                        {brief.status}
                                    </span>
                                </div>
                                <h4 className="text-base font-bold text-white leading-tight line-clamp-3 mb-1">
                                    {brief.title}
                                </h4>
                            </div>

                            {/* Footer meta */}
                            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 mt-2">
                                <span>2h ago</span>
                                <div className="flex items-center gap-1">
                                    <FileText size={12} />
                                    <span>Read</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Creation Modal */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsCreating(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-700 shadow-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Share Perspective</h3>
                                <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <textarea
                                value={newPerspectiveContent}
                                onChange={(e) => setNewPerspectiveContent(e.target.value)}
                                placeholder="What's your perspective?"
                                className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 mb-4 resize-none"
                            />

                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={newPerspectiveImage}
                                    onChange={(e) => setNewPerspectiveImage(e.target.value)}
                                    placeholder="Image URL (optional)..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-zinc-400 hover:text-white font-medium">Cancel</button>
                                <button
                                    onClick={handleCreatePerspective}
                                    disabled={!newPerspectiveContent.trim()}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                                >
                                    Share
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Professional Brief Viewer (Modal Style) */}
            <AnimatePresence>
                {selectedBriefIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={closeViewer}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 w-full max-w-2xl rounded-2xl border border-zinc-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Brief Header */}
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/95 sticky top-0 z-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                                        {briefs[selectedBriefIndex].userImage ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={briefs[selectedBriefIndex].userImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold">{briefs[selectedBriefIndex].userName.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">{briefs[selectedBriefIndex].userName}</h3>
                                        <p className="text-zinc-400 text-xs">{briefs[selectedBriefIndex].role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`px-2 py-0.5 rounded-full border ${briefs[selectedBriefIndex].status === 'Perspective' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-purple-500/30 bg-purple-500/10 text-purple-400'} text-xs font-medium`}>
                                        {briefs[selectedBriefIndex].status}
                                    </div>
                                    <button onClick={closeViewer} className="p-2 ml-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors" title="Close Perspective">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex gap-1 px-4 pt-1 pb-1 bg-zinc-900">
                                {briefs[selectedBriefIndex].items.map((item, idx) => (
                                    <div key={item.id} className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${briefs[selectedBriefIndex].status === 'Perspective' ? 'bg-blue-500' : 'bg-white'}`}
                                            initial={{ width: "0%" }}
                                            animate={{ width: idx < currentSlideIndex ? "100%" : idx === currentSlideIndex ? "100%" : "0%" }}
                                            transition={{ duration: idx === currentSlideIndex ? item.duration / 1000 : 0, ease: "linear" }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div className="relative flex-1 min-h-[400px] bg-zinc-950 flex flex-col">
                                {/* Navigation Tap Zones */}
                                <div className="absolute inset-0 z-10 flex">
                                    <div className="w-1/4 h-full cursor-w-resize z-20" onClick={handlePrevSlide}></div>
                                    <div className="w-1/2 h-full z-0 pointer-events-none"></div> {/* Center allows clicking content if needed later */}
                                    <div className="w-1/4 h-full cursor-e-resize z-20" onClick={handleNextSlide}></div>
                                </div>

                                <div className="z-20 flex-1 flex flex-col justify-center p-8 md:p-12 overflow-y-auto">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentSlideIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full flex flex-col items-center justify-center"
                                        >
                                            {briefs[selectedBriefIndex].items[currentSlideIndex].type === 'image' ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center">
                                                    <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-2xl max-h-[50vh] w-auto">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={briefs[selectedBriefIndex].items[currentSlideIndex].url}
                                                            alt="Content"
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    {briefs[selectedBriefIndex].items[currentSlideIndex].caption && (
                                                        <div className="mt-4 p-4 text-sm text-zinc-300 text-center max-w-lg font-medium">
                                                            {briefs[selectedBriefIndex].items[currentSlideIndex].caption}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={`w-full p-10 md:p-16 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center text-center shadow-inner`}>
                                                    <Briefcase className="text-zinc-600 mb-6 opacity-50" size={48} />
                                                    <p className="text-2xl md:text-3xl font-serif font-medium text-white leading-relaxed max-w-2xl">
                                                        &quot;{briefs[selectedBriefIndex].items[currentSlideIndex].content}&quot;
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex gap-3 z-30">
                                <input
                                    type="text"
                                    placeholder="Reply specifically to this perspective..."
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <button className="p-3 text-zinc-400 hover:text-white bg-zinc-800 border border-zinc-700 rounded-xl hover:border-zinc-600 transition-colors" title="Like"><Heart size={20} /></button>
                                <button className="p-3 text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors" title="Send"><Send size={20} /></button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
