"use client";

import { useState, use } from "react";
import { 
    Plus, MoreHorizontal, ChevronRight, ChevronLeft, Trash2, 
    CheckCircle2, Clock, AlertCircle, X, ShieldCheck, ExternalLink, 
    Award, Sparkles, UserCheck 
} from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import { WorkspaceTask } from "@/lib/types/schema";

interface ColumnDef {
    id: WorkspaceTask["status"];
    title: string;
    color: string;
    badge: string;
}

const COLUMNS: ColumnDef[] = [
    { id: "todo", title: "Backlog / To Do", color: "border-zinc-800", badge: "bg-zinc-800 text-zinc-300" },
    { id: "progress", title: "In Progress", color: "border-blue-500/30", badge: "bg-blue-500/10 text-blue-400" },
    { id: "review", title: "Peer Review", color: "border-amber-500/30", badge: "bg-amber-500/10 text-amber-400" },
    { id: "done", title: "Verified Done", color: "border-emerald-500/30", badge: "bg-emerald-500/10 text-emerald-400" },
];

export default function ProjectBoardPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawProjectId } = use(params);
    const projectId = decodeURIComponent(rawProjectId);

    const { 
        workspaceTasks, 
        addTask, 
        moveTask, 
        deleteTask, 
        userProfile, 
        completeWorkspaceTask 
    } = useGlobalState();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [targetColumn, setTargetColumn] = useState<WorkspaceTask["status"]>("todo");
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");

    // Peer Verification Modal State
    const [verifyingTask, setVerifyingTask] = useState<WorkspaceTask | null>(null);
    const [peerReviewer, setPeerReviewer] = useState("Elena Rostova");
    const [acknowledgement, setAcknowledgement] = useState("Verified robust implementation, automated tests pass, zero regressions.");
    const [evidenceUrl, setEvidenceUrl] = useState("https://github.com/loominn/core/pull/104");
    const [scoreDelta, setScoreDelta] = useState(45);

    // Filter tasks for this project
    const projectTasks = workspaceTasks.filter(t => 
        String(t.projectId).toLowerCase() === projectId.toLowerCase() ||
        String(t.projectId).toLowerCase() === "loominn-rebuild"
    );

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        addTask({
            projectId,
            title: newTitle.trim(),
            description: newDesc.trim() || undefined,
            status: targetColumn,
            assigneeName: userProfile?.name || "Rajayogi Nandina",
            priority: newPriority
        });

        setNewTitle("");
        setNewDesc("");
        setIsCreateModalOpen(false);
    };

    const getNextStatus = (curr: WorkspaceTask["status"]): WorkspaceTask["status"] | null => {
        if (curr === "todo") return "progress";
        if (curr === "progress") return "review";
        if (curr === "review") return "done";
        return null;
    };

    const getPrevStatus = (curr: WorkspaceTask["status"]): WorkspaceTask["status"] | null => {
        if (curr === "done") return "review";
        if (curr === "review") return "progress";
        if (curr === "progress") return "todo";
        return null;
    };

    const priorityColors = {
        low: "bg-zinc-800 text-zinc-400",
        medium: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
        high: "bg-red-500/15 text-red-400 border border-red-500/30"
    };

    return (
        <div className="space-y-6">
            {/* Board Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white">Live Kanban Board</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/30">
                        {projectTasks.length} Workspace Tasks
                    </span>
                </div>

                <button 
                    onClick={() => { setTargetColumn("todo"); setIsCreateModalOpen(true); }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                >
                    <Plus size={16} />
                    <span>Create Task</span>
                </button>
            </div>

            {/* Kanban Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[550px]">
                {COLUMNS.map((col) => {
                    const tasksInCol = projectTasks.filter(t => t.status === col.id);

                    return (
                        <div 
                            key={col.id} 
                            className="bg-zinc-900/60 border border-white/5 rounded-2xl flex flex-col h-full overflow-hidden backdrop-blur-sm"
                        >
                            {/* Column Header */}
                            <div className="p-3.5 flex items-center justify-between border-b border-white/5 bg-black/20">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">{col.title}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.badge}`}>
                                        {tasksInCol.length}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => { setTargetColumn(col.id); setIsCreateModalOpen(true); }}
                                    className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                    title={`Add task to ${col.title}`}
                                >
                                    <Plus size={15} />
                                </button>
                            </div>

                            {/* Task Cards Stream */}
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                {tasksInCol.length === 0 ? (
                                    <div className="h-32 flex flex-col items-center justify-center text-zinc-500 gap-1.5 border border-dashed border-white/5 rounded-xl">
                                        <p className="text-xs">No tasks in this lane</p>
                                        <button 
                                            onClick={() => { setTargetColumn(col.id); setIsCreateModalOpen(true); }}
                                            className="text-[11px] text-blue-400 hover:underline"
                                        >
                                            + Add a task
                                        </button>
                                    </div>
                                ) : (
                                    tasksInCol.map(task => {
                                        const prev = getPrevStatus(task.status);
                                        const next = getNextStatus(task.status);

                                        const handleAdvance = () => {
                                            if (next === "done") {
                                                setVerifyingTask(task);
                                            } else if (next) {
                                                moveTask(task.id, next);
                                            }
                                        };

                                        return (
                                            <div 
                                                key={task.id}
                                                className="bg-zinc-950/80 border border-white/5 hover:border-white/15 p-4 rounded-xl space-y-3 transition-all shadow-md group"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-md uppercase font-mono font-semibold ${priorityColors[task.priority]}`}>
                                                            {task.priority}
                                                        </span>
                                                        {task.status === "done" && (
                                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
                                                                <Award size={11} />
                                                                +{task.scoreDelta || 35} Orbit
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => deleteTask(task.id)}
                                                        className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                        title="Delete task"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-white leading-snug">
                                                        {task.title}
                                                    </h4>
                                                    {task.description && (
                                                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Verified Deliverable Metadata */}
                                                {task.status === "done" && (
                                                    <div className="bg-black/40 p-2.5 rounded-lg border border-emerald-500/20 space-y-1 text-[10px]">
                                                        <div className="text-emerald-400 font-semibold flex items-center gap-1">
                                                            <CheckCircle2 size={11} />
                                                            <span>Audited by {task.peerReviewer || "Lead Reviewer"}</span>
                                                        </div>
                                                        {task.acknowledgement && (
                                                            <p className="text-zinc-300 italic">
                                                                &ldquo;{task.acknowledgement}&rdquo;
                                                            </p>
                                                        )}
                                                        {task.evidenceUrl && (
                                                            <a 
                                                                href={task.evidenceUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-blue-400 hover:underline flex items-center gap-1 pt-0.5"
                                                            >
                                                                <span>Proof Artifact</span>
                                                                <ExternalLink size={10} />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action: Verify in Review */}
                                                {task.status === "review" && (
                                                    <button
                                                        onClick={() => setVerifyingTask(task)}
                                                        className="w-full py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                                                    >
                                                        <ShieldCheck size={13} className="text-emerald-400" />
                                                        <span>Audit & Verify Deliverable</span>
                                                    </button>
                                                )}

                                                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-zinc-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                                                            {task.assigneeName?.charAt(0) || "U"}
                                                        </div>
                                                        <span className="truncate max-w-[80px]">{task.assigneeName}</span>
                                                    </div>

                                                    {/* Move controls */}
                                                    <div className="flex items-center gap-1">
                                                        {prev && (
                                                            <button
                                                                onClick={() => moveTask(task.id, prev)}
                                                                className="p-1 text-zinc-400 hover:text-white rounded bg-white/5 hover:bg-white/10"
                                                                title="Move back"
                                                            >
                                                                <ChevronLeft size={13} />
                                                            </button>
                                                        )}
                                                        {next && (
                                                            <button
                                                                onClick={handleAdvance}
                                                                className="p-1 text-zinc-400 hover:text-white rounded bg-white/5 hover:bg-white/10"
                                                                title={next === "done" ? "Peer verify and complete" : "Advance stage"}
                                                            >
                                                                <ChevronRight size={13} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal 1: Create Task */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <h3 className="text-white font-bold text-sm">Create Workspace Task</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Task Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. Implement WebRTC audio handshake"
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Technical Context / Description</label>
                                <textarea
                                    rows={3}
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    placeholder="Brief technical requirements or milestone deliverables..."
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-300">Priority</label>
                                    <select
                                        value={newPriority}
                                        onChange={(e) => setNewPriority(e.target.value as any)}
                                        className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-300">Lane Column</label>
                                    <select
                                        value={targetColumn}
                                        onChange={(e) => setTargetColumn(e.target.value as any)}
                                        className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="progress">In Progress</option>
                                        <option value="review">In Review</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Peer Verification & Acknowledgement Modal */}
            {verifyingTask && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                                    <ShieldCheck size={14} />
                                    <span>Peer Verification & Proof Verification</span>
                                </div>
                                <h3 className="text-white font-bold text-base mt-0.5">
                                    Verify Deliverable: {verifyingTask.title}
                                </h3>
                            </div>
                            <button onClick={() => setVerifyingTask(null)} className="text-zinc-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-200">
                            Verifying this task moves it to <strong>Verified Done</strong>, updates the contributor&apos;s Orbit Credibility Score, logs an immutable record into the Proof Ledger, and announces the milestone to the project channel.
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            completeWorkspaceTask(verifyingTask.id, {
                                peerReviewer: peerReviewer.trim(),
                                acknowledgement: acknowledgement.trim(),
                                evidenceUrl: evidenceUrl.trim() || undefined,
                                scoreDelta: Number(scoreDelta) || 45
                            });
                            setVerifyingTask(null);
                        }} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Auditing Peer Reviewer</label>
                                <input
                                    type="text"
                                    required
                                    value={peerReviewer}
                                    onChange={(e) => setPeerReviewer(e.target.value)}
                                    placeholder="Peer auditor name or handle"
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Deliverable Proof Artifact URL (PR / Commit / Preview)</label>
                                <input
                                    type="url"
                                    required
                                    value={evidenceUrl}
                                    onChange={(e) => setEvidenceUrl(e.target.value)}
                                    placeholder="https://github.com/org/repo/pull/123"
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Peer Acknowledgement & Technical Assessment</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={acknowledgement}
                                    onChange={(e) => setAcknowledgement(e.target.value)}
                                    placeholder="Detailed feedback acknowledging implementation quality, test coverage, and milestone completion..."
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-300">Orbit Score Delta Reward (+)</label>
                                <input
                                    type="number"
                                    required
                                    min={10}
                                    max={200}
                                    value={scoreDelta}
                                    onChange={(e) => setScoreDelta(Number(e.target.value))}
                                    className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setVerifyingTask(null)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-1.5"
                                >
                                    <ShieldCheck size={14} />
                                    <span>Sign & Commit to Ledger</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
