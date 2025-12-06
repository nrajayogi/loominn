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
}

// --- Content: Perspectives ---

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

export interface Post {
    id: number; // Keeping number for backward compat with existing mock data, eventually convert to UUID
    userId?: UUID;
    content: string;
    time: string;
    likes: number;
    comments: number;
    shares: number;
}

// --- Settings ---

export interface PrivacySettings {
    locationTracking: boolean;
}
