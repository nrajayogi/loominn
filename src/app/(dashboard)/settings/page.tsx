"use client";

import { ChevronLeft, Save, Shield, Eye, Lock, UserX, VolumeX, Check, AlertTriangle, Download } from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useState } from "react";

export default function SettingsPage() {
    const {
        userProfile,
        updateUserProfile,
        privacySettings,
        updatePrivacySettings,
        blockedUsers,
        toggleBlockUser,
        mutedUsers,
        toggleMuteUser
    } = useGlobalState();

    const [name, setName] = useState(userProfile.name);
    const [bio, setBio] = useState(userProfile.bio);
    const [location, setLocation] = useState(userProfile.location);
    const [connectionTierPolicy, setConnectionTierPolicy] = useState<"all" | "colleagues" | "partners">("all");
    const [savedToast, setSavedToast] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile({ name, bio, location });
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3500);
    };

    return (
        <div className="max-w-2xl mx-auto pb-28 px-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <Link href="/profile">
                        <button className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors" aria-label="Back to Profile">
                            <ChevronLeft size={20} />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Settings & Safety</h1>
                        <p className="text-xs text-zinc-400">Control your sovereign profile, Orbit score exposure, and connection permissions</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Identity & Bio */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Builder Identity</span>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 flex-shrink-0 shadow-lg flex items-center justify-center text-2xl font-bold text-zinc-400">
                            {userProfile.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={userProfile.image} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                name.charAt(0) || "U"
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-white">{name}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{userProfile.email || "builder@loominn.com"}</p>
                            <span className="inline-block mt-2 text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                Sovereign Workspace Node
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Display Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="bio" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Focus & Background</label>
                        <textarea
                            id="bio"
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* 2. Orbit Score & Network Visibility */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Eye className="text-blue-400" size={16} />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Orbit Score & Discovery Privacy</span>
                    </div>

                    {/* Orbit Score Visibility Toggle */}
                    <div className="flex items-center justify-between p-4 bg-zinc-950/60 rounded-xl border border-white/5">
                        <div className="pr-4">
                            <span className="block text-sm font-semibold text-white">Orbit Score Visibility</span>
                            <span className="block text-xs text-zinc-400 mt-1 leading-relaxed">
                                {privacySettings.showOrbitScore
                                    ? "Visible across Orbit Discovery and project role applications to prove verified credibility."
                                    : "Hidden from public discovery. Only active project teammates can view your score."}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => updatePrivacySettings({ showOrbitScore: !privacySettings.showOrbitScore })}
                            className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${privacySettings.showOrbitScore ? "bg-blue-600" : "bg-zinc-700"}`}
                            aria-label="Toggle Orbit score visibility"
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${privacySettings.showOrbitScore ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                    </div>

                    {/* Direct Messages Toggle */}
                    <div className="flex items-center justify-between p-4 bg-zinc-950/60 rounded-xl border border-white/5">
                        <div className="pr-4">
                            <span className="block text-sm font-semibold text-white">Open Direct Messages</span>
                            <span className="block text-xs text-zinc-400 mt-1 leading-relaxed">
                                {privacySettings.allowDirectMessages
                                    ? "Any verified builder can message you regarding open role opportunities."
                                    : "Restricted to mutual Partner and Colleague connections."}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => updatePrivacySettings({ allowDirectMessages: !privacySettings.allowDirectMessages })}
                            className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${privacySettings.allowDirectMessages ? "bg-blue-600" : "bg-zinc-700"}`}
                            aria-label="Toggle direct messages"
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${privacySettings.allowDirectMessages ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                    </div>

                    {/* Location Tracking */}
                    <div className="flex items-center justify-between p-4 bg-zinc-950/60 rounded-xl border border-white/5">
                        <div className="pr-4">
                            <span className="block text-sm font-semibold text-white">Presence & Location Tracking</span>
                            <span className="block text-xs text-zinc-400 mt-1 leading-relaxed">
                                {privacySettings.locationTracking
                                    ? "Precise time zone and locality are shared for workspace collaboration sync."
                                    : `Using Account Origin: ${userProfile.accountOrigin}`}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => updatePrivacySettings({ locationTracking: !privacySettings.locationTracking })}
                            className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${privacySettings.locationTracking ? "bg-blue-600" : "bg-zinc-700"}`}
                            aria-label="Toggle location tracking"
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${privacySettings.locationTracking ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                    </div>

                    {privacySettings.locationTracking && (
                        <div className="space-y-2 pt-2">
                            <label htmlFor="location" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Current Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    )}
                </div>

                {/* 3. Connection Tier Permissions */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Lock className="text-emerald-400" size={16} />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Relationship Tier Permissions</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Control who can initiate high-trust connection requests (Partner, Colleague, Ally) with your account.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {[
                            { id: "all", label: "All Builders", desc: "Open to entire Loominn community" },
                            { id: "colleagues", label: "Colleagues & Allies", desc: "Prior project collaborators" },
                            { id: "partners", label: "Verified Partners Only", desc: "High-trust Tier 1 builders" },
                        ].map((tier) => (
                            <button
                                key={tier.id}
                                type="button"
                                onClick={() => setConnectionTierPolicy(tier.id as any)}
                                className={`p-4 rounded-xl text-left border transition-all ${
                                    connectionTierPolicy === tier.id
                                        ? "bg-blue-600/20 border-blue-500/50 text-white"
                                        : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
                                }`}
                            >
                                <span className="block text-xs font-bold mb-1">{tier.label}</span>
                                <span className="block text-[10px] opacity-75">{tier.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Safety & Moderation (Blocked & Muted) */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <Shield className="text-purple-400" size={16} />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Safety & Moderation</span>
                    </div>

                    {/* Blocked Users */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                                <UserX size={14} className="text-red-400" /> Blocked Accounts ({blockedUsers.length})
                            </span>
                        </div>
                        {blockedUsers.length === 0 ? (
                            <p className="text-xs text-zinc-500 bg-zinc-950/40 p-3 rounded-xl border border-white/5">
                                No blocked accounts. Loominn maintains high-trust peer accountability.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {blockedUsers.map(userId => (
                                    <div key={userId} className="flex items-center justify-between p-3 bg-zinc-950/60 rounded-xl border border-white/5">
                                        <span className="text-xs text-white font-medium">{userId}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleBlockUser(userId)}
                                            className="text-xs text-blue-400 hover:underline"
                                        >
                                            Unblock
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Muted Users */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                                <VolumeX size={14} className="text-amber-400" /> Muted Perspectives ({mutedUsers.length})
                            </span>
                        </div>
                        {mutedUsers.length === 0 ? (
                            <p className="text-xs text-zinc-500 bg-zinc-950/40 p-3 rounded-xl border border-white/5">
                                No muted perspectives or updates.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {mutedUsers.map(userId => (
                                    <div key={userId} className="flex items-center justify-between p-3 bg-zinc-950/60 rounded-xl border border-white/5">
                                        <span className="text-xs text-white font-medium">{userId}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleMuteUser(userId)}
                                            className="text-xs text-blue-400 hover:underline"
                                        >
                                            Unmute
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Data Sovereignty & Export */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex items-center justify-between gap-4">
                    <div>
                        <span className="text-sm font-semibold text-white block">Sovereign Proof Ledger Export</span>
                        <span className="text-xs text-zinc-400 block mt-0.5">Download your cryptographic audit history, credentials, and contributions as JSON.</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => alert("Cryptographic proof ledger JSON export generated and verified.")}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                        <Download size={14} />
                        Export Ledger
                    </button>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all active:scale-98 flex items-center justify-center gap-2 text-sm"
                    >
                        <Save size={18} />
                        Save Preferences & Safety Settings
                    </button>
                </div>
            </form>

            {/* Save Confirmation Toast */}
            {savedToast && (
                <div className="fixed bottom-24 right-6 z-50 bg-emerald-950/90 border border-emerald-500/50 text-white text-xs px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="p-1 rounded-full bg-emerald-500 text-black">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    <div>
                        <span className="font-bold block">Preferences Saved</span>
                        <span className="text-emerald-300 text-[11px]">Sovereign profile & privacy settings updated across Loominn mesh.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
