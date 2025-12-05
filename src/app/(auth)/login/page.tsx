"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 shadow-2xl"
        >
            <div className="text-center mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
                    <span className="text-white font-bold text-2xl">L</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-zinc-400 text-sm">Sign in to continue to LoomInn</p>
            </div>

            <form className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="email"
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                        <Link href="/auth/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="password"
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group">
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-zinc-500 text-sm">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-white font-medium hover:text-primary transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
