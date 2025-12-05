"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

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
        <div className="min-h-screen bg-black flex relative">
            <Link href="/" className="absolute top-8 left-1/2 -translate-x-1/2 z-50 hover:opacity-80 transition-opacity">
                <div className="w-24 h-24 flex items-center justify-center">
                    <img src="/logo.png" alt="Loominn" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
            </Link>

            {/* Left Side - Grandeur Abstract Art (25%) */}
            <div className="w-1/4 relative hidden lg:block overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900">
                    <img
                        src="/login-abstract.png"
                        alt="Abstract Art"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay" />
                    {/* Seamless fade to right */}
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent pt-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="w-12 h-1 bg-white mb-6 rounded-full" />
                            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Ignite Your<br />Creative Spirit</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed">Join thousands of creators shaping the future of digital art and design.</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Side - Modern Login Form (75%) */}
            <div className="w-3/4 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Background ambient effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md space-y-8 relative z-10"
                >
                    <div className="flex flex-col items-start space-y-2 mb-8">

                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            transition={{ duration: 2.5, ease: "linear" }}
                            className="overflow-hidden whitespace-nowrap mb-6"
                        >
                            <h2
                                className={`${pacifico.className} text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 drop-shadow-lg`}
                                style={{ lineHeight: 1.4, paddingRight: '0.2em' }}
                            >
                                Loominn
                            </h2>
                        </motion.div>

                        <h1 className="text-5xl font-bold text-white tracking-tight leading-[1.1]">
                            Welcome back
                        </h1>
                        <p className="text-zinc-400 text-lg">Enter your details to access your creative space.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleLogin("google")}
                            disabled={!!isLoading}
                            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold h-14 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-white/5"
                        >
                            {isLoading === "google" ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h5.25c-.23 1.23-1 2.27-2.12 3.02v2.51h3.43c2.01-1.85 3.17-4.57 3.17-7.63 0-.74-.06-1.46-.16-2.63z" /><path fill="currentColor" d="M12.18 21.02c2.58 0 4.74-.86 6.32-2.33l-3.43-2.51c-.86.58-1.95.92-3.17.92-2.48 0-4.59-1.68-5.34-3.92h-3.55v2.75c1.76 3.49 5.37 5.09 9.17 5.09z" /><path fill="currentColor" d="M6.84 13.18c-.19-.57-.3-1.18-.3-1.8s.1-1.23.3-1.8v-2.75h-3.55c-.71 1.4-1.12 3-1.12 4.55s.41 3.15 1.12 4.55l3.55-2.75z" /><path fill="currentColor" d="M12.18 5.73c1.4 0 2.66.49 3.65 1.43l2.7-2.69c-1.65-1.54-3.79-2.47-6.35-2.47-3.8 0-7.41 1.6-9.17 5.09l3.55 2.75c.75-2.24 2.86-3.92 5.34-3.92z" /></svg>
                                    <span className="text-lg">Continue with Google</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => handleLogin("apple")}
                            disabled={!!isLoading}
                            className="w-full bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white border border-white/5 font-semibold h-14 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isLoading === "apple" ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.07 19.33c-.7.98-1.88 1.93-3.17 1.93-1.13 0-1.88-.66-3.12-.66-1.29 0-1.93.64-3.08.64-1.34 0-2.64-1.15-3.59-2.61-1.88-2.88-1.55-7.14 1.48-8.52 1.34-.61 2.39-.14 3.09-.14 1.03 0 1.83-.56 3.24-.56 1.18 0 2.22.42 2.9.98-1.29.83-2.07 2.27-2.07 3.73 0 2.8 2.01 3.98 2.12 4.02-.03.09-.34 1.25-.8 2.51zm-5.01-16.7c.61-.75 1.05-1.8 1.05-2.63 0-.17 0-.34-.03-.49-1.01.03-2.22.69-2.93 1.54-.58.67-.98 1.57-.96 2.45 1.12.09 2.24-.46 2.87-.87z" /></svg>
                                    <span className="text-lg">Continue with Apple</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-black px-4 text-zinc-600 font-medium">Test Access</span></div>
                    </div>

                    <form onSubmit={handleTestLogin}>
                        <button
                            type="submit"
                            disabled={!!isLoading}
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold h-14 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/20"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <div className="relative flex items-center justify-center gap-2">
                                {isLoading === "credentials" ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <span>Quick Login (Test User)</span>
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <p className="text-center text-xs text-zinc-600 mt-8">
                        By continuing, you agree to Loominn's <a href="#" className="underline hover:text-zinc-400">Terms of Service</a> and <a href="#" className="underline hover:text-zinc-400">Privacy Policy</a>.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
