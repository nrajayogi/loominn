"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { 
    UserProfile, 
    Post, 
    Perspective, 
    PrivacySettings, 
    Comment, 
    ProjectApplication, 
    WorkspaceTask, 
    ContributionRecord, 
    NetworkConnection, 
    RelationshipTier, 
    ConnectionStatus 
} from "@/lib/types/schema";

interface GlobalState {
    userProfile: UserProfile;
    updateUserProfile: (data: Partial<UserProfile>) => void;
    posts: Post[];
    addPost: (content: string, image?: string) => void;
    deletePost: (id: number) => void;
    toggleLike: (id: number) => void;
    perspectives: Perspective[];
    addPerspective: (perspective: Perspective) => void;
    privacySettings: PrivacySettings;
    updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
    userProjects: any[];
    addProject: (project: any) => void;
    toggleProjectLike: (id: number) => void;
    approveProject: (projectId: number) => void;
    commitToProject: (cost: number) => boolean;
    savedPosts: number[];
    toggleSave: (postId: number) => void;
    notifications: any[];
    addNotification: (title: string, message: string, link?: string) => void;

    // --- Extended Social, Network, Workspace, and Credibility Contracts ---
    comments: Comment[];
    addComment: (targetId: string | number, content: string, authorName?: string, authorImage?: string) => void;
    applications: ProjectApplication[];
    applyToRole: (application: Omit<ProjectApplication, "id" | "submittedAt" | "status">) => void;
    reviewApplication: (applicationId: string, status: "accepted" | "declined", feedback?: string) => void;
    workspaceTasks: WorkspaceTask[];
    addTask: (task: Omit<WorkspaceTask, "id" | "createdAt">) => void;
    moveTask: (taskId: string, newStatus: WorkspaceTask["status"]) => void;
    deleteTask: (taskId: string) => void;
    contributions: ContributionRecord[];
    addContribution: (contribution: Omit<ContributionRecord, "id">) => void;
    networkConnections: NetworkConnection[];
    sendConnectionRequest: (userId: string, tier: RelationshipTier) => void;
    updateConnectionStatus: (connectionId: string, status: ConnectionStatus, tier?: RelationshipTier) => void;
    reportedItems: Array<{ id: string; targetId: string; targetType: string; reason: string; timestamp: string }>;
    reportItem: (targetId: string, targetType: string, reason: string) => void;
    blockedUsers: string[];
    toggleBlockUser: (userId: string) => void;
    mutedUsers: string[];
    toggleMuteUser: (userId: string) => void;
    followingUsers: string[];
    toggleFollowUser: (userId: string) => void;
    followingTopics: string[];
    toggleFollowTopic: (topicId: string) => void;
}

const defaultPrivacySettings: PrivacySettings = {
    locationTracking: true,
    allowDirectMessages: true,
    showOrbitScore: true,
    blockedUserIds: [],
    mutedUserIds: []
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
    skills: ["React", "TypeScript", "UI/UX", "AI", "Next.js", "GraphQL"],
    projects: ["Loominn Rebuild", "Quantum Ledger", "Nebula AI"],
    email: "rajayogi@loominn.com",
    accountOrigin: "San Francisco, United States",
    vResume: "https://example.com/demo-vresume.mp4",
    stats: {
        velocity: 100,
        projectsCompleted: 1330,
        onTimeCompletion: 1330,
        complexity: 100,
        risk: 1
    },
    stakedScore: 0
};

const initialPosts: Post[] = [
    { 
        id: 1, 
        content: "Just shipped the updated Loominn architecture! 🚀 Polymorphic feed cards, transparent Orbit score calculations, and real-time collaboration channels are now unified. Check it out and let me know your thoughts!", 
        time: "2 hours ago", 
        likes: 24, 
        comments: 5, 
        shares: 2, 
        author: "Rajayogi Nandina" 
    },
    { 
        id: 2, 
        content: "Drafting the decentralized state verification protocol for multi-user design canvas. Would love feedback from distributed systems engineers on whether CRDTs or OT fit better for ephemeral presentation slides.", 
        time: "5 hours ago", 
        likes: 12, 
        comments: 2, 
        shares: 0, 
        author: "Rajayogi Nandina" 
    }
];

