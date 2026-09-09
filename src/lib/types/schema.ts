export type UUID = string;

// --- User Core ---

export interface UserProfile {
    id?: UUID; // Optional for local user, required for DB records
    name: string;
    handle?: string;
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
    authorRole?: string;
    tags?: string[];
    image?: string;
    // For Feed Integration
    projectData?: Project;
    roles?: Array<{ title: string; minScore: number }>;
}

// --- Settings ---

export interface PrivacySettings {
    locationTracking: boolean;
    allowDirectMessages?: boolean;
    showOrbitScore?: boolean;
    blockedUserIds?: string[];
    mutedUserIds?: string[];
}

// --- Comments & Reactions ---

export interface Comment {
    id: string;
    targetId: string | number;
    authorName: string;
    authorHandle?: string;
    authorImage?: string;
    content: string;
    createdAt: string;
    likes?: number;
}

// --- Polymorphic Feed System ---

export type FeedContentType = 
    | "post" 
    | "perspective" 
    | "project_opportunity" 
    | "contribution" 
    | "announcement";

export interface BaseFeedContent {
    id: string | number;
    type: FeedContentType;
    author: string;
    authorHandle?: string;
    authorImage?: string;
    authorRole?: string;
    time: string;
    likes: number;
    commentsCount: number;
    tags: string[];
    isSaved?: boolean;
    isLiked?: boolean;
}

export interface PostFeedContent extends BaseFeedContent {
    type: "post";
    content: string;
    image?: string;
}

export interface PerspectiveFeedContent extends BaseFeedContent {
    type: "perspective";
    perspectiveId: string;
    title: string;
    summary: string;
    status: PerspectiveStatus;
    itemsCount: number;
    previewItem?: PerspectiveItem;
    category?: string;
    perspective?: Perspective;
}

export interface ProjectOpportunityFeedContent extends BaseFeedContent {
    type: "project_opportunity";
    projectId: string | number;
    title: string;
    description: string;
    category: string;
    difficulty: "beginner" | "intermediate" | "advanced" | "expert";
    roles: Array<{ title: string; minScore: number; filled?: boolean }>;
    bannerGradient?: string;
    membersCount?: number;
}

export interface ContributionFeedContent extends BaseFeedContent {
    type: "contribution";
    projectId: string | number;
    projectTitle: string;
    contributionType: "code" | "design" | "architecture" | "milestone";
    milestoneTitle: string;
    summary: string;
    scoreDelta: number;
    verifiedBy: string;
    evidenceUrl?: string;
}

export interface AnnouncementFeedContent extends BaseFeedContent {
    type: "announcement";
    title: string;
    content: string;
    badge?: string;
    linkUrl?: string;
    linkLabel?: string;
}

export type AnyFeedItem = 
    | PostFeedContent 
    | PerspectiveFeedContent 
    | ProjectOpportunityFeedContent 
    | ContributionFeedContent 
    | AnnouncementFeedContent;

// --- Network & Relationships ---

export type RelationshipTier = "partner" | "colleague" | "ally";

export type ConnectionStatus = 
    | "suggested" 
    | "request_sent" 
    | "request_received" 
    | "connected" 
    | "declined" 
    | "muted" 
    | "blocked";

export interface NetworkConnection {
    id: string;
    userId: string;
    name: string;
    handle: string;
    role: string;
    avatar: string;
    tier: RelationshipTier;
    status: ConnectionStatus;
    orbitScore: number;
    matchReason?: string;
    mutualProjects?: string[];
    connectedAt?: string;
}

// --- Project Workspaces & Applications ---

export interface ProjectApplication {
    id: string;
    projectId: string | number;
    projectTitle: string;
    roleTitle: string;
    applicantId: string;
    applicantName: string;
    applicantImage?: string;
    applicantScore: number;
    requiredScore: number;
    motivation: string;
    evidence?: string[];
    status: "submitted" | "reviewing" | "accepted" | "declined";
    submittedAt: string;
    feedback?: string;
}

export interface WorkspaceTask {
    id: string;
    projectId: string | number;
    title: string;
    description?: string;
    status: "todo" | "progress" | "review" | "done";
    assigneeName?: string;
    assigneeImage?: string;
    priority: "low" | "medium" | "high";
    createdAt: string;
    evidenceUrl?: string;
    peerReviewer?: string;
    acknowledgement?: string;
    scoreDelta?: number;
}

export interface ProjectMember {
    id: string;
    name: string;
    role: string;
    handle: string;
    avatar?: string;
    orbitScore: number;
    joinedAt: string;
    tier: RelationshipTier;
}

export interface ProjectChannelMessage {
    id: string;
    projectId: string;
    authorName: string;
    authorHandle: string;
    authorAvatar?: string;
    content: string;
    timestamp: string;
    type?: "message" | "milestone_announcement";
}

export interface ContributionRecord {
    id: string;
    userId: string;
    projectId: string | number;
    projectTitle: string;
    title: string;
    type: "code" | "design" | "architecture" | "milestone";
    date: string;
    complexity: string;
    scoreDelta: number;
    verifiedBy: string;
    evidenceUrl?: string;
    acknowledgement?: string;
}


