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
        title: "Q3 Design System Update",
        status: "Review",
        items: [
            { id: "bi1", type: "text", content: "Finalizing the new component library. Ready for dev review by EOD.", background: "bg-zinc-900 border border-blue-500/30", duration: 5000 },
            { id: "bi2", type: "image", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80", caption: "New Color Palette", duration: 5000 }
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
    const { data: session } = useSession();
    const [briefs, setBriefs] = useState(MOCK_BRIEFS);
    const [selectedBriefIndex, setSelectedBriefIndex] = useState<number | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Auto-advance logic
    useEffect(() => {
        if (selectedBriefIndex === null) return;
        const currentBrief = briefs[selectedBriefIndex];
        const currentSlide = currentBrief.items[currentSlideIndex];
        const timer = setTimeout(() => handleNextSlide(), currentSlide.duration);
        return () => clearTimeout(timer);
    }, [selectedBriefIndex, currentSlideIndex]);

    const handleNextSlide = () => {
        if (selectedBriefIndex === null) return;
        const currentBrief = briefs[selectedBriefIndex];
        if (currentSlideIndex < currentBrief.items.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            if (selectedBriefIndex < briefs.length - 1) {
                setSelectedBriefIndex(prev => prev + 1);
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
                setSelectedBriefIndex(prev => prev - 1);
                setCurrentSlideIndex(0);
            }
        }
    };

    const closeViewer = () => {
        setSelectedBriefIndex(null);
        setCurrentSlideIndex(0);
    };

    return (
        <div className="mb-0">
            {/* Professional Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700">
                        <Briefcase size={14} className="text-zinc-400" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Team Briefs</h3>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View All Updates</button>
            </div>

            {/* "Brief Files" Scroll Rail */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide snap-x">
                {/* Create Update Card */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="relative min-w-[140px] h-[180px] bg-zinc-900 border border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer group hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all flex-shrink-0 snap-start"
                >
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/50 transition-colors">
                        <Plus size={20} />
                    </div>
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">New Update</span>
                </motion.div>

                {/* Brief Cards */}
                {briefs.map((brief, index) => (
                    <motion.div
                        key={brief.id}
                        onClick={() => setSelectedBriefIndex(index)}
                        whileHover={{ y: -4 }}
                        className="relative min-w-[200px] h-[180px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer snap-start group shadow-sm hover:shadow-xl hover:shadow-black/50 hover:border-zinc-700 transition-all flex-shrink-0 flex flex-col"
                    >
                        {/* Status Strip */}
                        <div className={`h-1 w-full ${brief.status === 'Review' ? 'bg-blue-500' : brief.status === 'In Progress' ? 'bg-yellow-500' : 'bg-purple-500'}`}></div>

                        <div className="p-4 flex flex-col h-full justify-between">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-700">
                                        {brief.userImage ? (
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
                            </div>

                            {/* Content Preview */}
                            <div className="mt-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                    {brief.status === 'Review' && <CheckCircle2 size={12} className="text-blue-500" />}
                                    {brief.status === 'In Progress' && <Clock size={12} className="text-yellow-500" />}
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${brief.status === 'Review' ? 'text-blue-500' : brief.status === 'In Progress' ? 'text-yellow-500' : 'text-purple-500'}`}>
                                        {brief.status}
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-zinc-300 line-clamp-2 leading-snug">{brief.title}</h4>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
                                <span>2h ago</span>
                                <FileText size={12} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Professional Brief Viewer (Modal Style) */}
            <AnimatePresence>
                {selectedBriefIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={closeViewer}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            {/* Brief Header */}
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                                        {briefs[selectedBriefIndex].userImage ? (
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
                                <button onClick={closeViewer} className="text-zinc-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex gap-1 px-4 pt-2">
                                {briefs[selectedBriefIndex].items.map((item, idx) => (
                                    <div key={item.id} className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${briefs[selectedBriefIndex].status === 'Review' ? 'bg-blue-500' : 'bg-white'}`}
                                            initial={{ width: "0%" }}
                                            animate={{ width: idx < currentSlideIndex ? "100%" : idx === currentSlideIndex ? "100%" : "0%" }}
                                            transition={{ duration: idx === currentSlideIndex ? item.duration / 1000 : 0, ease: "linear" }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div className="relative flex-1 min-h-[300px] bg-zinc-950/50 flex flex-col p-8">
                                {/* Navigation Tap Zones */}
                                <div className="absolute inset-0 z-10 flex">
                                    <div className="w-1/3 h-full cursor-w-resize" onClick={handlePrevSlide}></div>
                                    <div className="w-2/3 h-full cursor-e-resize" onClick={handleNextSlide}></div>
                                </div>

                                <div className="z-20 flex-1 flex flex-col justify-center">
                                    {briefs[selectedBriefIndex].items[currentSlideIndex].type === 'image' ? (
                                        <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black">
                                            <img
                                                src={briefs[selectedBriefIndex].items[currentSlideIndex].url}
                                                alt="Content"
                                                className="w-full h-auto max-h-[400px] object-contain"
                                            />
                                            {//@ts-ignore
                                                briefs[selectedBriefIndex].items[currentSlideIndex].caption && (
                                                    <div className="p-3 text-xs text-zinc-400 text-center border-t border-zinc-800 bg-zinc-900">
                                                        {//@ts-ignore
                                                            briefs[selectedBriefIndex].items[currentSlideIndex].caption}
                                                    </div>
                                                )}
                                        </div>
                                    ) : (
                                        <div className={`p-8 rounded-xl border border-dashed border-zinc-700 bg-zinc-900 flex items-center justify-center text-center`}>
                                            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                                                {briefs[selectedBriefIndex].items[currentSlideIndex].content}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <button className="p-2 text-zinc-400 hover:text-white bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"><Heart size={20} /></button>
                                <button className="p-2 text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"><Send size={20} /></button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