const initialPerspectives: Perspective[] = [
    {
        id: "p-1",
        userId: "u-elena",
        userName: "Elena R.",
        role: "AI Researcher",
        userImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        title: "The Future of Generative AI in Code Architecture",
        location: "London, UK",
        status: "Perspective",
        items: [
            { 
                id: "pi-1", 
                type: "text", 
                content: "Generative AI is shifting rapidly from local code completion into holistic system architecture reasoning.", 
                duration: 5000, 
                background: "bg-gradient-to-br from-purple-900 to-black" 
            },
            {
                id: "pi-2",
                type: "text",
                content: "When neural architectures can trace multi-module side effects, verification becomes the primary differentiator of engineering credibility.",
                duration: 5000,
                background: "bg-gradient-to-br from-blue-900 to-indigo-950"
            }
        ],
        createdAt: "2 hours ago"
    },
    {
        id: "p-2",
        userId: "u-siddharth",
        userName: "Siddharth Dev",
        role: "Systems Engineer",
        userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        title: "Zero-Knowledge Proofs for Verifiable Craft",
        location: "Berlin, DE",
        status: "In Progress",
        items: [
            { 
                id: "pi-3", 
                type: "text", 
                content: "Proving you solved a computational or algorithmic challenge without revealing proprietary client code is the holy grail of professional portfolios.", 
                duration: 5000, 
                background: "bg-gradient-to-br from-emerald-950 to-black" 
            }
        ],
        createdAt: "4 hours ago"
    }
];

const initialComments: Comment[] = [
    {
        id: "c-1",
        targetId: 1,
        authorName: "Pratyusha Sharma",
        authorHandle: "@pratyu",
        authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        content: "The clarity of the new card visual hierarchy makes a massive difference. Excited to test the role staking flow!",
        createdAt: "1 hour ago",
        likes: 4
    },
    {
        id: "c-2",
        targetId: 1,
        authorName: "Siddharth Dev",
        authorHandle: "@siddharth",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        content: "The Orbit Score breakdown is super transparent. Love that evidence can be submitted even when slightly below guidance.",
        createdAt: "30 mins ago",
        likes: 2
    }
];

const initialTasks: WorkspaceTask[] = [
    {
        id: "task-1",
        projectId: "loominn-rebuild",
        title: "Implement cryptographic handshake for state channel",
        description: "Verify JWT integrity and link session directly to encrypted workspace rooms.",
        status: "todo",
        assigneeName: "Rajayogi Nandina",
        priority: "high",
        createdAt: "1 day ago"
    },
    {
        id: "task-2",
        projectId: "loominn-rebuild",
        title: "Design responsive deck presentation view for mobile devices",
        description: "Optimize slide viewport scaling and touch gestures for presentation mode.",
        status: "progress",
        assigneeName: "Pratyusha Sharma",
        priority: "medium",
        createdAt: "2 days ago"
    },
    {
        id: "task-3",
        projectId: "loominn-rebuild",
        title: "Profile Turbopack memory footprint on Vercel deployment",
        description: "Benchmark build times and optimize module resolution rules.",
        status: "review",
        assigneeName: "Siddharth Dev",
        priority: "high",
        createdAt: "3 days ago"
    },
    {
        id: "task-4",
        projectId: "loominn-rebuild",
        title: "Publish Loominn Architecture Whitepaper v1.0",
        description: "Complete formal documentation and system boundary diagrams.",
        status: "done",
        assigneeName: "Rajayogi Nandina",
        priority: "medium",
        createdAt: "4 days ago"
    }
];

const initialApplications: ProjectApplication[] = [
    {
        id: "app-1",
        projectId: "loominn-rebuild",
        projectTitle: "Loominn Rebuild",
        roleTitle: "Lead Full Stack Architect",
        applicantId: "user-current",
        applicantName: "Rajayogi Nandina",
        applicantImage: "",
        applicantScore: 2000000,
        requiredScore: 5000,
        motivation: "Built the foundation of Loominn and eager to deliver the production-grade decentralized state pipeline.",
        evidence: ["https://github.com/nrajayogi/loominn"],
        status: "accepted",
        submittedAt: "2 days ago",
        feedback: "Accepted! Welcome as Lead Architect."
    },
    {
        id: "app-2",
        projectId: 901,
        projectTitle: "Quantum Ledger",
        roleTitle: "Security Protocol Auditor",
        applicantId: "user-current",
        applicantName: "Rajayogi Nandina",
        applicantImage: "",
        applicantScore: 2000000,
        requiredScore: 6000,
        motivation: "Extensive background with zero-trust key management and secure serverless verification.",
        evidence: ["https://github.com/nrajayogi/quantum-audit"],
        status: "reviewing",
        submittedAt: "Yesterday"
    }
];

