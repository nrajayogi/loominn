"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Users, Calendar, FileText, Shield, Award, Plus, Trash2, Image as ImageIcon, MonitorPlay } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/context/GlobalStateContext";
import Link from "next/link";

const STEPS = [
    { id: 1, label: "Basics", icon: FileText },
    { id: 2, label: "Team", icon: Users },
    { id: 3, label: "Presentation", icon: MonitorPlay },
    { id: 4, label: "Verify", icon: Shield },
];

interface RoleRequirement {
    title: string;
    minScore: number;
}

export default function ProjectWizard({ onCancel }: { onCancel?: () => void }) {
    const { addProject } = useGlobalState();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [roles, setRoles] = useState<RoleRequirement[]>([
        { title: "Lead Developer", minScore: 2000 }
    ]);

    // Project Data State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Development");
    const [slides, setSlides] = useState<string[]>([]);

    const addRole = () => {
        setRoles([...roles, { title: "", minScore: 500 }]);
    };

    const updateRole = (index: number, field: keyof RoleRequirement, value: string | number) => {
        const newRoles = [...roles];
        newRoles[index] = { ...newRoles[index], [field]: value };
        setRoles(newRoles);
    };

    const removeRole = (index: number) => {
        if (roles.length > 1) {
            setRoles(roles.filter((_, i) => i !== index));
        }
    };

    const addSlide = () => {
        // Simulating adding a slide URL - in a real app this would be an upload
        setSlides([...slides, "/placeholder-project-slide.jpg"]);
    };

    const handleSubmit = () => {
        const projectData = {
            title: title || "Untitled Project",
            description: description || "No description provided.",
            category,
            roles,
            slides
        };
        addProject(projectData);
        router.push("/projects/status");
    };

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
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-black/20 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. AI Marketing Platform"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-black/20 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                                    placeholder="Describe your project goals..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-black/20 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    aria-label="Project Category"
                                >
                                    <option>Development</option>
                                    <option>Design</option>
                                    <option>Marketing</option>
                                    <option>Research</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )} {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">Team Requirements</h2>
                                <p className="text-sm text-zinc-400 mt-1">Define who you need and the minimum skill level required.</p>
                            </div>
                            <button
                                onClick={addRole}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} /> Add Role
                            </button>
                        </div>

                        <div className="space-y-4">
                            {roles.map((role, idx) => (
                                <div key={idx} className="bg-black/20 border border-zinc-800 rounded-xl p-4 animate-in slide-in-from-bottom-2">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Role Title</label>
                                            <input
                                                type="text"
                                                value={role.title}
                                                onChange={(e) => updateRole(idx, 'title', e.target.value)}
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                placeholder="e.g. Frontend Developer"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeRole(idx)}
                                            disabled={roles.length === 1}
                                            className="mt-6 p-2 text-zinc-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
                                            aria-label="Remove Role"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Minimum Orbit Score</label>
                                            <span className="text-blue-400 font-bold text-sm">{role.minScore} Pts</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10000"
                                            step="100"
                                            value={role.minScore}
                                            onChange={(e) => updateRole(idx, 'minScore', parseInt(e.target.value))}
                                            className="w-full accent-blue-600 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                                            aria-label="Minimum Orbit Score"
                                        />
                                        <div className="flex justify-between mt-2 text-[10px] text-zinc-600 font-medium">
                                            <span>Entry Level</span>
                                            <span>Mid Level</span>
                                            <span>Senior</span>
                                            <span>Expert</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                            <Shield className="text-blue-400 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-blue-400 mb-1">Smart Enforcement</h4>
                                <p className="text-xs text-blue-300/70">
                                    When users apply, their Orbit Score will be automatically checked against these requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                )} {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">Project Presentation</h2>
                                <p className="text-sm text-zinc-400 mt-1">Add visuals, slides, or diagrams to showcase your idea.</p>
                            </div>
                            <button
                                onClick={addSlide}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} /> Add Slide
                            </button>
                        </div>

                        {slides.length === 0 ? (
                            <div className="border-2 border-dashed border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer" onClick={addSlide}>
                                <ImageIcon size={48} className="mb-4 opacity-50" />
                                <p className="font-medium">Click to add presentation slides</p>
                                <p className="text-xs mt-1 opacity-60">Supports JPG, PNG, PDF</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {slides.map((slide, idx) => (
                                    <div key={idx} className="aspect-video bg-zinc-800 rounded-xl overflow-hidden relative group">
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-bold bg-zinc-900">
                                            Slide {idx + 1}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newSlides = [...slides];
                                                newSlides.splice(idx, 1);
                                                setSlides(newSlides);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                                            aria-label="Remove Slide"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="aspect-video border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 cursor-pointer transition-colors" onClick={addSlide}>
                                    <Plus size={32} />
                                </div>
                            </div>
                        )}
                    </div>
                )} {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-white mb-4">Review & Launch</h2>

                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-24 bg-blue-600/5 blur-3xl rounded-full pointer-events-none"></div>

                            <div className="relative z-10 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{title || "Untitled Project"}</h3>
                                    <p className="text-zinc-400 leading-relaxed">{description || "No description provided."}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Category</div>
                                        <div className="text-white font-medium">{category}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Open Roles</div>
                                        <div className="text-white font-medium">{roles.length} Roles</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Highest Requirement</div>
                                        <div className="text-blue-400 font-bold">{Math.max(...roles.map(r => r.minScore))} Pts</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-zinc-500">
                                    <Calendar size={16} />
                                    <span>Target Start: Immediately</span>
                                    <span className="mx-2">•</span>
                                    <Shield size={16} />
                                    <span>Verified Orbit Score Integration Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                            <Award className="text-yellow-500 mt-1" />
                            <div>
                                <h4 className="font-bold text-yellow-500">Ready to Launch?</h4>
                                <p className="text-sm text-yellow-500/70 mt-1">
                                    Your project will be submitted for admin review. Once approved, it will be listed in the project marketplace and you can start accepting applications.
                                </p>
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
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95 flex items-center gap-2"
                    >
                        Submit for Approval <Check size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
