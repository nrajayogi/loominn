"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Users, Calendar, FileText, Shield, Award } from "lucide-react";
import Link from "next/link";

const STEPS = [
    { id: 1, label: "Basics", icon: FileText },
    { id: 2, label: "Team", icon: Users },
    { id: 3, label: "Timeline", icon: Calendar },
    { id: 4, label: "Verification", icon: Shield },
];

export default function ProjectWizard({ onCancel }: { onCancel?: () => void }) {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
                    <p className="text-zinc-400">Set up your project, assemble your team, and plan your timeline.</p>
                </div>
                {onCancel && (
                    <button onClick={onCancel} className="text-zinc-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                )}
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-10"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

                {STEPS.map((s) => {
                    const Icon = s.icon;
                    const isActive = s.id <= step;
                    const isCurrent = s.id === step;

                    return (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'} ${isCurrent ? 'ring-4 ring-blue-600/20 scale-110' : ''}`}>
                                <Icon size={20} />
                            </div>
                            <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-500'}`}>{s.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 mb-8 min-h-[400px]">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-white mb-4">Project Basics</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Project Title</label>
                                <input type="text" className="w-full bg-black/20 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. AI Marketing Platform" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                                <textarea rows={4} className="w-full bg-black/20 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none" placeholder="Describe your project goals..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                                <select className="w-full bg-black/20 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                                    <option>Development</option>
                                    <option>Design</option>
                                    <option>Marketing</option>
                                    <option>Research</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Team & Skills</h2>
                            <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">+ Add Member</button>
                        </div>

                        {/* Member Card Example */}
                        <div className="bg-black/20 border border-zinc-800 rounded-xl p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold">RN</div>
                                <div>
                                    <div className="font-medium text-white">Rajayogi Nandina</div>
                                    <div className="text-xs text-zinc-500">Owner</div>
                                </div>
                            </div>

                            <div className="space-y-4 pl-14">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1">Role</label>
                                        <select className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white">
                                            <option>Full Stack Developer</option>
                                            <option>UI/UX Designer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1">
                                            <Award size={12} /> Skill Score
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input type="range" className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                                            <span className="text-sm font-bold text-blue-400">85</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Project Timeline (Gantt)</h2>
                            <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">+ Add Phase</button>
                        </div>

                        <div className="space-y-4">
                            {/* Phase 1 */}
                            <div className="bg-black/20 border border-zinc-800 rounded-xl p-4">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-2 h-12 rounded-full bg-blue-500"></div>
                                    <div className="flex-1">
                                        <input type="text" defaultValue="Planning & Research" className="bg-transparent text-white font-medium focus:outline-none w-full" />
                                        <div className="flex items-center gap-4 text-sm text-zinc-500 mt-1">
                                            <span>Start: Dec 01</span>
                                            <span>End: Dec 15</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Phase 2 */}
                            <div className="bg-black/20 border border-zinc-800 rounded-xl p-4">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-2 h-12 rounded-full bg-purple-500"></div>
                                    <div className="flex-1">
                                        <input type="text" defaultValue="Design & Prototyping" className="bg-transparent text-white font-medium focus:outline-none w-full" />
                                        <div className="flex items-center gap-4 text-sm text-zinc-500 mt-1">
                                            <span>Start: Dec 16</span>
                                            <span>End: Jan 10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 py-8">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4">
                            <Shield size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Ready for Verification</h2>
                        <p className="text-zinc-400 max-w-md mx-auto">
                            Your project details, team structure, and timeline are ready.
                            Submit your project for admin approval to start working.
                        </p>

                        <div className="bg-zinc-900 p-6 rounded-2xl max-w-sm mx-auto text-left border border-zinc-800">
                            <h3 className="font-bold text-white mb-4">Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Team Size</span>
                                    <span className="text-white">1 Member</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Duration</span>
                                    <span className="text-white">45 Days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Phases</span>
                                    <span className="text-white">2 Phases</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                >
                    <ChevronLeft size={20} /> Back
                </button>

                {step < 4 ? (
                    <button
                        onClick={nextStep}
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        Next <ChevronRight size={20} />
                    </button>
                ) : (
                    <Link href="/projects">
                        <button className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center gap-2">
                            Submit for Approval <Check size={20} />
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}
