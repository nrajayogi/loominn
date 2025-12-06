"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, ChevronDown, CheckCircle } from "lucide-react";

export default function FounderContactWidget({ deckId }: { deckId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0); // 0: Input, 1: Success

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending
        setTimeout(() => {
            setStep(1);
            // Reset after a delay
            setTimeout(() => {
                setIsOpen(false);
                setStep(0);
            }, 3000);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-[350px] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900 to-zinc-900 p-4 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center overflow-hidden">
                                        <User size={16} className="text-zinc-400" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center overflow-hidden">
                                        <User size={16} className="text-zinc-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Founding Team</h3>
                                    <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Usually replies in 1h
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 bg-zinc-900">
                            {step === 0 ? (
                                <form onSubmit={handleSend} className="space-y-4">
                                    <p className="text-sm text-zinc-300">
                                        Hi! We're building the future of verify-first hiring. Questions about the
                                        <span className="text-blue-400 font-bold ml-1">{deckId === 'gov' ? 'Public Sector' : deckId === 'company' ? 'Enterprise' : 'Investor'}</span> deck?
                                    </p>

                                    <div className="space-y-3">
                                        <input
                                            type="email"
                                            required
                                            placeholder="Your work email"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <textarea
                                            required
                                            placeholder="How can we help?"
                                            rows={3}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black font-bold py-2 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Send Message <Send size={16} />
                                    </button>
                                </form>
                            ) : (
                                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        type="spring"
                                        className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2"
                                    >
                                        <CheckCircle size={32} />
                                    </motion.div>
                                    <h4 className="text-white font-bold">Message Sent!</h4>
                                    <p className="text-sm text-zinc-400 px-4">
                                        Thanks for reaching out. One of us will get back to you shortly.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-black/20 border-t border-white/5 text-[10px] text-zinc-600 text-center">
                            Powered by Loominn Connect
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center justify-center gap-3 bg-white text-black px-5 py-3 rounded-full shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                    >
                        <div className="relative">
                            <MessageCircle size={20} />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                        </div>
                        <span className="font-bold text-sm">Talk to Founders</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
