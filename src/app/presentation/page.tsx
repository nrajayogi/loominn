"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, X, Video, Code, Globe, Zap, Users, Shield, TrendingUp, Layers, Rocket } from "lucide-react";
import Link from "next/link";

const SLIDES = [
    {
        id: 1,
        title: "LOOMINN",
        subtitle: "The Future of Meritocratic Talent",
        tagline: "Don't tell us what you did. Show us what you built.",
        type: "hero",
        bgGradient: "from-blue-950 via-black to-black"
    },
    {
        id: 2,
        title: "The Problem",
        subtitle: "The Resume Trust Crisis",
        content: [
            "Static & Verify-Last: Resumes are text claims, not proof.",
            "Signal-to-Noise: 80% of hiring time is filtering.",
            "Credential Wall: Talent hidden behind missing keywords."
        ],
        quote: "\"The resume looks great, but they can't code.\" — Every Hiring Manager",
        type: "standard",
        icon: Shield,
        accent: "text-red-400",
        citation: "Kline, P., Rose, E., & Walters, C. (2021). Systemic Discrimination Among Large U.S. Employers. NBER Working Paper No. 29053."
    },
    {
        id: 3,
        title: "The Cost",
        subtitle: "The 'HR Infrastructure' Black Hole",
        content: [
            "Bloated Tech Stack: Expensive ATS & Screening tools.",
            "Human Cost: Thousands of hours on screening.",
            "Turnover Tax: Bad hires cost 30% of annual salary."
        ],
        type: "standard",
        icon: TrendingUp,
        accent: "text-orange-400",
        citation: "U.S. Department of Labor. (2023). Cost of a Bad Hire Report. Estimated at 30% of employee's first-year earnings."
    },
    {
        id: 4,
        title: "The Bias",
        subtitle: "The Opportunity Gap",
        content: [
            "Geography ≠ Destiny: Remote talent is often invisible.",
            "Paper Bias: Prestige over Output.",
            "Upskilling Disconnect: Talent guesses what to learn."
        ],
        type: "standard",
        icon: Globe,
        accent: "text-yellow-400",
        citation: "Bloom, N., et al. (2023). Hybrid Working From Home Works Out. NBER Working Paper; Nature (Trip.com study)."
    },
    {
        id: 5,
        title: "The Solution",
        subtitle: "Loominn: Verified Talent Protocol",
        content: [
            "Proof-of-Work: Output defines rank, not claims.",
            "Holistic Profile: vResume (Soft) + Commits (Hard).",
            "Trust-First: Verification happens BEFORE you see them."
        ],
        type: "standard",
        icon: Zap,
        accent: "text-blue-400"
    },
    {
        id: 6,
        title: "vResume",
        subtitle: "Decentralizing Personality",
        content: [
            "Dynamic Video Intro: Soft skills & passion on display.",
            "Gut Check: Assess fit in 30 seconds.",
            "Bypass Bias: Speak directly to decision makers."
        ],
        type: "feature",
        icon: Video,
        image: "vResume",
        accent: "text-purple-400"
    },
    {
        id: 7,
        title: "Commit Ledger",
        subtitle: "The New Currency of Hiring",
        content: [
            "Metric: Projects Shipped > Years of Experience.",
            "Verification: Collaborative history is tracked.",
            "Meritocracy: You can't inflate a commit ledger."
        ],
        type: "feature",
        icon: Code,
        image: "Ledger",
        accent: "text-green-400"
    },
    {
        id: 8,
        title: "Orbit Engine",
        subtitle: "AI-Driven Discovery",
        content: [
            "Capability Matching: Finds talent by verified output.",
            "The Graph: Connects skills automatically.",
            "Zero-Search: Talent 'Orbits' into view."
        ],
        type: "feature",
        icon: Rocket,
        image: "Orbit",
        accent: "text-cyan-400"
    },
    {
        id: 9,
        title: "Business Value",
        subtitle: "Reducing Infrastructure Costs",
        content: [
            "Slash Screening: Loominn acts as the primary filter.",
            "Lean HR: Enterprise-grade scouting for startups.",
            "Pay-for-Performance: Secure talent, don't just post ads."
        ],
        type: "standard",
        icon: TrendingUp,
        accent: "text-emerald-400"
    },
    {
        id: 10,
        title: "Social Impact",
        subtitle: "Equal Opportunity",
        content: [
            "Blind Evaluation: Code has no gender or geography.",
            "The Great Equalizer: Output over Ivy League degrees.",
            "Global Access: A stage for anyone who builds."
        ],
        type: "standard",
        icon: Users,
        accent: "text-pink-400"
    },
    {
        id: 11,
        title: "Market Validation",
        subtitle: "Why Now?",
        content: [
            "Gig Economy: Shift to Project-Based work.",
            "Remote Trust: Geography is irrelevant, trust is key.",
            "AI Disruption: Human judgment & shipping is premium."
        ],
        type: "standard",
        icon: Layers,
        accent: "text-indigo-400",
        citation: "World Economic Forum. (2025). The Future of Jobs Report 2025. Skill gaps cited as top barrier to transformation."
    },
    {
        id: 12,
        title: "The Vision",
        subtitle: "Building the Standard",
        content: [
            "Vision: 'Loominn Verified' as the global credential.",
            "Ask: Join us in building the infrastructure.",
            "Investment: Scaling the Orbit Engine."
        ],
        type: "hero",
        bgGradient: "from-indigo-950 via-purple-950 to-black"
    }
];

