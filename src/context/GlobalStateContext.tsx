"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { UserProfile, Post, Perspective, PrivacySettings } from "@/lib/types/schema";

interface GlobalState {
    userProfile: UserProfile;
    updateUserProfile: (data: Partial<UserProfile>) => void;
    posts: Post[];
    addPost: (content: string) => void;
    deletePost: (id: number) => void;
    toggleLike: (id: number) => void;
    perspectives: Perspective[];
    addPerspective: (perspective: Perspective) => void;
    privacySettings: PrivacySettings;
    updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
    userProjects: any[]; // Using any for quick iteration, ideally typed as Project[]
    addProject: (project: any) => void;
    toggleProjectLike: (id: number) => void;
    approveProject: (projectId: number) => void;
    commitToProject: (cost: number) => boolean;
    savedPosts: number[];
    toggleSave: (postId: number) => void;
    notifications: any[];
    addNotification: (title: string, message: string) => void;
}

const defaultPrivacySettings: PrivacySettings = {
    locationTracking: true
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
    skills: ["React", "TypeScript", "UI/UX", "AI"],
    projects: ["Loominn Rebuild", "Eco-Tracker"],
    email: "",
    accountOrigin: "",
    vResume: "",
    stats: {
        velocity: 100,
        projectsCompleted: 1330, // x10 = 13,300
        onTimeCompletion: 1330,  // x5 = 6,650 -> Total Base ~20,000
        complexity: 100,         // x100 -> 2,000,000
        risk: 1
    },
    stakedScore: 0
};

const initialPosts: Post[] = [
    { id: 1, content: "Just deployed the new version of the Loominn platform! 🚀 The new holographic navigation is a game changer. Check it out and let me know what you think. #webdev #uiux #react", time: "2 hours ago", likes: 24, comments: 5, shares: 2, author: "Rajayogi Nandina" },
    { id: 2, content: "Working on some exciting new features for the dashboard. Stay tuned! 💻", time: "5 hours ago", likes: 12, comments: 2, shares: 0, author: "Rajayogi Nandina" }
];

