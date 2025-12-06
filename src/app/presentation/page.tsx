
"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Video, Code, Globe, Zap, Users, Shield, TrendingUp, Layers, Rocket, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DECK_VARIANTS, SlideData } from "@/lib/data/presentation-decks";
import FounderContactWidget from "@/components/presentation/FounderContactWidget";

function PresentationContent() {
    const searchParams = useSearchParams();
    const deckParam = searchParams.get("deck");
    const deckId = (deckParam && DECK_VARIANTS[deckParam]) ? deckParam : "standard";
    const SLIDES: SlideData[] = DECK_VARIANTS[deckId];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    // Reset slide when deck changes
    useEffect(() => {
        setCurrentSlide(0);
    }, [deckId]);

    const nextSlide = useCallback(() => {
        if (currentSlide < SLIDES.length - 1) {
            setDirection(1);
            setCurrentSlide((prev) => prev + 1);
        }
    }, [currentSlide, SLIDES.length]);

    const prevSlide = useCallback(() => {
        if (currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide((prev) => prev - 1);
        }
    }, [currentSlide]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") nextSlide();
            if (e.key === "ArrowLeft") prevSlide();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextSlide, prevSlide]);

    const slide = SLIDES[currentSlide] || SLIDES[0];

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
            rotateY: dir > 0 ? 45 : -45
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0
        },
        exit: (dir: number) => ({
            zIndex: 0,
            x: dir < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
            rotateY: dir < 0 ? 45 : -45
        })
    };

    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden relative font-sans perspective-1000">
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient || "from-zinc-900 to-black"} transition-colors duration-1000`} />
            <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            {/* Orbital Rings Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] border border-white/5 rounded-full border-dashed opacity-20"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[30%] -left-[30%] w-[160%] h-[160%] border border-white/5 rounded-full border-dashed opacity-20"
                />
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Loominn" className="h-8 object-contain" />
                    <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                        {deckId === 'company' ? 'Loominn Enterprise' : deckId === 'gov' ? 'Loominn Public' : 'Loominn Deck'}
                    </span>
                </div>

                {/* Deck Switcher (Center Header) */}
                <div className="hidden md:flex gap-4 p-2 bg-white/5 backdrop-blur-md rounded-full border border-white/5 absolute left-1/2 transform -translate-x-1/2">
                    {[
                        { id: 'standard', label: 'Investor' },
                        { id: 'company', label: 'Company' },
                        { id: 'gov', label: 'Government' }
                    ].map((mode) => (
                        <Link
                            key={mode.id}
                            href={`/presentation?deck=${mode.id}`}
                            className={`text-xs font-mono px-3 py-1 rounded-full transition-all ${deckId === mode.id ? 'bg-blue-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white hover:bg-white/10'} `}
                        >
                            {mode.label}
                        </Link>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10 pointer-events-none">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}% ` }}
                        className="h-full bg-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    />
                </div>

                <Link href="/">
                    <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors border border-white/5 backdrop-blur-md">
                        <X size={20} />
                    </button>
                </Link>
            </div>

            {/* Stage */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={`${deckId} -${currentSlide} `}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 200, damping: 25 },
                            opacity: { duration: 0.2 },
                            rotateY: { duration: 0.4 }
                        }}
                        className="absolute w-full max-w-[95vw] h-[80vh] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col justify-center overflow-hidden"
                    >
                        {/* Slide Glow */}
                        <div className={`absolute top - 0 right - 0 p - 64 ${slide.accent?.replace("text", "bg") || "bg-blue-500"} /10 blur-[120px] rounded-full pointer-events-none opacity-50`}></div >

                        <div className="relative z-10 w-full h-full flex flex-col justify-center text-center md:text-left">
                            {slide.type === "hero" ? (
                                <div className="text-center space-y-6 flex flex-col items-center justify-center h-full">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.7, ease: "easeOut" }}
                                        className="mb-2"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/loominn_logo_v2.png" alt="Loominn Logo" className="h-32 md:h-48 object-contain drop-shadow-[0_0_50px_rgba(168,85,247,0.4)]" />
                                    </motion.div>

                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium tracking-wider mb-2"
                                    >
                                        PITCH DECK 2025
                                    </motion.div>
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-6xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500"
                                    >
                                        {slide.title}
                                    </motion.h1>
                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl md:text-4xl text-zinc-400 font-light"
                                    >
                                        {slide.subtitle}
                                    </motion.h2>
                                    {slide.tagline && (
                                        <motion.p
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-xl text-blue-400 italic mt-8 font-serif"
                                        >
                                            {slide.tagline}
                                        </motion.p>
                                    )}
                                </div>
                            ) : slide.type === "skill-score" ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center p-8 relative overflow-hidden">
                                    {/* Background FX */}
                                    <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                                    <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />

                                    {/* Left: The Logic */}
                                    <div className="flex flex-col items-center lg:items-start space-y-8">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full"
                                        >
                                            <h3 className="text-zinc-500 font-mono uppercase tracking-widest text-sm mb-6">Algorithm V4.2 Blueprint</h3>

                                            <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl font-bold font-mono text-zinc-300">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-green-400">Velocity</span>
                                                    <span className="text-xs text-zinc-500 font-sans font-normal mt-1">Commits/Wk</span>
                                                </div>
                                                <span className="text-zinc-600">×</span>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-purple-400">Complexity</span>
                                                    <span className="text-xs text-zinc-500 font-sans font-normal mt-1">Code Graph</span>
                                                </div>
                                                <span className="text-zinc-600">÷</span>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-red-400">Risk</span>
                                                    <span className="text-xs text-zinc-500 font-sans font-normal mt-1">Bug Rate</span>
                                                </div>
                                            </div>

                                            <div className="w-full h-px bg-white/10 my-6" />

                                            <div className="flex items-center justify-between">
                                                <span className="text-lg text-zinc-400">Trust Score</span>
                                                <span className="text-4xl font-bold text-white tracking-tighter">98<span className="text-lg text-zinc-600 font-normal">/100</span></span>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Right: The Value */}
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-4xl font-bold text-white mb-2">Quantified Trust</h2>
                                            <p className="text-xl text-zinc-400 font-light">Why verify manually what can be proven algorithmically?</p>
                                        </div>

                                        <div className="space-y-4">
                                            {slide.content?.map((point, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ x: 20, opacity: 0 }}
                                                    whileInView={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                        <Shield size={20} />
                                                    </div>
                                                    <span className="text-lg text-zinc-200">{point}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : slide.type === "founders" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/10 bg-black/50">
                                    {[slide.founder1, slide.founder2].map((founder, idx) => (
                                        <div
                                            key={idx}
                                            className="relative h-full w-full group overflow-hidden bg-zinc-900"
                                            onMouseEnter={(e) => {
                                                const video = e.currentTarget.querySelector('video');
                                                if (video) video.play();
                                            }}
                                            onMouseLeave={(e) => {
                                                const video = e.currentTarget.querySelector('video');
                                                if (video) {
                                                    video.pause();
                                                    video.currentTime = 0;
                                                }
                                            }}
                                        >
                                            {/* Video Background (Mock) */}
                                            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                                                {founder?.videoSrc ? (
                                                    <video
                                                        src={founder.videoSrc}
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                                                        playsInline
                                                        loop
                                                        poster={founder.image}
                                                    />
                                                ) : founder?.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={founder.image} alt={founder.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black">
                                                        <Video size={48} className="text-zinc-600 opacity-50" />
                                                    </div>
                                                )}

                                                {/* Play Button Overlay - Only show if NO video or if video is paused (handled by hover logic visually) */}
                                                {!founder?.videoSrc && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all">
                                                            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                                >
                                                    <h3 className="text-3xl font-bold text-white mb-1">{founder?.name}</h3>
                                                    <p className="text-blue-400 font-mono text-sm tracking-wider uppercase">{founder?.role}</p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center h-full">
                                    <div className="space-y-10 flex flex-col justify-center order-2 md:order-1">
                                        <div>
                                            <div className={`flex items-center gap-3 ${slide.accent} mb-4 justify-center md:justify-start`}>
                                                {slide.icon && <slide.icon size={24} />}
                                                <span className="text-sm font-bold uppercase tracking-[0.2em]">0{currentSlide + 1} // {slide.id < 10 ? `0${slide.id}` : slide.id}</span>
                                            </div>
                                            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">{slide.title}</h2>
                                            <h3 className="text-2xl md:text-3xl text-zinc-400 font-light border-l-0 md:border-l-2 border-white/10 pl-0 md:pl-6">{slide.subtitle}</h3>
                                        </div>

                                        <div className="space-y-6">
                                            {slide.content?.map((point, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                                    className="flex items-start gap-4 text-xl md:text-2xl text-zinc-300 font-light"
                                                >
                                                    <div className={`mt-2.5 w-1.5 h-1.5 rounded-full ${slide.accent?.replace("text", "bg") || "bg-white"} flex-shrink-0`} />
                                                    {point}
                                                </motion.div>
                                            ))}
                                        </div>

                                        {slide.quote && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8 }}
                                                className="p-6 bg-white/5 border border-white/5 rounded-2xl italic text-zinc-400"
                                            >
                                                {slide.quote}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Visual Side */}
                                    <div className="h-full w-full flex items-center justify-center p-8 order-1 md:order-2">
                                        <div className="w-full aspect-square max-w-[500px] relative group perspective-1000">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent?.replace("text", "from") || "from-blue-500"}/20 to-transparent rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500`} />
                                            <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center -rotate-3 group-hover:-rotate-0 transition-transform duration-500 shadow-2xl">
                                                {slide.icon && <slide.icon size={200} className={`${slide.accent} opacity-50 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]`} />}

                                                {/* Decorative Grid */}
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] rounded-3xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div >
                </AnimatePresence >
            </div >

            {/* Footer / Controls / Citations Dock */}
            < div className="absolute bottom-0 left-0 w-full h-24 px-12 pb-8 flex justify-between items-end z-50 pointer-events-none" >

                {/* LEFT: Branding */}
                < div className="text-xs text-zinc-600 font-mono hidden md:block w-64" >
                    LOOMINN.PROD.V1 // 2025
                </div >

                {/* CENTER: Navigation */}
                < div className="flex items-center gap-6 pointer-events-auto" >
                    <button
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 backdrop-blur-md border border-white/5 transition-all hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        {SLIDES.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentSlide ? "w-8 bg-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        disabled={currentSlide === SLIDES.length - 1}
                        className="p-3 rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-transparent"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div >

                {/* RIGHT: Citations */}
                < div className="w-64 flex justify-end pointer-events-auto min-h-[40px]" >
                    <AnimatePresence mode="wait">
                        {slide.citation && (
                            <motion.div
                                key={slide.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="group relative"
                            >
                                <div className="bg-black border-2 border-zinc-800 rounded-lg p-3 max-w-[250px] shadow-2xl flex flex-col gap-2">
                                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Live Reference
                                    </div>
                                    <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2">
                                        {slide.citation}
                                    </p>
                                    {slide.citationLink && (
                                        <Link href={slide.citationLink} target="_blank" className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1 font-bold tracking-wide uppercase">
                                            Open Source <Rocket size={10} />
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div >
            </div >

            <FounderContactWidget deckId={deckId} />


        </div >
    );
}

export default function PresentationPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen bg-black flex items-center justify-center text-white">
                <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        }>
            <PresentationContent />
        </Suspense>
    );
}
