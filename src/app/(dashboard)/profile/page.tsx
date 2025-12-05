"use client";

import { Share2, MoreHorizontal, Heart, Award, Image, Link as LinkIcon, MessageSquare, Camera, Sliders, Save, X, Move } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useGlobalState } from "@/context/GlobalStateContext";

const GRADIENT_PRESETS = [
    { id: 'cosmic', name: 'Cosmic', class: 'from-blue-600 to-purple-600' },
    { id: 'sunset', name: 'Sunset', class: 'from-orange-500 to-pink-500' },
    { id: 'forest', name: 'Forest', class: 'from-emerald-500 to-teal-600' },
    { id: 'ocean', name: 'Ocean', class: 'from-cyan-500 to-blue-600' },
    { id: 'midnight', name: 'Midnight', class: 'from-zinc-800 to-zinc-950' },
];

const USER_PROJECTS = [
    {
        id: 1,
        title: "I am new to this channel",
        description: "Hello 👋 Just joined Loominn and excited to connect with everyone here! I'm a full-stack developer working on some cool AI projects.",
        author: "Rajayogi Nandina",
        image: "/placeholder-1.jpg",
        votes: 24,
        comments: 5,
        tags: ["Introduction", "Developer"],
        color: "from-blue-500 to-purple-600",
        role: "Lead Developer",
        likes: 124,
        updated: "2 days ago"
    }
];

export default function ProfilePage() {
    const { data: session } = useSession();
    const { userProfile, updateUserProfile, posts, addPost, toggleLike } = useGlobalState();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Local state
    const [activeTab, setActiveTab] = useState("Projects");
    const [newPostContent, setNewPostContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [postSuccess, setPostSuccess] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [isAdjustingCover, setIsAdjustingCover] = useState(false);
    const [tempCoverSettings, setTempCoverSettings] = useState({ hue: 0, positionY: 50, enableOverlay: true, gradient: "from-blue-600 to-purple-600" });
    const [isLiveLocation, setIsLiveLocation] = useState(false);

    // Live Location Tracking
    useEffect(() => {
        if (!navigator.geolocation) return;

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
                .catch(err => console.error("Geocoding error:", err));
        };

        const errorLocation = (err: GeolocationPositionError) => {
            console.error("Geolocation denied or error:", err);
            setIsLiveLocation(false);
        };

        // Watch position for "Live" tracking
        const watchId = navigator.geolocation.watchPosition(updateLocation, errorLocation, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, [userProfile.location]); // Dependency on location to prevent re-running if stable, but updated via Geolocation

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
                            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center text-zinc-400 text-3xl font-bold relative z-10 shadow-2xl overflow-hidden">
                                {userProfile.image || session?.user?.image ? (
                                    <img src={userProfile.image || session?.user?.image || ""} alt="User Profile" className="w-full h-full object-cover" />
                                ) : (
                                    "RN"
                                )}
                            </div>
                            <div className="mb-2">
                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-1">{userProfile.name}</h1>
                                <p className="text-zinc-300 text-lg mb-1">{userProfile.bio}</p>
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
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
                onSave={(data) => updateUserProfile(data)}
            />

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Stats Column */}
                <div className="space-y-6">
                    {/* Skill Mastery Card (New) */}
                    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <Award className="text-yellow-500" /> Skill Mastery
                        </h2>
                        <p className="text-xs text-blue-200 mb-4">Cumulative Score across all projects</p>

                        <div className="text-center py-4">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                                945
                            </div>
                            <div className="text-sm font-bold text-white">React Specialist</div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-xs text-zinc-300">
                                <span>Next.js</span>
                                <span>Lvl 85</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[85%]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-zinc-300">
                                <span>UI Design</span>
                                <span>Lvl 72</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[72%]"></div>
                            </div>
                        </div>
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
                        {["Projects", "Posts", "About"].map((tab) => (
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {USER_PROJECTS.map((project) => (
                                <div key={project.id} className="group bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all hover:bg-zinc-900/50">
                                    <div className="h-40 bg-zinc-800 relative overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                                        {/* Placeholder for project image */}
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                                            <Image size={48} />
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                            <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">{project.updated}</span>
                                        </div>
                                        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{project.description}</p>
                                        <div className="flex items-center justify-between text-xs text-zinc-500">
                                            <div className="flex gap-2">
                                                {project.tags.map(tag => (
                                                    <span key={tag} className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">{tag}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1"><Heart size={12} /> {project.likes}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Create New Project Card */}
                            <button className="h-full min-h-[250px] border-2 border-dashed border-white/5 hover:border-blue-500/30 rounded-2xl flex flex-col items-center justify-center gap-4 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/5 transition-all group">
                                <div className="p-4 bg-zinc-900 group-hover:bg-blue-500/20 rounded-full transition-colors">
                                    <MoreHorizontal size={24} className="text-zinc-600 group-hover:text-blue-400" />
                                </div>
                                <span className="font-medium">Create New Project</span>
                            </button>
                        </div>
                    )}

                    {/* Posts Content */}
                    {activeTab === "Posts" && (
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

                            {/* Feed */}
                            {posts.map((post) => (
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
                                                <button className="text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                                            </div>
                                            <p className="text-zinc-300 text-sm mt-2 leading-relaxed">
                                                {post.content}
                                            </p>
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
                            ))}
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
        </div>
    );
}