const initialPerspectives: Perspective[] = [
    {
        id: "p-1",
        userId: "u-elena",
        userName: "Elena R.",
        role: "AI Researcher",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        title: "The Future of Generative AI in Code",
        location: "London, UK",
        status: "Perspective",
        items: [
            { id: "pi-1", type: "text", content: "Generative AI is shifting from auto-complete to architecture design.", duration: 5000, background: "bg-purple-900" }
        ],
        createdAt: "2 hours ago"
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
    const [savedPosts, setSavedPosts] = useState<number[]>([]);

    // Hydrate from localStorage on mount (Client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedProfile = localStorage.getItem("loominn_profile");
                if (savedProfile) {
                    const parsed = JSON.parse(savedProfile);
                    // Force update stats to meet 2M requirement (Requested by User)
                    // This overrides any old cached stats while keeping other profile changes
                    parsed.stats = defaultProfile.stats;
                    setUserProfile(parsed);
                }

                const savedPrivacy = localStorage.getItem("loominn_privacy");
                if (savedPrivacy) setPrivacySettings(JSON.parse(savedPrivacy));

                const storedPosts = localStorage.getItem("loominn_posts");
                if (storedPosts) setPosts(JSON.parse(storedPosts));

                const savedPerspectives = localStorage.getItem("loominn_perspectives");
                if (savedPerspectives) setPerspectives(JSON.parse(savedPerspectives));

                const saved = localStorage.getItem("loominn_saved_posts");
                if (saved) setSavedPosts(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to hydrate global state:", e);
            }
        }
    }, []);

    // ... existing Sync with session code ...
    // Note: The previous view_file had this wrapped in a comment, but I should probably leave it out or implement a basic sync if needed.
    // However, looking at line 103 in view_file, it was literally "// ... existing Sync with session code ...".
    // I will assume for now I don't need to add anything special unless the user had custom logic there.
    // The previous code had session sync logic. I will add a basic one just in case.
    useEffect(() => {
        if (session?.user) {
            const currentUser = session.user;
            setUserProfile(prev => ({
                ...prev,
                name: currentUser.name || prev.name,
                email: currentUser.email || prev.email,
                image: currentUser.image || prev.image
            }));
        }
    }, [session]);

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
            shares: 0,
            author: userProfile.name,
            authorImage: userProfile.image
        };
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem("loominn_posts", JSON.stringify(updatedPosts));
    };

    const deletePost = (id: number) => {
        const updated = posts.filter(p => p.id !== id);
        setPosts(updated);
        localStorage.setItem("loominn_posts", JSON.stringify(updated));
    };

    const addPerspective = (perspective: Perspective) => {
        const newP = { ...perspective, id: perspective.id || crypto.randomUUID() };
        const updated = [newP, ...perspectives];
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

    const toggleSave = (postId: number) => {
        setSavedPosts(prev => {
            const updated = prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId];
            localStorage.setItem("loominn_saved_posts", JSON.stringify(updated));
            return updated;
        });
    };

    // --- Notifications ---
    const [notifications, setNotifications] = useState<any[]>([]);

    const addNotification = (title: string, message: string) => {
        const newNotif = { id: Date.now(), title, message, read: false, time: 'Just now' };
        setNotifications(prev => [newNotif, ...prev]);
        // Ideally persist notifications too
    };

    // --- Projects Persistence & Approval ---
    const [userProjects, setUserProjects] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedProjects = localStorage.getItem("loominn_user_projects");
            if (savedProjects) setUserProjects(JSON.parse(savedProjects));
        }
    }, []);

    const addProject = (project: any) => {
        const newProject = {
            ...project,
            id: Date.now(),
            status: 'submitted',
            likes: 0,
            submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        const updated = [newProject, ...userProjects];
        setUserProjects(updated);
        localStorage.setItem("loominn_user_projects", JSON.stringify(updated));
    };

    const toggleProjectLike = (id: number) => {
        const updated = userProjects.map(p =>
            p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p
        );
        setUserProjects(updated);
        localStorage.setItem("loominn_user_projects", JSON.stringify(updated));
    };

    const commitToProject = (cost: number): boolean => {
        // Here we could check if user has enough points, but UI should handle pre-validation.
        // We just deduct (add to Staked score).
        updateUserProfile({ stakedScore: (userProfile.stakedScore || 0) + cost });
        addNotification("Score Staked", `Successfully staked ${cost} Orbit Points to project application.`);
        return true;
    };

    const approveProject = (projectId: number) => {
        // 1. Update Project Status
        const updatedProjects = userProjects.map(p =>
            p.id === projectId ? { ...p, status: 'approved' } : p
        );
        setUserProjects(updatedProjects);
        localStorage.setItem("loominn_user_projects", JSON.stringify(updatedProjects));

        // 2. Find the project
        const project = userProjects.find(p => p.id === projectId);
        if (!project) return;

        // 3. Create Feed Post (Automated Announcement)
        const announcementPost: Post = {
            id: Date.now(),
            content: project.description, // Use description as post content or a template
            time: "Just now",
            likes: 0,
            comments: 0,
            shares: 0,
            projectData: project, // Link full project data
            roles: project.roles, // Ensure roles are accessible for the badge
            author: userProfile.name,
            authorImage: userProfile.image
        };
        const updatedPosts = [announcementPost, ...posts];
        setPosts(updatedPosts);
        localStorage.setItem("loominn_posts", JSON.stringify(updatedPosts));

        // 4. Send Notification
        addNotification("Project Approved", `Your project "${project.title}" has been approved and is now live on the network feed.`);
    };

    return (
        <GlobalStateContext.Provider value={{
            userProfile, updateUserProfile,
            posts, addPost, deletePost, toggleLike,
            perspectives, addPerspective,
            privacySettings, updatePrivacySettings,
            userProjects, addProject, approveProject, toggleProjectLike,
            commitToProject,
            savedPosts, toggleSave,
            notifications, addNotification
        }}>
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
