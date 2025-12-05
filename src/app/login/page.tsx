"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleLogin = async (provider: string) => {
        setIsLoading(provider);
        try {
            await signIn(provider, { callbackUrl: "/feed" });
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(null);
        }
    };

    const handleTestLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading("credentials");
        await signIn("credentials", {
            email: "test@loominn.com",
            password: "password123",
            callbackUrl: "/feed"
        });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-white tracking-tighter">Loominn</h1>
                    <p className="text-zinc-500">The Creative Network for Professionals</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl space-y-6 backdrop-blur-xl">
                    <div className="space-y-4">
                        <button
                            onClick={() => handleLogin("google")}
                            disabled={!!isLoading}
                            className="w-full bg-white text-black font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {isLoading === "google" ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h5.25c-.23 1.23-1 2.27-2.12 3.02v2.51h3.43c2.01-1.85 3.17-4.57 3.17-7.63 0-.74-.06-1.46-.16-2.63z" /><path fill="currentColor" d="M12.18 21.02c2.58 0 4.74-.86 6.32-2.33l-3.43-2.51c-.86.58-1.95.92-3.17.92-2.48 0-4.59-1.68-5.34-3.92h-3.55v2.75c1.76 3.49 5.37 5.09 9.17 5.09z" /><path fill="currentColor" d="M6.84 13.18c-.19-.57-.3-1.18-.3-1.8s.1-1.23.3-1.8v-2.75h-3.55c-.71 1.4-1.12 3-1.12 4.55s.41 3.15 1.12 4.55l3.55-2.75z" /><path fill="currentColor" d="M12.18 5.73c1.4 0 2.66.49 3.65 1.43l2.7-2.69c-1.65-1.54-3.79-2.47-6.35-2.47-3.8 0-7.41 1.6-9.17 5.09l3.55 2.75c.75-2.24 2.86-3.92 5.34-3.92z" /></svg>
                                    Continue with Google
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => handleLogin("apple")}
                            disabled={!!isLoading}
                            className="w-full bg-black text-white border border-white/20 font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors disabled:opacity-50"
                        >
                            {isLoading === "apple" ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.07 19.33c-.7.98-1.88 1.93-3.17 1.93-1.13 0-1.88-.66-3.12-.66-1.29 0-1.93.64-3.08.64-1.34 0-2.64-1.15-3.59-2.61-1.88-2.88-1.55-7.14 1.48-8.52 1.34-.61 2.39-.14 3.09-.14 1.03 0 1.83-.56 3.24-.56 1.18 0 2.22.42 2.9.98-1.29.83-2.07 2.27-2.07 3.73 0 2.8 2.01 3.98 2.12 4.02-.03.09-.34 1.25-.8 2.51zm-5.01-16.7c.61-.75 1.05-1.8 1.05-2.63 0-.17 0-.34-.03-.49-1.01.03-2.22.69-2.93 1.54-.58.67-.98 1.57-.96 2.45 1.12.09 2.24-.46 2.87-.87z" /></svg>
                                    Continue with Apple
                                </>
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#121212] px-2 text-zinc-500">Or continue with</span></div>
                    </div>

                    <form onSubmit={handleTestLogin} className="space-y-4">
                        <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                            <p className="text-xs text-zinc-400 mb-3 text-center">Development Mode: Test Account</p>
                            <button
                                type="submit"
                                disabled={!!isLoading}
                                className="w-full bg-blue-600 text-white font-bold h-10 rounded-lg text-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
                            >
                                {isLoading === "credentials" ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Quick Login (Test User)"}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