const initialContributions: ContributionRecord[] = [
    {
        id: "contrib-1",
        userId: "user-current",
        projectId: "loominn-rebuild",
        projectTitle: "Loominn Rebuild",
        title: "Decentralized State Sync & Channel Architecture",
        type: "architecture",
        date: "Sep 8, 2026",
        complexity: "Expert",
        scoreDelta: 450,
        verifiedBy: "Elena Rostova",
        evidenceUrl: "https://github.com/nrajayogi/loominn/commit/73c452b"
    },
    {
        id: "contrib-2",
        userId: "user-current",
        projectId: "loominn-rebuild",
        projectTitle: "Loominn Rebuild",
        title: "Orbit Proof-of-Work Verification Engine",
        type: "code",
        date: "Sep 7, 2026",
        complexity: "Advanced",
        scoreDelta: 380,
        verifiedBy: "Siddharth Dev",
        evidenceUrl: "https://github.com/nrajayogi/loominn"
    },
    {
        id: "contrib-3",
        userId: "user-current",
        projectId: "loominn-rebuild",
        projectTitle: "Loominn Rebuild",
        title: "Multi-device Presentation Deck & Audio Infrastructure",
        type: "design",
        date: "Sep 4, 2026",
        complexity: "Intermediate",
        scoreDelta: 220,
        verifiedBy: "Pratyusha Sharma",
        evidenceUrl: "https://github.com/nrajayogi/loominn"
    }
];

