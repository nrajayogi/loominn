"use client";

import { Share2, MoreHorizontal, Heart, Award, Image, Link as LinkIcon, MessageSquare, Camera, Sliders, Save, X, Move, Trash2, Copy, Pin, Info, HelpCircle, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useGlobalState } from "@/context/GlobalStateContext";
import SkillScoreBadge from "@/components/ui/SkillScoreBadge";

const GRADIENT_PRESETS = [
    { id: 'cosmic', name: 'Cosmic', class: 'from-blue-600 to-purple-600' },
    { id: 'sunset', name: 'Sunset', class: 'from-orange-500 to-pink-500' },
    { id: 'forest', name: 'Forest', class: 'from-emerald-500 to-teal-600' },
    { id: 'ocean', name: 'Ocean', class: 'from-cyan-500 to-blue-600' },
    { id: 'midnight', name: 'Midnight', class: 'from-zinc-800 to-zinc-950' },
];

export default function ProfilePage() {
    const { data: session } = useSession();
    const { userProfile, updateUserProfile, posts, addPost, deletePost, toggleLike, privacySettings, updatePrivacySettings, userProjects, toggleProjectLike } = useGlobalState();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Local state
    const [activeTab, setActiveTab] = useState("Activity");
    const [newPostContent, setNewPostContent] = useState("");
    const [activePostMenu, setActivePostMenu] = useState<number | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);
    const [showOrbitExplainer, setShowOrbitExplainer] = useState(false);
    const [pinnedNotification, setPinnedNotification] = useState<string | null>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [isAdjustingCover, setIsAdjustingCover] = useState(false);
    const [tempCoverSettings, setTempCoverSettings] = useState({ hue: 0, positionY: 50, enableOverlay: true, gradient: "from-blue-600 to-purple-600" });
    const [isLiveLocation, setIsLiveLocation] = useState(false);

    // Live Location Tracking
    useEffect(() => {
        // Only run if tracking is enabled in settings
        if (!navigator.geolocation || !privacySettings?.locationTracking) {
            setIsLiveLocation(false);
            return;
        }

        const updateLocation = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setIsLiveLocation(true);

            // Use OpenStreetMap Nominatim for free reverse geocoding
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                .then(res => res.json())
                .then(data => {
                    if (data.address) {
                        const city = data.address.city || data.address.town || data.address.village || data.address.county;
                        const state = data.address.state;
                        const country = data.address.country;
                        const formattedLocation = [city, state, country].filter(Boolean).slice(0, 2).join(", "); // e.g. "San Francisco, California"

                        // Check if location is different before updating to avoid loops
                        if (userProfile.location !== formattedLocation) {
                            updateUserProfile({ location: formattedLocation });
                        }
                    }
                })
                .catch(err => console.warn("Geocoding error (non-critical):", err));
        };

        const errorLocation = (err: GeolocationPositionError) => {
            // Silently fail on permission denied to avoid console spam
            if (err.code !== err.PERMISSION_DENIED) {
                console.warn("Geolocation warning:", err.message);
            }
            setIsLiveLocation(false);
        };

        // Watch position for "Live" tracking
        const watchId = navigator.geolocation.watchPosition(updateLocation, errorLocation, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, [userProfile.location, privacySettings?.locationTracking]); // Dependency on location to prevent re-running if stable, but updated via Geolocation

    const handlePostSubmit = async () => {
        if (!newPostContent.trim()) return;
        setIsPosting(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        addPost(newPostContent);
        setNewPostContent("");
        setIsPosting(false);
        setPostSuccess(true);
        setTimeout(() => setPostSuccess(false), 3000);
    };

    const handleDeletePost = (id: number) => {
        if (confirm("Are you sure you want to delete this post?")) {
            deletePost(id);
            setActivePostMenu(null);
        }
    };

    const handleCopyLink = (id: number) => {
        navigator.clipboard.writeText(`https://loominn.com/post/${id}`);
        alert("Link copied to clipboard!");
        setActivePostMenu(null);
    };

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUserProfile({ coverImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Hero Section */}
            <div className="relative group">
                <div className="relative h-64 md:h-80 overflow-hidden md:rounded-3xl">
                    <div className={`absolute inset-0 bg-gradient-to-r ${isAdjustingCover ? tempCoverSettings.gradient : (userProfile.coverSettings?.gradient || "from-blue-600 to-purple-600")} opacity-80 group-hover:scale-105 transition-transform duration-700 pointer-events-none`}
                        style={{ display: (isAdjustingCover ? tempCoverSettings.enableOverlay : (userProfile.coverSettings?.enableOverlay ?? true)) ? 'block' : 'none' }}></div>
                    <div
                        className={`absolute inset-0 bg-cover transition-all duration-500 ${(isAdjustingCover ? tempCoverSettings.enableOverlay : (userProfile.coverSettings?.enableOverlay ?? true)) ? 'mix-blend-overlay' : ''}`}
                        style={{
                            backgroundImage: `url('${userProfile.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80"}')`,
                            backgroundPosition: `center ${isAdjustingCover ? tempCoverSettings.positionY : (userProfile.coverSettings?.positionY ?? 50)}%`,
                            filter: `hue-rotate(${isAdjustingCover ? tempCoverSettings.hue : (userProfile.coverSettings?.hue ?? 0)}deg)`
                        }}
                    ></div>

                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                        <div className="flex items-end gap-6">
                            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center text-zinc-400 text-3xl font-bold relative z-10 shadow-2xl overflow-hidden group/avatar">
                                {userProfile.image || session?.user?.image ? (
                                    <img src={userProfile.image || session?.user?.image || ""} alt="User Profile" className="w-full h-full object-cover" />
                                ) : (
                                    "RN"
                                )}
                                {userProfile.stats && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                        <SkillScoreBadge stats={userProfile.stats} size="sm" />
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-1">{userProfile.name}</h1>
                                <p className="text-zinc-300 text-lg mb-1">{userProfile.bio}</p>
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    {privacySettings?.locationTracking ? (
                                        <>
                                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-zinc-300 uppercase tracking-wider font-bold">Location</span>
                                            {isLiveLocation && (
                                                <span className="relative flex h-2 w-2 mx-1">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </span>
                                            )}
                                            <span className={isLiveLocation ? "text-green-400 font-medium" : ""}>
                                                {userProfile.location}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-zinc-300 uppercase tracking-wider font-bold">Based In</span>
                                            <span className="text-zinc-300">
                                                {userProfile.accountOrigin || "United States"}
                                            </span>
                                        </>
                                    )}
                                    <span className="mx-2 text-zinc-600">•</span>
                                    <span className="text-zinc-500 text-xs">Account created in {userProfile.accountOrigin || "United States"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit & Customization Controls */}
                {!isAdjustingCover ? (
                    <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <input
                            type="file"
                            ref={coverInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            aria-label="Upload cover image"
                        />
                        <button
                            onClick={() => {
                                setTempCoverSettings(userProfile.coverSettings || { hue: 0, positionY: 50, enableOverlay: true, gradient: "from-blue-600 to-purple-600" });
                                setIsAdjustingCover(true);
                            }}
                            className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors border border-white/10"
                        >
                            <Camera size={16} />
                            Customize Cover
                        </button>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-colors shadow-lg"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className="absolute top-4 right-4 flex flex-col gap-3 bg-zinc-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl z-30 animate-in fade-in zoom-in-95 duration-200 w-64 shadow-2xl">
                        <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Cover Settings</span>
                            <button onClick={() => setIsAdjustingCover(false)} className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"><X size={14} /></button>
                        </div>

                        {/* Image Upload Action */}
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 mb-2"
                        >
                            <Image size={12} />
                            {userProfile.coverImage ? "Change Image" : "Upload Image"}
                        </button>

                        {/* Overlay Toggle & Color Pickers */}
                        <div className="bg-white/5 p-3 rounded-xl mb-2 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-zinc-300 font-medium">Gradient Overlay</span>
                                <button
                                    onClick={() => setTempCoverSettings({ ...tempCoverSettings, enableOverlay: !tempCoverSettings.enableOverlay })}
                                    className={`w-8 h-4 rounded-full transition-colors flex items-center p-0.5 ${tempCoverSettings.enableOverlay ? 'bg-blue-600' : 'bg-zinc-700'}`}
                                    aria-label="Toggle gradient overlay"
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${tempCoverSettings.enableOverlay ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Theme Presets */}
                            {tempCoverSettings.enableOverlay && (
                                <div className="flex justify-between items-center gap-1">
                                    {GRADIENT_PRESETS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => setTempCoverSettings({ ...tempCoverSettings, gradient: preset.class })}
                                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${preset.class} ring-2 ring-offset-2 ring-offset-zinc-900 transition-all ${tempCoverSettings.gradient === preset.class ? 'ring-white scale-110' : 'ring-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                                            aria-label={`Select ${preset.name} theme`}
                                            title={preset.name}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Position Slider */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-400">
                                <span className="flex items-center gap-1"><Move size={10} /> Position Y</span>
                                <span>{tempCoverSettings.positionY}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100"
                                value={tempCoverSettings.positionY}
                                onChange={(e) => setTempCoverSettings({ ...tempCoverSettings, positionY: Number(e.target.value) })}
                                className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                                aria-label="Cover vertical position"
                            />
                        </div>

                        {/* Hue Slider */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-400">
                                <span className="flex items-center gap-1"><Sliders size={10} /> Hue Rotate</span>
                                <span>{tempCoverSettings.hue}°</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="360"
                                value={tempCoverSettings.hue}
                                onChange={(e) => setTempCoverSettings({ ...tempCoverSettings, hue: Number(e.target.value) })}
                                className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                                aria-label="Cover hue rotation"
                            />
                        </div>

                        {/* Reset Action */}
                        <button
                            onClick={() => setTempCoverSettings({ hue: 0, positionY: 50, enableOverlay: true, gradient: "from-blue-600 to-purple-600" })}
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 w-full text-center underline decoration-zinc-700 hover:decoration-zinc-500 transition-colors py-1"
                        >
                            Reset Adjustments
                        </button>

                        <button
                            onClick={() => {
                                updateUserProfile({ coverSettings: tempCoverSettings });
                                setIsAdjustingCover(false);
                            }}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors mt-2 flex items-center justify-center gap-2"
                        >
                            <Save size={12} />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={userProfile}
                privacySettings={privacySettings}
                onSave={(data) => updateUserProfile(data)}
                onSavePrivacy={(data) => updatePrivacySettings(data)}
            />

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Stats Column */}
                <div className="space-y-6">
                    {/* Skill Score Card */}
                    <div className="relative z-20 bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center">
                        <div className="flex items-center justify-between mb-4 w-full">
                            <div className="flex items-center gap-2">
                                <Award className="text-yellow-500" size={20} />
                                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Orbit Score</span>
                            </div>
                            <button
                                onClick={() => setShowOrbitExplainer(true)}
                                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                                title="Learn how your Orbit Score is calculated"
                            >
                                <Info size={12} />
                                Formula
                            </button>
                        </div>
                        {userProfile.stats ? (
                            <SkillScoreBadge stats={userProfile.stats} size="lg" expanded={true} />
                        ) : (
                            <div className="text-zinc-500 text-sm">No stats available</div>
                        )}
                    </div>

                    {/* Quick Stats (Original) */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Impact</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg"><Heart size={16} /></div>
                                    <span>Total Likes</span>
                                </div>
                                <span className="font-bold text-white text-lg">2.4k</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Share2 size={16} /></div>
                                    <span>Project Views</span>
                                </div>
                                <span className="font-bold text-white text-lg">15.2k</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><MoreHorizontal size={16} /></div>
                                    <span>Commits</span>
                                </div>
                                <span className="font-bold text-white text-lg">482</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Column (2 Spans) */}
                <div className="md:col-span-2 xl:col-span-3">
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-white/10 mb-6">
                        {["Activity", "Projects", "About"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></div>}
                            </button>
                        ))}
                    </div>

                    {/* Projects Content */}
                    {activeTab === "Projects" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {userProjects && userProjects.length > 0 ? (
                                    userProjects.map((project: any) => (
                                        <Link key={project.id} href={`/projects/${project.id === "loominn-rebuild" ? "loominn-rebuild" : project.id}`}>
                                            <div className="group bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all hover:bg-zinc-900/70 cursor-pointer h-full flex flex-col justify-between shadow-lg">
                                                <div className={`h-36 bg-gradient-to-br ${project.color || 'from-blue-600 to-indigo-700'} relative p-5 flex flex-col justify-between`}>
                                                    <div className="flex justify-between items-start">
                                                        <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] uppercase font-bold text-white tracking-wider border border-white/10">
                                                            {project.status || 'Active Build'}
                                                        </span>
                                                        <div className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                                            <ChevronRight size={14} />
                                                        </div>
                                                    </div>
                                                    <div className="text-white">
                                                        <h4 className="font-bold text-lg leading-snug drop-shadow-md">{project.title}</h4>
                                                        <span className="text-xs text-white/80">{project.category || 'Workspace Project'}</span>
                                                    </div>
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col justify-between">
                                                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                                                    <div className="space-y-3 pt-3 border-t border-white/5">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {project.roles && project.roles.map((r: any, idx: number) => (
                                                                <span key={idx} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-medium">
                                                                    {r.title}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs text-zinc-500">
                                                            <span>{project.members || 1} team members</span>
                                                            <span className="flex items-center gap-1 text-zinc-400"><Heart size={12} className="text-pink-500 fill-pink-500" /> {project.likes || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : null}

                                {/* Create New Project Card */}
                                <Link href="/projects/create" className="block h-full min-h-[220px]">
                                    <div className="h-full border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-2xl flex flex-col items-center justify-center gap-4 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/5 transition-all group p-6 cursor-pointer">
                                        <div className="p-4 bg-zinc-900 group-hover:bg-blue-500/20 rounded-full transition-colors">
                                            <MoreHorizontal size={24} className="text-zinc-500 group-hover:text-blue-400" />
                                        </div>
                                        <div className="text-center">
                                            <span className="font-bold block text-sm">Create New Project</span>
                                            <span className="text-xs text-zinc-500 mt-1 block">Launch a workspace with roles, timeline & Orbit rewards</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Activity Content (Formerly Posts) */}
                    {activeTab === "Activity" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* New Post Input */}
                            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden">
                                        {userProfile.image || session?.user?.image ? (
                                            <img src={userProfile.image || session?.user?.image || ""} alt="User" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs">RN</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            placeholder="What are you working on?"
                                            className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none resize-none min-h-[80px]"
                                        />
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                                            <div className="flex gap-2">
                                                <button className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors">
                                                    <Image size={18} />
                                                </button>
                                                <button className="p-2 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors">
                                                    <LinkIcon size={18} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handlePostSubmit}
                                                disabled={!newPostContent.trim() || isPosting}
                                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!newPostContent.trim() || isPosting
                                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                                                    }`}
                                            >
                                                {isPosting ? "Posting..." : "Post Update"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {postSuccess && (
                                    <div className="mt-2 p-2 bg-green-500/10 text-green-400 text-xs rounded text-center animate-in fade-in">
                                        Post published successfully!
                                    </div>
                                )}
                            </div>
                            {/* Render User Projects in Stream */}
                            {userProjects && userProjects.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider pl-2">Project Applications</h3>
                                    {userProjects.map((project: any) => (
                                        <div key={project.id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-400 overflow-hidden">
                                                    {userProfile.image ? (
                                                        <img src={userProfile.image} alt={userProfile.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Award size={20} />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm">{userProfile.name}</h4>
                                                            <span className="text-xs text-zinc-500">{project.submittedAt || "Just now"}</span>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${project.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                                            project.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                                'bg-yellow-500/10 text-yellow-400'
                                                            }`}>
                                                            {project.status || 'Submitted'}
                                                        </span>
                                                    </div>

                                                    {/* Rich Content Area */}
                                                    <div className="mt-2 text-zinc-300 text-sm leading-relaxed">
                                                        <p className="mb-3">I've just submitted a new project proposal for <span className="text-white font-medium">{project.title}</span>.</p>

                                                        {/* Project Embedded Card */}
                                                        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden mt-3">
                                                            {/* Mock Cover or Gradient */}
                                                            <div className="h-32 bg-gradient-to-r from-blue-900/40 to-purple-900/40 relative">
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <Award className="text-white/20" size={48} />
                                                                </div>
                                                                <div className="absolute bottom-3 left-3">
                                                                    <h5 className="font-bold text-white text-lg">{project.title}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="p-4">
                                                                <p className="text-zinc-400 text-sm mb-3">
                                                                    {project.description}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {project.roles && project.roles.map((r: any, idx: number) => (
                                                                        <span key={idx} className="text-xs bg-white/5 text-zinc-300 px-2 py-1 rounded border border-white/5">
                                                                            {r.title}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Interaction Bar */}
                                                    <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
                                                        <button
                                                            onClick={() => toggleProjectLike(project.id)}
                                                            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-pink-500 transition-colors group"
                                                        >
                                                            <Heart size={16} className={`group-hover:scale-110 transition-transform ${project.likes > 0 ? "fill-pink-500 text-pink-500" : ""}`} />
                                                            {project.likes || 0}
                                                        </button>
                                                        <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-blue-400 transition-colors group">
                                                            <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                                                            0
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Render User Posts */}
                            {posts.filter(p => p.author === userProfile.name).length > 0 ? (
                                posts.filter(p => p.author === userProfile.name).map((post) => (
                                    <div key={post.id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden">
                                                {userProfile.image || session?.user?.image ? (
                                                    <img src={userProfile.image || session?.user?.image || ""} alt="User" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-zinc-500 text-xs">RN</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{userProfile.name}</h4>
                                                        <span className="text-xs text-zinc-500">{post.time}</span>
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActivePostMenu(activePostMenu === post.id ? null : post.id)}
                                                            className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                                                        >
                                                            <MoreHorizontal size={16} />
                                                        </button>
                                                        {activePostMenu === post.id && (
                                                            <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                                                <button
                                                                    onClick={() => handleCopyLink(post.id)}
                                                                    className="w-full text-left px-4 py-3 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                                                >
                                                                    <Copy size={14} /> Copy Link
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setPinnedNotification("Perspective pinned to your profile spotlight.");
                                                                        setActivePostMenu(null);
                                                                        setTimeout(() => setPinnedNotification(null), 3000);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                                                                >
                                                                    <Pin size={14} /> Pin to Profile
                                                                </button>
                                                                <div className="h-px bg-white/5 mx-2 my-1"></div>
                                                                <button
                                                                    onClick={() => handleDeletePost(post.id)}
                                                                    className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                                                                >
                                                                    <Trash2 size={14} /> Delete Post
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-zinc-300 text-sm mt-2 leading-relaxed">
                                                    {post.content}
                                                </p>
                                                <div className="mt-3">
                                                    {/* Ensure Project Data is rendered if available */}
                                                    {post.projectData && (
                                                        <div className="bg-zinc-900 p-3 rounded-xl border border-white/5 mt-2">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[10px] uppercase font-bold text-blue-400">Project Update</span>
                                                            </div>
                                                            <h5 className="font-bold text-white text-sm">{post.projectData.title}</h5>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Interaction Bar */}
                                                <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
                                                    <button
                                                        onClick={() => toggleLike(post.id)}
                                                        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-pink-500 transition-colors group"
                                                    >
                                                        <Heart size={16} className={`group-hover:scale-110 transition-transform ${post.likes > 0 ? "fill-pink-500 text-pink-500" : ""}`} />
                                                        {post.likes}
                                                    </button>
                                                    <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-blue-400 transition-colors group">
                                                        <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                                                        {post.comments}
                                                    </button>
                                                    <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-purple-400 transition-colors group">
                                                        <Share2 size={16} className="group-hover:scale-110 transition-transform" />
                                                        {post.shares}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))) : (
                                (!userProjects || userProjects.length === 0) && (
                                    <div className="text-center py-12 text-zinc-500">
                                        <p>No activity yet. Share what you're working on!</p>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* About Content */}
                    {activeTab === "About" && (
                        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-white mb-4">About Me</h3>
                            <p className="text-zinc-400 leading-relaxed mb-6">
                                {userProfile.bio}
                            </p>

                            <h4 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Technical Skills</h4>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "PostgreSQL", "System Design"].map((skill) => (
                                    <span key={skill} className="bg-white/5 border border-white/5 text-zinc-300 px-3 py-1 rounded-full text-sm hover:bg-white/10 hover:border-white/10 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-900/50 rounded-xl">
                                    <span className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Location</span>
                                    <span className="text-white font-medium">{userProfile.location}</span>
                                </div>
                                <div className="p-4 bg-zinc-900/50 rounded-xl">
                                    <span className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Joined</span>
                                    <span className="text-white font-medium">December 2023</span>
                                </div>
                                <div className="p-4 bg-zinc-900/50 rounded-xl">
                                    <span className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Website</span>
                                    <span className="text-blue-400 font-medium">loominn.com/rajayogi</span>
                                </div>
                                <div className="p-4 bg-zinc-900/50 rounded-xl">
                                    <span className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Email</span>
                                    <span className="text-white font-medium">{userProfile.email || "rajayogi@loominn.com"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Orbit Score Transparent Formula Explainer Modal */}
            {showOrbitExplainer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Orbit Score Formula</h3>
                                    <p className="text-xs text-zinc-400">Verifiable, transparent credibility on Loominn</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowOrbitExplainer(false)}
                                className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                <p className="text-xs text-zinc-300 leading-relaxed">
                                    Orbit Score is Loominn&apos;s merit-driven credibility metric. Unlike algorithmic karma or vanity follower counts, Orbit Score is computed purely from cryptographic proof of work, peer audits, and workspace milestone delivery.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Mathematical Breakdown</h4>
                                <div className="space-y-3">
                                    {[
                                        { label: "Technical Architecture & Code Delivery", weight: "25%", desc: "Merged PRs, verifiable commits, and clean CI test runs inside project workspaces." },
                                        { label: "Proof Ledger & Evidence", weight: "25%", desc: "Cryptographically verified milestone submissions and artifact attachments." },
                                        { label: "Peer Collaboration Audits", weight: "20%", desc: "Review endorsements and structured appraisals from Partner and Colleague tier members." },
                                        { label: "High-Resonance Perspectives", weight: "15%", desc: "Knowledge-sharing writeups, architecture reviews, and engineering discussion resonance." },
                                        { label: "Delivery Reliability & Uptime", weight: "15%", desc: "Sprint milestone completion punctuality and verified task fulfillment." },
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 flex items-start justify-between gap-4">
                                            <div>
                                                <span className="text-xs font-bold text-white block">{item.label}</span>
                                                <span className="text-[11px] text-zinc-400 mt-0.5 block leading-relaxed">{item.desc}</span>
                                            </div>
                                            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20 whitespace-nowrap">
                                                {item.weight}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-white/10">
                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">How to Level Up Your Score</h4>
                                <ul className="space-y-2 text-xs text-zinc-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                                        <span>Apply to open roles in projects matching your domain</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                                        <span>Complete milestones and submit verification evidence to the Proof Ledger</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                                        <span>Receive peer endorsements from team members upon milestone sign-off</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setShowOrbitExplainer(false)}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/30"
                            >
                                Close Explainer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pinned Notification Toast */}
            {pinnedNotification && (
                <div className="fixed bottom-24 right-6 z-50 bg-zinc-900 border border-blue-500/30 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Pin size={14} className="text-blue-400" />
                    <span>{pinnedNotification}</span>
                </div>
            )}
        </div>
    );
}
