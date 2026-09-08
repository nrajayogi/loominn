"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Heart, Send, Briefcase, FileText, CheckCircle2, Clock, Camera, MapPin, Upload, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Perspective, PerspectiveStatus, PerspectiveItemType } from "@/lib/types/schema";

export default function StoriesRail() {
    const { perspectives, addPerspective, userProfile } = useGlobalState();
    const [selectedBriefIndex, setSelectedBriefIndex] = useState<number | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [newPerspectiveTitle, setNewPerspectiveTitle] = useState("");
    const [newPerspectiveContent, setNewPerspectiveContent] = useState("");
    const [newPerspectiveImage, setNewPerspectiveImage] = useState("");
    const [newStatus, setNewStatus] = useState<PerspectiveStatus>("Perspective");
    const [includeLocation, setIncludeLocation] = useState(true);

    // Camera & Upload State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const closeViewer = () => {
        setSelectedBriefIndex(null);
        setCurrentSlideIndex(0);
    };

    const startCamera = async () => {
        setIsCameraOpen(true);
        setCameraError(null);
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera API not supported in this browser environment.");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err: unknown) {
            console.warn("Camera access failed:", err);
            const message = err instanceof Error ? err.message : "Camera permission denied or camera device unavailable.";
            setCameraError(message);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                context.drawImage(videoRef.current, 0, 0, 640, 480);
                const dataUrl = canvasRef.current.toDataURL("image/png");
                setNewPerspectiveImage(dataUrl);
                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
        setCameraError(null);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPerspectiveImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreatePerspective = () => {
        if (!newPerspectiveContent.trim()) return;

        const generatedTitle = newPerspectiveTitle.trim() || 
            newPerspectiveContent.substring(0, 32) + (newPerspectiveContent.length > 32 ? "..." : "");

        const newBrief: Perspective = {
            id: `p-${Date.now()}`,
            userId: "u-current",
            userName: userProfile.name || "Anonymous",
            role: userProfile.bio?.split("•")[0]?.trim() || "Member",
            userImage: userProfile.image,
            title: generatedTitle,
            location: includeLocation ? userProfile.location : (userProfile.accountOrigin || "United States"),
            status: newStatus,
            items: [
                {
                    id: `pi-${Date.now()}`,
                    type: (newPerspectiveImage ? "image" : "text") as PerspectiveItemType,
                    content: newPerspectiveContent,
                    url: newPerspectiveImage || undefined,
                    duration: 5000
                }
            ],
            createdAt: "Just now"
        };

        addPerspective(newBrief);
        setIsCreating(false);
        setNewPerspectiveTitle("");
        setNewPerspectiveContent("");
        setNewPerspectiveImage("");
        stopCamera();
    };

    const handleNextSlide = () => {
        if (selectedBriefIndex === null) return;
        const currentBrief = perspectives[selectedBriefIndex];
        if (currentSlideIndex < currentBrief.items.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            if (selectedBriefIndex < perspectives.length - 1) {
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
        <div className="space-y-3">
            {/* Scroll Rail */}
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide snap-x">
                {/* Create Perspective Card */}
                <motion.div
                    onClick={() => setIsCreating(true)}
                    whileHover={{ y: -2 }}
                    className="relative min-w-[150px] sm:min-w-[170px] h-[210px] bg-zinc-900/80 border border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer group hover:bg-zinc-800/40 transition-all flex-shrink-0 snap-start"
                >
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-md">
                        <Plus size={22} />
                    </div>
                    <div className="text-center px-3">
                        <span className="block text-xs font-bold text-white group-hover:text-purple-300">Share</span>
                        <span className="block text-[11px] text-zinc-400">Perspective</span>
                    </div>
                </motion.div>

                {/* Perspective Cards */}
                {perspectives.length === 0 ? (
                    <div className="h-[210px] flex-1 flex items-center justify-center border border-white/5 rounded-2xl p-6 text-center text-zinc-500 text-xs">
                        No active perspectives yet. Share your craft updates or experiments!
                    </div>
                ) : (
                    perspectives.map((brief, index) => (
                        <motion.div
                            key={brief.id}
                            onClick={() => {
                                setSelectedBriefIndex(index);
                                setCurrentSlideIndex(0);
                            }}
                            whileHover={{ y: -3 }}
                            className="relative min-w-[180px] sm:min-w-[200px] h-[210px] bg-zinc-900 border border-white/5 hover:border-purple-500/40 rounded-2xl overflow-hidden cursor-pointer snap-start group shadow-md hover:shadow-xl transition-all flex-shrink-0 flex flex-col justify-between p-4"
                        >
                            {/* Card Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-950/80 to-black z-0 pointer-events-none" />

                            {/* Status Accent Strip */}
                            <div className={`absolute top-0 left-0 right-0 h-1 z-10 ${
                                brief.status === 'Perspective' ? 'bg-purple-500' : brief.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
                            }`} />

                            {/* Author Header */}
                            <div className="relative z-10 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden border border-white/10">
                                    {(brief.userId === 'u-current' ? userProfile.image : brief.userImage) ? (
                                        <img
                                            src={brief.userId === 'u-current' ? userProfile.image : brief.userImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white font-bold bg-gradient-to-tr from-purple-600 to-blue-600">
                                            {(brief.userId === 'u-current' ? userProfile.name : brief.userName).charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="overflow-hidden min-w-0">
                                    <p className="text-xs font-bold text-white truncate">
                                        {brief.userId === 'u-current' ? userProfile.name : brief.userName}
                                    </p>
                                    <p className="text-[10px] text-zinc-500 truncate">
                                        {brief.userId === 'u-current' ? (userProfile.bio?.split("•")[0]?.trim() || "Member") : brief.role}
                                    </p>
                                </div>
                            </div>

                            {/* Main Title Content */}
                            <div className="relative z-10 my-auto py-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full border ${
                                        brief.status === 'Perspective' ? 'text-purple-400 border-purple-500/20 bg-purple-500/10' :
                                        brief.status === 'In Progress' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                                        'text-amber-400 border-amber-500/20 bg-amber-500/10'
                                    }`}>
                                        {brief.status}
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3 group-hover:text-purple-300 transition-colors">
                                    {brief.title}
                                </h4>
                            </div>

                            {/* Footer meta */}
                            <div className="relative z-10 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                                <span>{brief.createdAt || "Recent"}</span>
                                <div className="flex items-center gap-1 text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                    <span>Reel</span>
                                    <span>→</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Creation Modal */}
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => { setIsCreating(false); stopCamera(); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar space-y-4"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span>Share Technical Perspective</span>
                                </h3>
                                <button onClick={() => { setIsCreating(false); stopCamera(); }} className="text-zinc-400 hover:text-white p-1 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Status Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-300">Craft Stage</label>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {(["Perspective", "In Progress", "Planning"] as PerspectiveStatus[]).map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setNewStatus(status)}
                                            className={`py-2 px-3 rounded-xl border font-medium transition-all ${
                                                newStatus === status
                                                    ? "bg-purple-600 border-purple-500 text-white font-bold"
                                                    : "bg-black/40 border-white/5 text-zinc-400 hover:text-white"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-300">Perspective Title</label>
                                <input
                                    type="text"
                                    value={newPerspectiveTitle}
                                    onChange={(e) => setNewPerspectiveTitle(e.target.value)}
                                    placeholder="e.g. Distributed State Handshake Analysis"
                                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-300">Perspective Insights / Deliverables</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={newPerspectiveContent}
                                    onChange={(e) => setNewPerspectiveContent(e.target.value)}
                                    placeholder="What architectural trade-offs, findings, or code milestones are you exploring?"
                                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 leading-relaxed"
                                />
                            </div>

                            {/* Camera / Image Upload Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-300">Visual Artifact / Snapshot (Optional)</label>

                                {isCameraOpen ? (
                                    <div className="relative w-full h-56 bg-black rounded-xl overflow-hidden border border-zinc-700">
                                        {cameraError ? (
                                            <div className="h-full flex flex-col items-center justify-center p-4 text-center text-amber-400 space-y-2">
                                                <AlertCircle size={24} />
                                                <p className="text-xs">{cameraError}</p>
                                                <button
                                                    onClick={stopCamera}
                                                    className="px-3 py-1 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                                <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                                                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-3">
                                                    <button
                                                        onClick={capturePhoto}
                                                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg"
                                                    >
                                                        Capture Snapshot
                                                    </button>
                                                    <button
                                                        onClick={stopCamera}
                                                        className="px-4 py-1.5 bg-black/60 hover:bg-black/80 text-white rounded-xl text-xs"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : newPerspectiveImage ? (
                                    <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-48">
                                        <img src={newPerspectiveImage} alt="Perspective Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setNewPerspectiveImage("")}
                                            className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-lg"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="flex-1 py-2.5 bg-black/40 hover:bg-zinc-800 border border-white/10 rounded-xl text-xs text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <Camera size={14} className="text-purple-400" />
                                            <span>Take Photo</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 py-2.5 bg-black/40 hover:bg-zinc-800 border border-white/10 rounded-xl text-xs text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <Upload size={14} className="text-blue-400" />
                                            <span>Upload Image</span>
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex justify-end gap-2 border-t border-white/5">
                                <button
                                    onClick={() => { setIsCreating(false); stopCamera(); }}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 text-xs rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreatePerspective}
                                    disabled={!newPerspectiveContent.trim()}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-purple-950/30"
                                >
                                    Share Perspective
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Slide Reel Viewer */}
            <AnimatePresence>
                {selectedBriefIndex !== null && perspectives[selectedBriefIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={closeViewer}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-950 w-full max-w-xl rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                                        {perspectives[selectedBriefIndex].userImage ? (
                                            <img src={perspectives[selectedBriefIndex].userImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold bg-purple-600">
                                                {perspectives[selectedBriefIndex].userName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">
                                            {perspectives[selectedBriefIndex].userName}
                                        </h3>
                                        <p className="text-zinc-400 text-xs">
                                            {perspectives[selectedBriefIndex].role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/30 font-mono">
                                        {perspectives[selectedBriefIndex].status}
                                    </span>
                                    <button onClick={closeViewer} className="p-1.5 text-zinc-400 hover:text-white rounded-lg">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto space-y-4 flex-1">
                                <h2 className="text-lg font-bold text-white">
                                    {perspectives[selectedBriefIndex].title}
                                </h2>

                                {perspectives[selectedBriefIndex].items?.[currentSlideIndex]?.url && (
                                    <div className="rounded-xl overflow-hidden border border-white/10 max-h-60">
                                        <img 
                                            src={perspectives[selectedBriefIndex].items[currentSlideIndex].url} 
                                            alt="" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <p className="text-sm text-zinc-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                    {perspectives[selectedBriefIndex].items?.[currentSlideIndex]?.content || "Exploring structural primitives and design trade-offs."}
                                </p>
                            </div>

                            {/* Footer Nav */}
                            <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                                <button
                                    onClick={handlePrevSlide}
                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-white"
                                >
                                    ← Previous
                                </button>
                                <span className="font-mono text-[11px]">
                                    Slide {currentSlideIndex + 1} of {perspectives[selectedBriefIndex].items?.length || 1}
                                </span>
                                <button
                                    onClick={handleNextSlide}
                                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold"
                                >
                                    Next →
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