const initialConnections: NetworkConnection[] = [
    {
        id: "conn-1",
        userId: "u-pratyusha",
        name: "Pratyusha Sharma",
        handle: "@pratyu",
        role: "Lead Product Designer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        tier: "partner",
        status: "connected",
        orbitScore: 3450,
        matchReason: "Shared craft in Figma, Next.js design systems, and Interaction Modeling",
        mutualProjects: ["Loominn Rebuild"],
        connectedAt: "2 weeks ago"
    },
    {
        id: "conn-2",
        userId: "u-siddharth",
        name: "Siddharth Dev",
        handle: "@siddharth",
        role: "Full Stack Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        tier: "colleague",
        status: "connected",
        orbitScore: 4200,
        matchReason: "High synergy across TypeScript, Rust, and System Performance",
        mutualProjects: ["Loominn Rebuild", "Quantum Ledger"],
        connectedAt: "1 month ago"
    },
    {
        id: "conn-3",
        userId: "u-elena",
        name: "Elena Rostova",
        handle: "@elena_r",
        role: "AI Systems Researcher",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        tier: "partner",
        status: "connected",
        orbitScore: 5600,
        matchReason: "Complementary strengths in Generative AI architectures and Web engineering",
        mutualProjects: ["Nebula AI"],
        connectedAt: "3 weeks ago"
    },
    {
        id: "conn-4",
        userId: "u-jahnavi",
        name: "Jahnavi Injam",
        handle: "@jahnavichinni2222",
        role: "Frontend Developer",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80",
        tier: "colleague",
        status: "request_received",
        orbitScore: 1850,
        matchReason: "Looking to collaborate on React and Tailwind components",
        mutualProjects: []
    }
];

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    // Core States
    const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [perspectives, setPerspectives] = useState<Perspective[]>(initialPerspectives);
    const [savedPosts, setSavedPosts] = useState<number[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [userProjects, setUserProjects] = useState<any[]>([]);

    // Extended Feature States
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [workspaceTasks, setWorkspaceTasks] = useState<WorkspaceTask[]>(initialTasks);
    const [applications, setApplications] = useState<ProjectApplication[]>(initialApplications);
    const [contributions, setContributions] = useState<ContributionRecord[]>(initialContributions);
    const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>(initialConnections);
    const [reportedItems, setReportedItems] = useState<any[]>([]);
    const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
    const [mutedUsers, setMutedUsers] = useState<string[]>([]);
    const [followingUsers, setFollowingUsers] = useState<string[]>(["u-pratyusha", "u-elena"]);
    const [followingTopics, setFollowingTopics] = useState<string[]>(["dist-sys", "zk-crypto", "ui-craft"]);

    // Hydrate from localStorage on mount (Client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedProfile = localStorage.getItem("loominn_profile");
                if (savedProfile) {
                    const parsed = JSON.parse(savedProfile);
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

                const storedProjects = localStorage.getItem("loominn_user_projects");
                if (storedProjects) setUserProjects(JSON.parse(storedProjects));

                const storedTasks = localStorage.getItem("loominn_workspace_tasks");
                if (storedTasks) setWorkspaceTasks(JSON.parse(storedTasks));

                const storedApps = localStorage.getItem("loominn_applications");
                if (storedApps) setApplications(JSON.parse(storedApps));

                const storedContribs = localStorage.getItem("loominn_contributions");
                if (storedContribs) setContributions(JSON.parse(storedContribs));

                const storedConnections = localStorage.getItem("loominn_connections");
                if (storedConnections) setNetworkConnections(JSON.parse(storedConnections));

                const storedBlocks = localStorage.getItem("loominn_blocked_users");
                if (storedBlocks) setBlockedUsers(JSON.parse(storedBlocks));

                const storedMutes = localStorage.getItem("loominn_muted_users");
                if (storedMutes) setMutedUsers(JSON.parse(storedMutes));

                const storedFollows = localStorage.getItem("loominn_following_users");
                if (storedFollows) setFollowingUsers(JSON.parse(storedFollows));

                const storedTopics = localStorage.getItem("loominn_following_topics");
                if (storedTopics) setFollowingTopics(JSON.parse(storedTopics));
            } catch (e) {
                console.error("Failed to hydrate global state:", e);
            }
        }
    }, []);

    // Session Sync
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
            if (typeof window !== 'undefined') {
                localStorage.setItem("loominn_profile", JSON.stringify(updated));
            }
            return updated;
        });
    };

    const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
        setPrivacySettings(prev => {
            const updated = { ...prev, ...settings };
            if (typeof window !== 'undefined') {
                localStorage.setItem("loominn_privacy", JSON.stringify(updated));
            }
            return updated;
        });
    };

    const addPost = (content: string, image?: string) => {
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
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_posts", JSON.stringify(updatedPosts));
        }
    };

    const deletePost = (id: number) => {
        const updated = posts.filter(p => p.id !== id);
        setPosts(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_posts", JSON.stringify(updated));
        }
    };

    const addPerspective = (perspective: Perspective) => {
        const newP = { ...perspective, id: perspective.id || `p-${Date.now()}` };
        const updated = [newP, ...perspectives];
        setPerspectives(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_perspectives", JSON.stringify(updated));
        }
        addNotification("Perspective Published", `Your perspective "${newP.title}" is now visible to the network.`);
    };

    const toggleLike = (id: number) => {
        const updatedPosts = posts.map(post =>
            post.id === id ? { ...post, likes: post.likes + 1 } : post
        );
        setPosts(updatedPosts);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_posts", JSON.stringify(updatedPosts));
        }
    };

    const toggleSave = (postId: number) => {
        setSavedPosts(prev => {
            const updated = prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId];
            if (typeof window !== 'undefined') {
                localStorage.setItem("loominn_saved_posts", JSON.stringify(updated));
            }
            return updated;
        });
    };

    const addNotification = (title: string, message: string, link?: string) => {
        const newNotif = { id: Date.now(), title, message, link, read: false, time: 'Just now' };
        setNotifications(prev => [newNotif, ...prev]);
    };

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
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_user_projects", JSON.stringify(updated));
        }
        addNotification("Project Created", `Project "${newProject.title}" has been created and is pending network review.`);
    };

    const toggleProjectLike = (id: number) => {
        const updated = userProjects.map(p =>
            p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p
        );
        setUserProjects(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_user_projects", JSON.stringify(updated));
        }
    };

    const commitToProject = (cost: number): boolean => {
        updateUserProfile({ stakedScore: (userProfile.stakedScore || 0) + cost });
        addNotification("Orbit Score Staked", `Successfully staked ${cost.toLocaleString()} points toward your application.`);
        return true;
    };

    const approveProject = (projectId: number) => {
        const updatedProjects = userProjects.map(p =>
            p.id === projectId ? { ...p, status: 'approved' } : p
        );
        setUserProjects(updatedProjects);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_user_projects", JSON.stringify(updatedProjects));
        }

        const project = userProjects.find(p => p.id === projectId);
        if (!project) return;

        const announcementPost: Post = {
            id: Date.now(),
            content: project.description,
            time: "Just now",
            likes: 0,
            comments: 0,
            shares: 0,
            projectData: project,
            roles: project.roles,
            author: userProfile.name,
            authorImage: userProfile.image
        };
        const updatedPosts = [announcementPost, ...posts];
        setPosts(updatedPosts);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_posts", JSON.stringify(updatedPosts));
        }

        addNotification("Project Approved", `Your project "${project.title}" has been approved and is now live on the network feed.`);
    };

    // --- Comments ---
    const addComment = (targetId: string | number, content: string, authorName?: string, authorImage?: string) => {
        const newComment: Comment = {
            id: `c-${Date.now()}`,
            targetId,
            content,
            authorName: authorName || userProfile.name,
            authorImage: authorImage || userProfile.image,
            createdAt: "Just now",
            likes: 0
        };
        setComments(prev => [newComment, ...prev]);
        addNotification("New Comment", `You commented on item #${targetId}`);
    };

    // --- Role Applications ---
    const applyToRole = (appData: Omit<ProjectApplication, "id" | "submittedAt" | "status">) => {
        const newApp: ProjectApplication = {
            ...appData,
            id: `app-${Date.now()}`,
            status: "submitted",
            submittedAt: "Just now"
        };
        const updated = [newApp, ...applications];
        setApplications(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_applications", JSON.stringify(updated));
        }
        addNotification("Application Submitted", `Application for ${newApp.roleTitle} at "${newApp.projectTitle}" submitted.`);
    };

    const reviewApplication = (applicationId: string, status: "accepted" | "declined", feedback?: string) => {
        const updated = applications.map(app => 
            app.id === applicationId ? { ...app, status, feedback } : app
        );
        setApplications(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_applications", JSON.stringify(updated));
        }

        const app = applications.find(a => a.id === applicationId);
        if (app) {
            addNotification(
                `Application ${status === 'accepted' ? 'Accepted' : 'Declined'}`, 
                `Applicant ${app.applicantName} for ${app.roleTitle} was ${status}.`,
                `/projects/${app.projectId}/board`
            );
        }
    };

    // --- Workspace Tasks ---
    const addTask = (taskData: Omit<WorkspaceTask, "id" | "createdAt">) => {
        const newTask: WorkspaceTask = {
            ...taskData,
            id: `task-${Date.now()}`,
            createdAt: "Just now"
        };
        const updated = [...workspaceTasks, newTask];
        setWorkspaceTasks(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_workspace_tasks", JSON.stringify(updated));
        }
        addNotification("Task Created", `Added task "${newTask.title}" to project workspace.`);
    };

    const moveTask = (taskId: string, newStatus: WorkspaceTask["status"]) => {
        const updated = workspaceTasks.map(t => 
            t.id === taskId ? { ...t, status: newStatus } : t
        );
        setWorkspaceTasks(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_workspace_tasks", JSON.stringify(updated));
        }

        if (newStatus === "done") {
            const task = workspaceTasks.find(t => t.id === taskId);
            if (task) {
                addContribution({
                    userId: "user-current",
                    projectId: task.projectId,
                    projectTitle: "Loominn Workspace",
                    title: task.title,
                    type: "milestone",
                    date: "Today",
                    complexity: task.priority === "high" ? "Advanced" : "Intermediate",
                    scoreDelta: task.priority === "high" ? 350 : 180,
                    verifiedBy: userProfile.name
                });
            }
        }
    };

    const deleteTask = (taskId: string) => {
        const updated = workspaceTasks.filter(t => t.id !== taskId);
        setWorkspaceTasks(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_workspace_tasks", JSON.stringify(updated));
        }
    };

    // --- Contributions Ledger ---
    const addContribution = (contributionData: Omit<ContributionRecord, "id">) => {
        const newContrib: ContributionRecord = {
            ...contributionData,
            id: `contrib-${Date.now()}`
        };
        const updated = [newContrib, ...contributions];
        setContributions(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_contributions", JSON.stringify(updated));
        }
        addNotification(
            "Proof of Work Verified", 
            `+${newContrib.scoreDelta} Orbit Score added for delivering "${newContrib.title}".`
        );
    };

    // --- Network Connections ---
    const sendConnectionRequest = (userId: string, tier: RelationshipTier) => {
        const existing = networkConnections.find(c => c.userId === userId);
        if (existing) {
            updateConnectionStatus(existing.id, "request_sent", tier);
        } else {
            const newConn: NetworkConnection = {
                id: `conn-${Date.now()}`,
                userId,
                name: userId.replace("u-", "").replace(/^\w/, c => c.toUpperCase()),
                handle: `@${userId.replace("u-", "")}`,
                role: "Domain Peer",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
                tier,
                status: "request_sent",
                orbitScore: 4000,
                connectedAt: "Just now"
            };
            const updated = [newConn, ...networkConnections];
            setNetworkConnections(updated);
            if (typeof window !== 'undefined') {
                localStorage.setItem("loominn_connections", JSON.stringify(updated));
            }
            addNotification("Request Sent", `Sent connection request as ${tier.toUpperCase()}.`);
        }
    };

    const updateConnectionStatus = (connectionId: string, status: ConnectionStatus, tier: RelationshipTier = "colleague") => {
        const updated = networkConnections.map(conn => 
            conn.id === connectionId ? { ...conn, status, tier } : conn
        );
        setNetworkConnections(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem("loominn_connections", JSON.stringify(updated));
        }
        const conn = networkConnections.find(c => c.id === connectionId);
        if (conn) {
            addNotification("Network Updated", `${conn.name} is now marked as ${status} (${tier}).`);
        }
    };

    // --- Moderation & Safety ---
    const reportItem = (targetId: string, targetType: string, reason: string) => {
        const newReport = {
            id: `rep-${Date.now()}`,
            targetId,
            targetType,
            reason,
            timestamp: new Date().toISOString()
        };
        setReportedItems(prev => [newReport, ...prev]);
        addNotification("Report Received", "Thank you for reporting. Our safety team will review this item within 24 hours.");
    };

    const toggleBlockUser = (userId: string) => {
        setBlockedUsers(prev => {
            const next = prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId];
            if (typeof window !== 'undefined') {
                localStorage.setItem("loominn_blocked_users", JSON.stringify(next));
            }
            return next;
        });
        addNotification("Safety Action", "User block settings updated.");
    };

    const toggleMuteUser = (userId: string) => {
        setMutedUsers(prev => {
            const next = prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId];
            if (typeof window !== 'undefined') {
                localStorage.setItem("loominn_muted_users", JSON.stringify(next));
            }
            return next;
        });
        addNotification("Safety Action", "User mute settings updated.");
    };

    const toggleFollowUser = (userId: string) => {
        setFollowingUsers(prev => {
            const isFollowing = prev.includes(userId);
            const next = isFollowing ? prev.filter(id => id !== userId) : [...prev, userId];
            if (typeof window !== 'undefined') {
                localStorage.setItem("loominn_following_users", JSON.stringify(next));
            }
            addNotification(
                isFollowing ? "Unfollowed" : "Following",
                isFollowing ? "You unfollowed this creator." : "You are now following this creator."
            );
            return next;
        });
    };

    const toggleFollowTopic = (topicId: string) => {
        setFollowingTopics(prev => {
            const isFollowing = prev.includes(topicId);
            const next = isFollowing ? prev.filter(id => id !== topicId) : [...prev, topicId];
            if (typeof window !== 'undefined') {
                localStorage.setItem("loominn_following_topics", JSON.stringify(next));
            }
            addNotification(
                isFollowing ? "Topic Unfollowed" : "Topic Followed",
                isFollowing ? "You will see fewer updates from this craft domain." : "You will now see more perspectives from this topic."
            );
            return next;
        });
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
            notifications, addNotification,

            // Extended platform state
            comments, addComment,
            applications, applyToRole, reviewApplication,
            workspaceTasks, addTask, moveTask, deleteTask,
            contributions, addContribution,
            networkConnections, sendConnectionRequest, updateConnectionStatus,
            reportedItems, reportItem,
            blockedUsers, toggleBlockUser,
            mutedUsers, toggleMuteUser,
            followingUsers, toggleFollowUser,
            followingTopics, toggleFollowTopic
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
