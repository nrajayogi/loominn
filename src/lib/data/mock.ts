import { UserProfile } from "@/lib/types/schema";

// Simulating a "Users" Table in a Database
export const MOCK_USERS_DB: UserProfile[] = [
    {
        id: "u-elena",
        name: "Elena R.",
        role: "AI Researcher",
        bio: "AI Researcher at DeepMind",
        company: "DeepMind",
        location: "London, UK",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        coverImage: "",
        skills: ["AI", "Machine Learning", "Python", "Research"],
        projects: ["DeepLearning", "Eco-Tracker"]
    },
    {
        id: "u-james",
        name: "James K.",
        role: "Product Design",
        bio: "Designer at Airbnb",
        company: "Airbnb",
        location: "San Francisco, CA",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
        coverImage: "",
        skills: ["UI/UX", "Design Systems", "Figma", "React"],
        projects: ["Loominn Rebuild", "Design System V2"]
    },
    {
        id: "u-sofia",
        name: "Sofia L.",
        role: "Frontend Dev",
        bio: "Frontend Dev at Vercel",
        company: "Vercel",
        location: "Remote",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
        coverImage: "",
        skills: ["React", "Next.js", "TypeScript", "Performance"],
        projects: ["Commerce V1"]
    },
    {
        id: "u-marcus",
        name: "Marcus T.",
        role: "CTO",
        bio: "CTO at StartUp",
        company: "StartUp",
        location: "Berlin, DE",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        coverImage: "",
        skills: ["Leadership", "Cloud Architecture", "Go", "AI"],
        projects: ["Startup Launch"]
    },
];

// --- Project Metadata Registry (Simulating a Projects Table) ---
export const PROJECT_REGISTRY: Record<string, { domain: string; industry: string }> = {
    // Elena's Projects
    "DeepLearning": { domain: "AI", industry: "Research" },
    "Eco-Tracker": { domain: "Mobile", industry: "Sustainability" },

    // James's Projects
    "Loominn Rebuild": { domain: "Web", industry: "SaaS" },
    "Design System V2": { domain: "Design", industry: "Tools" },

    // Sofia's Projects
    "Commerce V1": { domain: "Web", industry: "E-commerce" },

    // Marcus's Projects
    "Startup Launch": { domain: "Business", industry: "Startups" },
};
