"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Shield, Zap, Lock, AlertTriangle, Info, Send, ExternalLink, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import SkillScoreBadge from "@/components/ui/SkillScoreBadge";
import { useGlobalState } from "@/context/GlobalStateContext";
import { SkillStats, calculateSkillScore } from "@/lib/ai/skill-engine";
import { DEFAULT_NEW_USER_STATS } from "@/lib/types/schema";

interface Role {
    title: string;
    minScore: number;
    filled?: boolean;
}

interface CommitModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId?: string | number;
    projectTitle: string;
    userStats?: SkillStats;
    roles?: Role[];
}

export default function CommitModal({ 
    isOpen, 
    onClose, 
    projectId = "proj-default", 
    projectTitle, 
    userStats, 
    roles = [] 
}: CommitModalProps) {
    const { commitToProject, applyToRole, userProfile } = useGlobalState();
    const [step, setStep] = useState<"role_selection" | "staking" | "success">("role_selection");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [motivation, setMotivation] = useState("");
    const [evidenceLink, setEvidenceLink] = useState("");
    const [showFormula, setShowFormula] = useState(false);

    // Calculate User Score once using userProfile stats or fallback
    const effectiveStats: SkillStats = userStats || (userProfile?.stats ? {
        velocity: userProfile.stats.velocity,
        projectsCompleted: userProfile.stats.projectsCompleted,
        onTimeCompletion: userProfile.stats.onTimeCompletion,
        complexity: userProfile.stats.complexity,
        risk: userProfile.stats.risk
    } : DEFAULT_NEW_USER_STATS);

    const userScore = calculateSkillScore(effectiveStats).formatted;

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setStep("role_selection");
            setSelectedRole(null);
            setMotivation("");
            setEvidenceLink("");
            setShowFormula(false);
            // Default to first role if available
            if (roles.length > 0) {
                setSelectedRole(roles[0]);
            }
        }
    }, [isOpen, roles]);

    const isEligible = selectedRole ? userScore >= selectedRole.minScore : false;
    const scoreGap = selectedRole && !isEligible ? selectedRole.minScore - userScore : 0;

    const handleSubmitApplication = () => {
        if (!selectedRole) return;

        setStep("staking");

        setTimeout(() => {
            // If eligible, commit score
            if (isEligible) {
                commitToProject(selectedRole.minScore);
            }

            // Register application in global state
            applyToRole({
                projectId,
                projectTitle,
                roleTitle: selectedRole.title,
                applicantId: userProfile?.id || "user-current",
                applicantName: userProfile?.name || "Rajayogi Nandina",
                applicantImage: userProfile?.image || "",
                applicantScore: userScore,
                requiredScore: selectedRole.minScore,
                motivation: motivation.trim() || (isEligible ? "Direct skill stake verified application." : "Applying with portfolio evidence and track record."),
                evidence: evidenceLink.trim() ? [evidenceLink.trim()] : undefined,
                feedback: isEligible ? "Direct skill score criteria satisfied." : "Under peer review with portfolio evidence."
            });

            setStep("success");
        }, 1200);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/85 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 px-6 border-b border-white/10 bg-zinc-900/80">
                            <div>
                                <h3 className="text-white font-bold text-sm">Role Application & Staking</h3>
                                <p className="text-xs text-zinc-400">{projectTitle}</p>
                            </div>
                            <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body Container */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-5">
                            {/* Step 1: Role Selection & Staking Details */}
                            {step === "role_selection" && (
                                <motion.div
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="space-y-5"
                                >
                                    {/* Orbit Score Breakdown Banner */}
                                    <div className="p-4 bg-zinc-950/70 rounded-xl border border-white/10 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <SkillScoreBadge stats={effectiveStats} size="md" />
                                                <div>
                                                    <p className="text-zinc-400 text-xs">Your Orbit Score</p>
                                                    <p className="text-white font-bold text-xl">{userScore.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setShowFormula(!showFormula)}
                                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 border border-blue-500/30 px-2.5 py-1 rounded-lg hover:bg-blue-500/10 transition-all"
                                            >
                                                <Info size={13} />
                                                <span>{showFormula ? "Hide Formula" : "Score Formula"}</span>
                                            </button>
                                        </div>

                                        {showFormula && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="text-xs text-zinc-300 bg-black/40 p-3 rounded-lg border border-white/5 space-y-1.5 pt-2 font-mono"
                                            >
                                                <div className="text-purple-300 font-semibold">Orbit Score = (V × 0.25 + C × 0.35 + P × 0.40) × (1 - R × 0.05) × 100</div>
                                                <div className="text-[11px] text-zinc-400">
                                                    Velocity (V): {effectiveStats.velocity} • Complexity (C): {effectiveStats.complexity} • Projects (P): {effectiveStats.projectsCompleted} • Risk (R): {effectiveStats.risk}
                                                </div>
                                                <p className="text-[10px] text-zinc-500 pt-1 font-sans">
                                                    Loominn scores are verified through completed milestones and peer audits — never pay-to-play or arbitrary follower vanity.
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Role Selection */}
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Select Target Role</h4>
                                        <div className="space-y-2">
                                            {roles.length > 0 ? roles.map((role, idx) => {
                                                const eligible = userScore >= role.minScore;
                                                const isSelected = selectedRole?.title === role.title;
                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setSelectedRole(role)}
                                                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${isSelected
                                                            ? "bg-blue-600/15 border-blue-500 ring-1 ring-blue-500/40"
                                                            : "bg-zinc-800/40 border-white/5 hover:bg-zinc-800/80"
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className="font-semibold text-sm text-white flex items-center gap-2">
                                                                <span>{role.title}</span>
                                                                {eligible ? (
                                                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                                                                        Score Qualified
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                                                                        Evidence Path
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-zinc-400 mt-0.5">
                                                                Guidance threshold: {role.minScore.toLocaleString()} Orbit Score
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {isSelected && <Check size={18} className="text-blue-400" />}
                                                        </div>
                                                    </button>
                                                );
                                            }) : (
                                                <div className="p-4 bg-zinc-800/40 rounded-xl text-center text-xs text-zinc-400">
                                                    General Collaboration Role (500 Orbit Threshold)
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Application Form */}
                                    {selectedRole && (
                                        <div className="space-y-3 pt-2">
                                            {!isEligible && (
                                                <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                                                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-semibold">Score Gap: {scoreGap.toLocaleString()} points.</span>
                                                        <p className="text-[11px] text-amber-300/80 mt-0.5">
                                                            Loominn never shuts out contributors based on scores alone. You can apply with custom motivation and portfolio proof for direct peer review by the project leads.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-zinc-300">
                                                    {isEligible ? "Motivation / Proposed Impact (Optional)" : "Why are you a great fit for this role? (Required)"}
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={motivation}
                                                    onChange={(e) => setMotivation(e.target.value)}
                                                    placeholder={isEligible 
                                                        ? "Brief note on what you would like to build or collaborate on..." 
                                                        : "Highlight your relevant experience, previous code repositories, or background..."}
                                                    className="w-full p-3 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-zinc-300">
                                                    Evidence / Portfolio URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={evidenceLink}
                                                    onChange={(e) => setEvidenceLink(e.target.value)}
                                                    placeholder="https://github.com/... or https://loominn.io/perspective/..."
                                                    className="w-full p-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="pt-2">
                                        {selectedRole ? (
                                            isEligible ? (
                                                <button
                                                    onClick={handleSubmitApplication}
                                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <Shield size={16} />
                                                    <span>Stake Orbit Score & Join</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmitApplication}
                                                    disabled={!motivation.trim()}
                                                    className={`w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${
                                                        motivation.trim()
                                                            ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-orange-950/30"
                                                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                                    }`}
                                                >
                                                    <Send size={16} />
                                                    <span>Submit Application with Evidence</span>
                                                </button>
                                            )
                                        ) : (
                                            <button disabled className="w-full py-3 bg-zinc-800 text-zinc-500 font-medium rounded-xl cursor-not-allowed text-sm">
                                                Select a Role to Proceed
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Staking Animation */}
                            {step === "staking" && (
                                <motion.div
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-16 text-center space-y-4"
                                >
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Zap size={24} className="text-white animate-pulse" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-base">Registering Application...</h4>
                                        <p className="text-zinc-400 text-xs mt-1">
                                            {isEligible ? "Staking Orbit Score on Project Ledger" : "Submitting Proof Portfolio for Review"}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Success */}
                            {step === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-10 text-center space-y-4"
                                >
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                        <Check size={32} className="text-green-400" />
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-white font-bold text-xl">
                                            {isEligible ? "Application Staked!" : "Application Submitted!"}
                                        </h4>
                                        <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                                            {isEligible 
                                                ? `You have successfully committed to the ${selectedRole?.title} role on ${projectTitle}. You can track your progress in the project workspace.`
                                                : `Your application for ${selectedRole?.title} on ${projectTitle} has been submitted for peer review. Project leads have been notified.`}
                                        </p>
                                    </div>

                                    <div className="pt-4 w-full">
                                        <button
                                            onClick={onClose}
                                            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