export default function PresentationPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        if (currentSlide < SLIDES.length - 1) {
            setDirection(1);
            setCurrentSlide((prev) => prev + 1);
        }
    }, [currentSlide]);

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

    const slide = SLIDES[currentSlide];

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
                    <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Loominn Deck</span>
                </div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
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
            <div className="relative w-full h-full flex items-center justify-center p-8 md:p-16">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentSlide}
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
                        className="absolute w-full max-w-6xl aspect-[16/9] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl p-12 md:p-20 flex flex-col justify-center overflow-hidden"
                    >
                        {/* Slide Glow */}
                        <div className={`absolute top-0 right-0 p-64 ${slide.accent?.replace("text", "bg") || "bg-blue-500"}/10 blur-[120px] rounded-full pointer-events-none opacity-50`}></div>

                        <div className="relative z-10 w-full h-full flex flex-col justify-center">
                            {slide.type === "hero" ? (
                                <div className="text-center space-y-8">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium tracking-wider mb-4"
                                    >
                                        PITCH DECK 2025
                                    </motion.div>
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-7xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500"
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
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center h-full">
                                    <div className="space-y-10">
                                        <div>
                                            <div className={`flex items-center gap-3 ${slide.accent} mb-4`}>
                                                {slide.icon && <slide.icon size={24} />}
                                                <span className="text-sm font-bold uppercase tracking-[0.2em]">0{currentSlide + 1} // {slide.id < 10 ? `0${slide.id}` : slide.id}</span>
                                            </div>
                                            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">{slide.title}</h2>
                                            <h3 className="text-2xl text-zinc-400 font-light border-l-2 border-white/10 pl-6">{slide.subtitle}</h3>
                                        </div>

                                        <div className="space-y-6">
                                            {slide.content?.map((point, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                                    className="flex items-start gap-4 text-xl text-zinc-300 font-light"
                                                >
                                                    <div className={`mt-2 w-1.5 h-1.5 rounded-full ${slide.accent?.replace("text", "bg") || "bg-white"}`} />
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
                                    <div className="h-full w-full flex items-center justify-center p-8">
                                        <div className="w-full aspect-square relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent?.replace("text", "from") || "from-blue-500"}/20 to-transparent rounded-[2rem] transform rotate-3 group-hover:rotate-6 transition-transform duration-500`} />
                                            <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center -rotate-3 group-hover:-rotate-0 transition-transform duration-500 shadow-2xl">
                                                {slide.icon && <slide.icon size={160} className={`${slide.accent} opacity-50 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]`} />}

                                                {/* Decorative Grid */}
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] rounded-[2rem]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer / Controls / Citations Dock */}
            <div className="absolute bottom-0 left-0 w-full h-24 px-12 pb-8 flex justify-between items-end z-50 pointer-events-none">

                {/* LEFT: Branding */}
                <div className="text-xs text-zinc-600 font-mono hidden md:block w-64">
                    LOOMINN.PROD.V1 // 2025
                </div>

                {/* CENTER: Navigation */}
                <div className="flex items-center gap-6 pointer-events-auto">
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
                </div>

                {/* RIGHT: Citations */}
                <div className="w-64 flex justify-end pointer-events-auto min-h-[40px]">
                    <AnimatePresence mode="wait">
                        {slide.citation && (
                            <motion.div
                                key={slide.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 10, opacity: 0 }}
                                className="group relative"
                            >
                                <div className="bg-zinc-900 backdrop-blur-md border border-white/20 rounded-full pl-4 pr-4 py-2 text-xs font-mono text-zinc-400 transition-all duration-300 hover:bg-zinc-800 hover:scale-105 shadow-xl flex items-center gap-3 cursor-help">
                                    <span className="font-bold text-blue-400">REF</span>
                                    <div className="h-4 w-[1px] bg-white/20"></div>
                                    <span className="max-w-[150px] md:max-w-[300px] truncate group-hover:max-w-none group-hover:whitespace-normal transition-all duration-300">{slide.citation}</span>

                                    {/* Pulse Indicator */}
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>


        </div>
    );
}
