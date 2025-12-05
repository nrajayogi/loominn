"use client";

import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useState } from "react";

export default function SettingsPage() {
    const { userProfile, updateUserProfile, privacySettings, updatePrivacySettings } = useGlobalState();
    const [name, setName] = useState(userProfile.name);
    const [bio, setBio] = useState(userProfile.bio);
    const [location, setLocation] = useState(userProfile.location);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile({ name, bio, location });
    };

    return (
        <div className="max-w-xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/profile">
                    <button className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors" aria-label="Back to Profile">
                        <ChevronLeft size={24} />
                    </button>
                </Link>
                <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="h-24 w-24 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 shadow-lg shadow-black/50">
                        {userProfile.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={userProfile.image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-zinc-500 bg-zinc-900">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-400">Display Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium text-zinc-400">Bio</label>
                    <textarea
                        id="bio"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <h3 className="text-lg font-bold text-white">Privacy & Location</h3>

                    <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <div>
                            <span className="block text-sm font-medium text-white mb-1">Enable Location Tracking</span>
                            <span className="block text-xs text-zinc-500">
                                {privacySettings.locationTracking
                                    ? "Your precise location is visible on your profile."
                                    : `Using Account Origin: ${privacySettings.originCountry}`}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => updatePrivacySettings({ locationTracking: !privacySettings.locationTracking })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${privacySettings.locationTracking ? "bg-blue-600" : "bg-zinc-700"}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${privacySettings.locationTracking ? "translate-x-6" : "translate-x-0"}`}></div>
                        </button>
                    </div>

                    {privacySettings.locationTracking && (
                        <div className="space-y-2">
                            <label htmlFor="location" className="text-sm font-medium text-zinc-400">Current Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
