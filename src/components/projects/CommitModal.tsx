import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Shield, Zap, Lock, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import SkillScoreBadge from "@/components/ui/SkillScoreBadge";
import { useGlobalState } from "@/context/GlobalStateContext";
import { SkillStats, calculateSkillScore } from "@/lib/ai/skill-engine";

interface Role {
    title: string;
    minScore: number;
}

interface CommitModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectTitle: string;
    userStats: SkillStats;
    roles?: Role[];
}

export default function CommitModal({ isOpen, onClose, projectTitle, userStats, roles = [] }: CommitModalProps) {
    const [step, setStep] = useState<"role_selection" | "staking" | "success">("role_selection");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Calculate User Score once
    const userScore = calculateSkillScore(userStats).formatted;

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setStep("role_selection");
            setSelectedRole(null);
            // Default to first eligible role if any
            if (roles && roles.length > 0) {
                // Or just let them pick
            }
        }
    }, [isOpen, roles]);

    const { commitToProject } = useGlobalState();

    const handleCommit = () => {
        if (!selectedRole) return;
        if (userScore < selectedRole.minScore) return; // Strict enforcement

        setStep("staking");

        // Execute Staking Transaction
        setTimeout(() => {
            const success = commitToProject(selectedRole.minScore);
            if (success) {
                setStep("success");
            }
        }, 2000); // Keep animation delay for UX
    };

    const isEligible = selectedRole ? userScore >= selectedRole.minScore : false;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-zinc-900/50">
                            <h3 className="text-white font-bold text-sm">Application for {projectTitle}</h3>
                            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body Container */}
                        <div className="p-6 relative min-h-[400px] flex flex-col">

                            {/* Step 1: Role Selection & Validation */}
                            {step === "role_selection" && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="w-full h-full flex flex-col"
                                >
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-950/50 rounded-xl border border-white/5">
                                        <SkillScoreBadge stats={userStats} size="md" />
                                        <div>
                                            <p className="text-zinc-500 text-xs">Your Orbit Score</p>
                                            <p className="text-white font-bold text-xl">{userScore.toLocaleString()}</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Status</div>
                                            <div className="text-green-400 font-mono text-xs">VERIFIED</div>
                                        </div>
                                    </div>

                                    <h4 className="text-white font-bold mb-3">Select a Role to Commit</h4>

                                    <div className="flex-1 space-y-2 mb-6 overflow-y-auto max-h-[200px] custom-scrollbar">
                                        {roles.length > 0 ? roles.map((role, idx) => {
                                            const eligible = userScore >= role.minScore;
                                            const isSelected = selectedRole?.title === role.title;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedRole(role)}
                                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected
                                                        ? "bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/50"
                                                        : "bg-zinc-800/50 border-white/5 hover:bg-zinc-800"
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-start">
                                                        <span className={`font-medium text-sm ${isSelected ? "text-white" : "text-zinc-300"}`}>
                                                            {role.title}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="text flex flex-col items-end">
                                                            <span className="text-[10px] text-zinc-500">Required Score</span>
                                                            <span className={`text-sm font-mono font-bold ${eligible ? "text-zinc-400" : "text-red-400"}`}>
                                                                {role.minScore}+
                                                            </span>
                                                        </div>
                                                        {eligible ? (
                                                            isSelected ? <Check size={18} className="text-blue-400" /> : <div className="w-[18px]" />
                                                        ) : (
                                                            <Lock size={16} className="text-red-500/50" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        }) : (
                                            <div className="text-center py-8 text-zinc-500 italic">
                                                No specific roles listed. You can generally commit.
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="mt-auto pt-4 border-t border-white/5">
                                        {selectedRole ? (
                                            isEligible ? (
                                                <button
                                                    onClick={handleCommit}
                                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
                                                >
                                                    <Shield size={16} /> Stake Score & Apply
                                                </button>
                                            ) : (
                                                <div className="w-full py-3 bg-red-900/20 border border-red-500/20 text-red-400 font-medium rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                                    <AlertTriangle size={16} /> Score Too Low ({selectedRole.minScore - userScore} pts missing)
                                                </div>
                                            )
                                        ) : (
                                            <button disabled className="w-full py-3 bg-zinc-800 text-zinc-500 font-medium rounded-xl cursor-not-allowed">
                                                Select a Role
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Staking Animation */}
                            {step === "staking" && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10"
                                >
                                    <div className="relative w-20 h-20 mb-4">
                                        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Zap size={24} className="text-white animate-pulse" />
                                        </div>
                                    </div>
                                    <h4 className="text-white font-bold animate-pulse">Verifying Proof of Work...</h4>
                                    <p className="text-zinc-500 text-xs mt-1">Checking {selectedRole?.title} Requirements</p>
                                </motion.div>
                            )}

                            {/* Step 3: Success */}
                            {step === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    className="w-full flex flex-col items-center gap-4 py-4 justify-center h-full"
                                >
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2 border border-green-500/20">
                                        <Check size={32} className="text-green-500" />
                                    </div>

                                    <div className="space-y-1 text-center">
                                        <h4 className="text-white font-bold text-xl">Application Sent!</h4>
                                        <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                                            You have successfully staked your Orbit Score for the <strong>{selectedRole?.title}</strong> role.
                                        </p>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="mt-6 px-8 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Return to Project
                                    </button>
                                </motion.div>
                            )}

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
