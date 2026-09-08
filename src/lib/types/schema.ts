export type UUID = string;

// --- User Core ---

export interface UserProfile {
    id?: UUID; // Optional for local user, required for DB records
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
    skills: string[];
    projects: string[];
    email?: string;

    // Derived/Joined Data (for UI convenience)
    company?: string;
    role?: string;
    accountOrigin?: string; // Immutable, set at creation
    vResume?: string; // Video Resume URL

    // Algorithm Stats (For Trust Score)
    stats?: {
        velocity: number;   // 0-100 (Commits/week normalized)
        projectsCompleted: number; // Total count
        onTimeCompletion: number;  // Total count within deadline
        complexity: number; // 0-100 (Code graph density)
        risk: number;       // 1-10 (Bug rate, lower is better, but here inversely mapped or used as divisor)
    };
    stakedScore?: number; // Total score currently staked in active projects
}

// --- Content: Perspectives ---

export const DEFAULT_NEW_USER_STATS = {
    velocity: 20,
    projectsCompleted: 0,
    onTimeCompletion: 0,
    complexity: 25,
    risk: 1
}; // Results in 500 Orbit Score

export type PerspectiveStatus = "Perspective" | "In Progress" | "Planning";
export type PerspectiveItemType = "text" | "image";

export interface PerspectiveItem {
    id: UUID;
    type: PerspectiveItemType;
    content?: string;
    url?: string;
    caption?: string;
    background?: string;
    duration: number; // in milliseconds
}

export interface Perspective {
    id: UUID;
    userId: UUID | "u-current";
    userName: string; // Denormalized for display
    role: string;     // Denormalized for display
    userImage: string; // Denormalized for display
    title: string;
    location?: string; // Snapshot of location at creation
    status: PerspectiveStatus;
    items: PerspectiveItem[];
    createdAt?: string;
}

// --- Content: Feed ---

export interface Project {
    id: UUID | number;
    title: string;
    description: string;
    category: string;
    roles: Array<{ title: string; minScore: number }>;
    status: "submitted" | "approved" | "rejected";
    submittedAt: string;
    slides?: Array<{ url: string }>;
    image?: string;
}

export interface Post {
    id: number; // Keeping number for backward compat with existing mock data, eventually convert to UUID
    userId?: UUID;
    author?: string; // Denormalized author name
    authorImage?: string; // Denormalized author image
    content: string;
    time: string;
    likes: number;
    comments: number;
    shares: number;
    // For Feed Integration
    projectData?: Project;
    roles?: Array<{ title: string; minScore: number }>;
}

// --- Settings ---

export interface PrivacySettings {
    locationTracking: boolean;
}
