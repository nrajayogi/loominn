"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Play, Pause, MessageSquare, Heart, Bookmark, Share2, Sparkles, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Perspective } from "@/lib/types/schema";
import { useGlobalState } from "@/context/GlobalStateContext";
import CommentDrawer from "./CommentDrawer";

interface PerspectiveModalViewerProps {
    isOpen: boolean;
    onClose: () => void;
    perspective: Perspective | null;
}

export default function PerspectiveModalViewer({ isOpen, onClose, perspective }: PerspectiveModalViewerProps) {
    const { toggleSave, savedPosts } = useGlobalState();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [likes, setLikes] = useState(24);
    const [hasLiked, setHasLiked] = useState(false);

    const slides = perspective?.items || [];
    const currentSlide = slides[currentSlideIndex];

    const handleNext = useCallback(() => {
        if (slides.length === 0) return;
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            setCurrentSlideIndex(0);
        }
    }, [currentSlideIndex, slides.length]);

    const handlePrev = useCallback(() => {
        if (slides.length === 0) return;
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        } else {
            setCurrentSlideIndex(slides.length - 1);
        }
    }, [currentSlideIndex, slides.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") onClose();
            if (e.key === " ") {
                e.preventDefault();
                setIsPaused(prev => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleNext, handlePrev, onClose]);

    // Auto-advance if not paused
    useEffect(() => {
        if (!isOpen || isPaused || slides.length <= 1) return;

        const timer = setTimeout(() => {
            handleNext();
        }, 6500);

        return () => clearTimeout(timer);
    }, [isOpen, isPaused, currentSlideIndex, slides.length, handleNext]);

    // Reset slide index when opening a new perspective
    useEffect(() => {
        if (isOpen) {
            setCurrentSlideIndex(0);
            setIsPaused(false);
        }
    }, [isOpen, perspective?.id]);

    if (!isOpen || !perspective) return null;

    const numericId = parseInt(perspective.id.replace(/\D/g, "")) || 42;
    const isSaved = savedPosts.includes(numericId);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
                {/* Backdrop Click */}
                <div className="absolute inset-0" onClick={onClose} />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-2xl bg-zinc-950 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-950/40 overflow-hidden flex flex-col max-h-[92vh] z-10"
                >
                    {/* Progress Bars */}
                    <div className="flex gap-1.5 p-4 pb-2 z-20">
                        {slides.map((_, idx) => (
                            <div 
                                key={idx} 
                                className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
                                onClick={() => setCurrentSlideIndex(idx)}
                            >
                                <div 
                                    className={`h-full transition-all duration-300 ${
                                        idx < currentSlideIndex 
                                            ? "w-full bg-purple-400" 
                                            : idx === currentSlideIndex 
                                                ? isPaused ? "w-full bg-purple-500/70" : "w-full bg-purple-400 animate-pulse" 
                                                : "w-0 bg-transparent"
                                    }`} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-2 border-b border-white/5 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 flex items-center justify-center text-white font-bold text-sm">
                                {perspective.userImage ? (
                                    <img src={perspective.userImage} alt={perspective.userName} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    perspective.userName.charAt(0)
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white">{perspective.userName}</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/20">
                                        {perspective.status}
                                    </span>
                                </div>
                                <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                                    <span>{perspective.role}</span>
                                    {perspective.location && (
                                        <>
                                            <span>•</span>
                                            <span>{perspective.location}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsPaused(prev => !prev)}
                                className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
                                title={isPaused ? "Resume autoplay" : "Pause autoplay"}
                            >
                                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Main Slide Content Canvas */}
                    <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto min-h-[360px] bg-gradient-to-b from-zinc-900/60 to-black">
                        {/* Slide Category & Navigation arrows */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 bg-purple-950/50 px-2.5 py-1 rounded-md border border-purple-800/30">
                                    Slide {currentSlideIndex + 1} of {slides.length || 1}
                                </span>
                                {currentSlide?.type && (
                                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                                        {currentSlide.type}
                                    </span>
                                )}
                            </div>

                            <span className="text-xs text-zinc-500">
                                Press Space to {isPaused ? "Play" : "Pause"} • Arrow keys to step
                            </span>
                        </div>

                        {/* Title & Core Perspective Text */}
                        <div className="my-auto space-y-4 py-4">
                            <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                                {perspective.title}
                            </h2>

                            {currentSlide?.url && (
                                <div className="rounded-xl overflow-hidden border border-white/10 my-4 max-h-[260px]">
                                    <img 
                                        src={currentSlide.url} 
                                        alt={perspective.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            )}

                            <div className="text-zinc-200 text-base md:text-lg font-normal leading-relaxed bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                                {currentSlide?.content || "Exploring ideas and architectural trade-offs."}
                            </div>
                        </div>

                        {/* Navigation Chevron Controls */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-lg backdrop-blur-sm"
                            title="Previous slide"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-lg backdrop-blur-sm"
                            title="Next slide"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between p-4 px-6 border-t border-white/5 bg-zinc-950/80 z-20">
                        <div className="flex items-center gap-6 text-xs text-zinc-400">
                            <button
                                onClick={() => {
                                    setLikes(prev => hasLiked ? prev - 1 : prev + 1);
                                    setHasLiked(!hasLiked);
                                }}
                                className="flex items-center gap-1.5 hover:text-pink-400 transition-colors"
                            >
                                <Heart size={16} className={hasLiked ? "text-pink-500 fill-pink-500" : ""} />
                                <span>{likes}</span>
                            </button>

                            <button
                                onClick={() => setIsCommentOpen(true)}
                                className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                            >
                                <MessageSquare size={16} />
                                <span>Discuss Slide</span>
                            </button>

                            <button
                                onClick={() => toggleSave(numericId)}
                                className={`flex items-center gap-1.5 hover:text-yellow-400 transition-colors ${isSaved ? "text-yellow-400" : ""}`}
                            >
                                <Bookmark size={16} className={isSaved ? "fill-yellow-400" : ""} />
                                <span>{isSaved ? "Saved" : "Save"}</span>
                            </button>
                        </div>

                        <div className="text-xs text-zinc-500 font-mono">
                            Orbit Reel Mode
                        </div>
                    </div>
                </motion.div>

                {/* Comment Drawer for Discussion */}
                <CommentDrawer
                    isOpen={isCommentOpen}
                    onClose={() => setIsCommentOpen(false)}
                    targetId={perspective.id}
                    targetTitle={perspective.title}
                />
            </div>
        </AnimatePresence>
    );
}
