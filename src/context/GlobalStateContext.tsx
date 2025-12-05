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
}

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

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    // Lazy initialization for persistence
    const [userProfile, setUserProfile] = useState<UserProfile>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem("loominn_profile");
                if (saved) return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse user profile", e);
            }
        }
        return defaultProfile;
    });

    const [posts, setPosts] = useState<Post[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem("loominn_posts");
                if (saved) return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse posts", e);
            }
        }
        return initialPosts;
    });

    // Sync with session and handle user switching
    useEffect(() => {
        if (session?.user?.email) {
            const currentEmail = userProfile.email;
            const sessionEmail = session.user.email;

            // If currently loaded profile doesn't match session (or is default empty), try to find or create
            if (currentEmail !== sessionEmail) {
                console.log("Syncing profile with session for:", sessionEmail);
                const newProfile: UserProfile = {
                    name: session.user.name || defaultProfile.name,
                    bio: defaultProfile.bio,
                    location: defaultProfile.location,
                    image: session.user.image || "",
                    coverImage: defaultProfile.coverImage,
                    coverSettings: defaultProfile.coverSettings, // Ensure this structure is present
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

    const toggleLike = (id: number) => {
        const updatedPosts = posts.map(post =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
        );
        setPosts(updatedPosts);
        localStorage.setItem("loominn_posts", JSON.stringify(updatedPosts));
    };

    return (
        <GlobalStateContext.Provider value={{ userProfile, updateUserProfile, posts, addPost, toggleLike }}>
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
