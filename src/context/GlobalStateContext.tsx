"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface UserProfile {
    name: string;
    bio: string;
    location: string;
    image: string;
    coverImage: string;
    coverSettings?: {
        hue: number;
        positionY: number;
        enableOverlay: boolean;
        gradient: string;
    };
    email?: string;
}

interface Post {
    id: number;
    content: string;
    time: string;
    likes: number;
    comments: number;
    shares: number;
}

interface GlobalState {
    userProfile: UserProfile;
    updateUserProfile: (data: Partial<UserProfile>) => void;
    posts: Post[];
    addPost: (content: string) => void;
    toggleLike: (id: number) => void;
    perspectives: Perspective[];
    addPerspective: (perspective: Perspective) => void;
    privacySettings: PrivacySettings;
    updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
}

interface Perspective {
    id: string;
    userId: string;
    userName: string;
    role: string;
    userImage: string;
    title: string;
    status: string;
    items: {
        id: string;
        type: string;
        content?: string;
        url?: string;
        caption?: string;
        background?: string;
        duration: number;
    }[];
}

interface PrivacySettings {
    locationTracking: boolean;
    originCountry: string;
}

const defaultPrivacySettings: PrivacySettings = {
    locationTracking: true,
    originCountry: "United States"
};

const defaultProfile: UserProfile = {
    name: "Rajayogi Nandina",
    bio: "Full Stack Developer • UI/UX Enthusiast",
    location: "San Francisco, CA",
    image: "",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80",
    coverSettings: {
        hue: 0,
        positionY: 50,
        enableOverlay: true,
        gradient: "from-blue-600 to-purple-600"
    },
    email: ""
};

const initialPosts: Post[] = [
    { id: 1, content: "Just deployed the new version of the Loominn platform! 🚀 The new holographic navigation is a game changer. Check it out and let me know what you think. #webdev #uiux #react", time: "2 hours ago", likes: 24, comments: 5, shares: 2 },
    { id: 2, content: "Working on some exciting new features for the dashboard. Stay tuned! 💻", time: "5 hours ago", likes: 12, comments: 2, shares: 0 }
];

// Mock Initial Perspectives
const initialPerspectives: Perspective[] = [
    {
        id: "b1",
        userId: "u2",
        userName: "Sarah Chen",
        role: "Lead Designer",
        userImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80",
        title: "The Future of Design Systems",
        status: "Perspective",
        items: [
            { id: "bi1", type: "text", content: "Atomic design is evolving. We need to think more about composition over rigid structures.", background: "bg-zinc-900 border border-blue-500/30", duration: 5000 },
            { id: "bi2", type: "image", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80", caption: "Fluid Typography Scaling", duration: 5000 }
        ]
    },
    {
        id: "b2",
        userId: "u3",
        userName: "Mike Ross",
        role: "Frontend Dev",
        userImage: "",
        title: "Authentication Flow",
        status: "In Progress",
        items: [
            { id: "bi3", type: "text", content: "Debugging the OAuth callback issue. Expect a fix in 2 hours.", background: "bg-zinc-900 border border-yellow-500/30", duration: 4000 }
        ]
    },
    {
        id: "b3",
        userId: "u4",
        userName: "Jessica Lee",
        role: "Product Manager",
        userImage: "",
        title: "Sprint Goals",
        status: "Planning",
        items: [
            { id: "bi4", type: "text", content: "Priorities for next sprint: 1. Mobile Responsiveness 2. User Onboarding.", background: "bg-zinc-900 border border-purple-500/30", duration: 5000 }
        ]
    }
];

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    // Initialize with defaults to match server-side rendering
    const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [perspectives, setPerspectives] = useState<Perspective[]>(initialPerspectives);

    // Hydrate from localStorage on mount (Client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedProfile = localStorage.getItem("loominn_profile");
                if (savedProfile) setUserProfile(JSON.parse(savedProfile));

                const savedPrivacy = localStorage.getItem("loominn_privacy");
                if (savedPrivacy) setPrivacySettings(JSON.parse(savedPrivacy));

                const savedPosts = localStorage.getItem("loominn_posts");
                if (savedPosts) setPosts(JSON.parse(savedPosts));

                const savedPerspectives = localStorage.getItem("loominn_perspectives");
                if (savedPerspectives) {
                    setPerspectives(JSON.parse(savedPerspectives));
                }
            } catch (e) {
                console.error("Failed to hydrate global state:", e);
            }
        }
    }, []);

    // Sync with session and handle user switching
    useEffect(() => {
        if (session?.user?.email) {
            const currentEmail = userProfile.email;
            const sessionEmail = session.user.email;

            // Only overwrite if emails don't match AND we have a valid session email
            // This prevents overwriting a customized local profile with default session data unnecessarily
            if (currentEmail !== sessionEmail && sessionEmail) {
                console.log("Syncing profile with session for:", sessionEmail);

                // If we have a stored profile for this email, we would have loaded it in the first useEffect
                // If we are here, it means the current local profile (default or loaded) doesn't match the session.
                // We should check if we really want to overwrite or if we just haven't loaded the right one yet.
                // For this simple app, we'll assume a mismatch means we should reset to session/default for the new user.

                const newProfile: UserProfile = {
                    name: session.user.name || defaultProfile.name,
                    bio: defaultProfile.bio,
                    location: defaultProfile.location,
                    image: session.user.image || "",
                    coverImage: defaultProfile.coverImage,
                    coverSettings: defaultProfile.coverSettings,
                    email: sessionEmail
                };
                setUserProfile(newProfile);
                localStorage.setItem("loominn_profile", JSON.stringify(newProfile));
            }
        }
    }, [session, userProfile.email]);

    const updateUserProfile = (data: Partial<UserProfile>) => {
        setUserProfile(prev => {
            const updated = { ...prev, ...data };
            localStorage.setItem("loominn_profile", JSON.stringify(updated));
            return updated;
        });
    };

    const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
        setPrivacySettings(prev => {
            const updated = { ...prev, ...settings };
            localStorage.setItem("loominn_privacy", JSON.stringify(updated));
            return updated;
        });
    };

    const addPost = (content: string) => {
        const newPost: Post = {
            id: Date.now(),
            content,
            time: "Just now",
            likes: 0,
            comments: 0,
            shares: 0
        };
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem("loominn_posts", JSON.stringify(updatedPosts));
    };

    const addPerspective = (perspective: Perspective) => {
        const updated = [perspective, ...perspectives];
        setPerspectives(updated);
        localStorage.setItem("loominn_perspectives", JSON.stringify(updated));
    };

    const toggleLike = (id: number) => {
        const updatedPosts = posts.map(post =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
        );
        setPosts(updatedPosts);
        localStorage.setItem("loominn_posts", JSON.stringify(updatedPosts));
    };

    return (
        <GlobalStateContext.Provider value={{ userProfile, updateUserProfile, posts, addPost, toggleLike, perspectives, addPerspective, privacySettings, updatePrivacySettings }}>
            {children}
        </GlobalStateContext.Provider>
    );
}

export function useGlobalState() {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error("useGlobalState must be used within a GlobalStateProvider");
    }
    return context;
}
