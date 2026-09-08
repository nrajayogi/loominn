"use client";

import { useState } from "react";
import { X, ShieldAlert, Flag, VolumeX, Ban, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalState } from "@/context/GlobalStateContext";

interface SafetyModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string;
    targetType: "post" | "perspective" | "project" | "user";
    targetName: string;
}

const REPORT_REASONS = [
    { id: "spam", label: "Spam or irrelevant self-promotion" },
    { id: "harassment", label: "Harassment or unprofessional conduct" },
    { id: "fraud", label: "Fraudulent claim or fake proof of work" },
    { id: "stolen", label: "Plagiarism or copyright infringement" },
    { id: "misinformation", label: "Deceptive or misleading technical claims" }
];

export default function SafetyModal({ isOpen, onClose, targetId, targetType, targetName }: SafetyModalProps) {
    const { reportItem, toggleMuteUser, toggleBlockUser } = useGlobalState();
    const [action, setAction] = useState<"choose" | "report" | "success">("choose");
    const [selectedReason, setSelectedReason] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleReport = () => {
        if (!selectedReason) return;
        reportItem(targetId, targetType, selectedReason);
        setSuccessMessage("Thank you for your report. Our community moderation team will review this within 24 hours.");
        setAction("success");
    };

    const handleMute = () => {
        toggleMuteUser(targetId);
        setSuccessMessage(`You will no longer see updates or perspectives from ${targetName}. You can change this in Settings.`);
        setAction("success");
    };

    const handleBlock = () => {
        toggleBlockUser(targetId);
        setSuccessMessage(`${targetName} has been blocked. They cannot view your projects or send you messages.`);
        setAction("success");
    };

    const handleClose = () => {
        setAction("choose");
        setSelectedReason("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <ShieldAlert size={18} className="text-amber-400" />
                                Safety & Moderation Controls
                            </div>
                            <button onClick={handleClose} className="text-zinc-500 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        {action === "choose" && (
                            <div className="space-y-4">
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Manage your interaction preferences regarding <strong>{targetName}</strong>.
                                </p>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => setAction("report")}
                                        className="w-full p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-amber-500/30 text-left flex items-center gap-3 transition-all"
                                    >
                                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                                            <Flag size={16} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white block">Report Content or Creator</span>
                                            <span className="text-[10px] text-zinc-500">Flag policy violations or fraudulent evidence</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={handleMute}
                                        className="w-full p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-white/10 text-left flex items-center gap-3 transition-all"
                                    >
                                        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
                                            <VolumeX size={16} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white block">Mute {targetName}</span>
                                            <span className="text-[10px] text-zinc-500">Hide their posts and perspectives from your feeds</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={handleBlock}
                                        className="w-full p-3 rounded-xl bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 text-left flex items-center gap-3 transition-all"
                                    >
                                        <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                            <Ban size={16} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-red-400 block">Block User</span>
                                            <span className="text-[10px] text-red-300/60">Prevent all mutual communication and project collaboration</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {action === "report" && (
                            <div className="space-y-4">
                                <p className="text-xs text-zinc-300 font-medium">
                                    Please select why you are reporting this {targetType}:
                                </p>
                                <div className="space-y-2">
                                    {REPORT_REASONS.map((reason) => (
                                        <label
                                            key={reason.id}
                                            className={`w-full p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs transition-all ${
                                                selectedReason === reason.id 
                                                    ? "bg-amber-500/10 border-amber-500/50 text-white" 
                                                    : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-900"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="reportReason"
                                                value={reason.id}
                                                checked={selectedReason === reason.id}
                                                onChange={() => setSelectedReason(reason.id)}
                                                className="accent-amber-500"
                                            />
                                            <span>{reason.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => setAction("choose")}
                                        className="flex-1 py-2 rounded-xl bg-zinc-900 text-xs text-zinc-400 hover:text-white"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleReport}
                                        disabled={!selectedReason}
                                        className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-xs font-bold text-white transition-colors"
                                    >
                                        Submit Report
                                    </button>
                                </div>
                            </div>
                        )}

                        {action === "success" && (
                            <div className="text-center py-4 space-y-3">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h4 className="text-sm font-bold text-white">Action Completed</h4>
                                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                                    {successMessage}
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
