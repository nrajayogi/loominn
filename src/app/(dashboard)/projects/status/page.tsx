"use client";

import { CheckCircle2, Clock, FileText, AlertCircle, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Project } from "@/lib/types/schema";

const STATUS_STEPS = [
    { id: 1, label: "Submitted", status: "completed", icon: FileText },
    { id: 2, label: "In Review", status: "current", icon: Clock },
    { id: 3, label: "Decision", status: "pending", icon: CheckCircle2 },
];

export default function ApplicationStatusPage() {
    const { userProjects, approveProject } = useGlobalState();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Application Status</h1>
                    <p className="text-zinc-400">Track the progress of your project submissions.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/projects">
                        <button className="text-sm text-zinc-500 hover:text-white flex items-center gap-1 h-full px-4">
                            Back
                        </button>
                    </Link>
                    <Link href="/projects/create">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                            <Plus size={18} /> Launch New
                        </button>
                    </Link>
                </div>
            </div>

            {userProjects.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-2xl">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-500 border border-white/5">
                        <FileText size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No Active Applications</h2>
                    <p className="text-zinc-400 mb-8 max-w-md mx-auto">You haven't submitted any projects for review yet. Start your journey by launching a new project.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {userProjects.map((project) => (
                        <div key={project.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                            {/* Decorative Blur */}
                            <div className="absolute top-0 right-0 p-32 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-600/10 transition-colors"></div>

                            <div className="flex flex-col md:flex-row md:items-start gap-6 mb-10 relative z-10">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-900/20 shrink-0">
                                    {project.title.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${project.status === 'approved'
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {project.status === 'submitted' ? 'In Review' : project.status}
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 max-w-xl line-clamp-2 mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                                        <span>{project.category}</span>
                                        <span>•</span>
                                        <span>{project.roles.length} Roles Defined</span>
                                        <span>•</span>
                                        <span>Submitted on {project.submittedAt}</span>
                                    </div>
                                </div>

                                {/* Admin Tools per project */}
                                {project.status === 'submitted' && (
                                    <button
                                        onClick={() => approveProject(project.id)}
                                        className="bg-green-900/30 hover:bg-green-600 hover:text-white text-green-400 border border-green-500/30 text-xs font-bold px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                                    >
                                        Simulate Approval
                                    </button>
                                )}
                            </div>

                            {/* Progress Stepper */}
                            <div className="relative z-10">
                                <div className="flex items-center justify-between relative">
                                    {/* Connecting Line */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-10"></div>
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 transition-all duration-500"
                                        style={{ width: project.status === 'approved' ? '100%' : '50%' }}></div>

                                    {STATUS_STEPS.map((step) => {
                                        const Icon = step.icon;
                                        // Logic for stepper state based on project.status
                                        let state = 'pending';
                                        if (project.status === 'approved') {
                                            state = 'completed'; // All steps complete
                                        } else if (project.status === 'submitted') {
                                            if (step.id === 1) state = 'completed';
                                            if (step.id === 2) state = 'current';
                                            if (step.id === 3) state = 'pending';
                                        }

                                        const isCompleted = state === 'completed';
                                        const isCurrent = state === 'current';

                                        return (
                                            <div key={step.id} className="flex flex-col items-center gap-4 bg-background px-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted || (step.id === 3 && project.status === 'approved') ? 'bg-blue-600 border-blue-600 text-white' :
                                                        isCurrent ? 'bg-zinc-900 border-blue-600 text-blue-500 scale-110 shadow-[0_0_20px_rgba(37,99,235,0.3)]' :
                                                            'bg-zinc-900 border-zinc-800 text-zinc-600'
                                                    }`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="text-center">
                                                    <div className={`font-bold text-sm ${isCurrent || isCompleted ? 'text-white' : 'text-zinc-600'}`}>
                                                        {step.label}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
                                                        {step.id === 1 ? project.submittedAt : (
                                                            project.status === 'approved' && step.id === 3 ? 'Approved' :
                                                                state === 'current' ? 'Pending' : '-'
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Info Box - Only show for active reviews */}
                            {project.status === 'submitted' && (
                                <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                                    <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h4 className="font-bold text-blue-400 mb-1 text-sm">Under Review</h4>
                                        <p className="text-xs text-zinc-400">
                                            Our admin team is currently reviewing this proposal. You will receive a notification once a decision has been made.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
