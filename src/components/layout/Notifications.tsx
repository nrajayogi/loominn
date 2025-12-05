"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, UserPlus, CheckCircle2, Star, Clock, AlertCircle } from "lucide-react";

type NotificationType = "request" | "approval" | "update" | "points";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    read: boolean;
}

const INBOX_DATA: Notification[] = [
    {
        id: "1",
        type: "request",
        title: "Friend Request",
        description: "Mike Ross wants to connect with you.",
        time: "2m ago",
        read: false
    },
    {
        id: "2",
        type: "approval",
        title: "Action Required",
        description: "Please review the UI Design proposal for 'Project Alpha'.",
        time: "1h ago",
        read: false
    }
];

const UPDATES_DATA: Notification[] = [
    {
        id: "3",
        type: "points",
        title: "Points Received",
        description: "You earned 500 points for completing 'Weekly Challenge'.",
        time: "5m ago",
        read: true
    },
    {
        id: "4",
        type: "update",
        title: "Project Completed",
        description: "'EcoTrack Mobile' has been marked as completed successfully.",
        time: "2h ago",
        read: true
    },
    {
        id: "5",
        type: "update",
        title: "Status Update",
        description: "Sarah updated her status to 'Busy'.",
        time: "4h ago",
        read: true
    }
];

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"inbox" | "updates">("inbox");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [inbox] = useState(INBOX_DATA);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [updates] = useState(UPDATES_DATA);

    const activeList = activeTab === "inbox" ? inbox : updates;
    const unreadCount = inbox.filter(n => !n.read).length + updates.filter(n => !n.read).length;

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "request": return <UserPlus size={18} className="text-blue-500" />;
            case "approval": return <Clock size={18} className="text-orange-500" />;
            case "points": return <Star size={18} className="text-yellow-500 fill-current" />;
            case "update": return <CheckCircle2 size={18} className="text-green-500" />;
            default: return <AlertCircle size={18} className="text-zinc-500" />;
        }
    };

    return (
        <div className="fixed top-6 right-6 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shadow-xl"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-black">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-14 right-0 w-80 md:w-96 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Header Tabs */}
                            <div className="flex border-b border-white/5">
                                <button
                                    onClick={() => setActiveTab("inbox")}
                                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === "inbox" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                                >
                                    Inbox
                                    {inbox.some(n => !n.read) && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-500 inline-block align-middle" />}
                                    {activeTab === "inbox" && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                                </button>
                                <button
                                    onClick={() => setActiveTab("updates")}
                                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === "updates" ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                                >
                                    Updates
                                    {updates.some(n => !n.read) && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-blue-500 inline-block align-middle" />}
                                    {activeTab === "updates" && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                                </button>
                            </div>

                            {/* List */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {activeList.length === 0 ? (
                                    <div className="text-center py-12 text-zinc-500 text-sm">
                                        No new notifications
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {activeList.map((item) => (
                                            <div key={item.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 bg-zinc-800 p-2 rounded-lg h-fit">
                                                        {getIcon(item.type)}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-sm font-medium mb-0.5 ${!item.read ? "text-white" : "text-zinc-300"}`}>
                                                            {item.title}
                                                            {!item.read && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                                        </h4>
                                                        <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                                                            {item.description}
                                                        </p>

                                                        {/* Actions for Request/Approval */}
                                                        {activeTab === "inbox" && (
                                                            <div className="flex gap-2 mt-2">
                                                                <button className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-colors">
                                                                    Accept
                                                                </button>
                                                                <button className="px-3 py-1 rounded-md bg-white/5 text-zinc-400 text-xs font-medium hover:bg-white/10 hover:text-white transition-colors">
                                                                    Decline
                                                                </button>
                                                            </div>
                                                        )}

                                                        <span className="text-[10px] text-zinc-600 mt-2 block">{item.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
