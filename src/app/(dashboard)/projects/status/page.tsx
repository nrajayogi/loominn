"use client";

import { CheckCircle2, Clock, FileText, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
    { id: 1, label: "Submitted", date: "Dec 04, 2025", status: "completed", icon: FileText },
    { id: 2, label: "In Review", date: "Pending", status: "current", icon: Clock },
    { id: 3, label: "Decision", date: "-", status: "pending", icon: CheckCircle2 },
];

export default function ApplicationStatusPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Application Status</h1>
                    <p className="text-zinc-400">Track the progress of your project submission.</p>
                </div>
                <Link href="/projects">
                    <button className="text-sm text-zinc-500 hover:text-white flex items-center gap-1">
                        Back to Projects <ChevronRight size={16} />
                    </button>
                </Link>
            </div>

            {/* Status Card */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="flex items-start gap-6 mb-12 relative z-10">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-900/20">
                        AI
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-white">AI Marketing Platform</h2>
                            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                                IN REVIEW
                            </span>
                        </div>
                        <p className="text-zinc-400 max-w-xl">
                            A comprehensive platform for automating marketing campaigns using artificial intelligence.
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-zinc-500">
                            <span>ID: #PROJ-8829</span>
                            <span>•</span>
                            <span>Submitted on Dec 04, 2025</span>
                        </div>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-10"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-blue-600 -z-10 animate-pulse"></div>

                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            const isCompleted = step.status === "completed";
                            const isCurrent = step.status === "current";

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-4 bg-background px-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                                        isCurrent ? 'bg-zinc-900 border-blue-600 text-blue-500 scale-110 shadow-[0_0_20px_rgba(37,99,235,0.3)]' :
                                            'bg-zinc-900 border-zinc-800 text-zinc-600'
                                        }`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="text-center">
                                        <div className={`font-bold ${isCurrent || isCompleted ? 'text-white' : 'text-zinc-600'}`}>
                                            {step.label}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1">{step.date}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-12 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                    <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-bold text-blue-400 mb-1">What happens next?</h4>
                        <p className="text-sm text-zinc-400">
                            Our admin team is currently reviewing your project proposal. This process usually takes 24-48 hours.
                            You will receive a notification once a decision has been made.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
