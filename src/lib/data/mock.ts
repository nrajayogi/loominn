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
        projects: ["DeepLearning", "Eco-Tracker"],
        stats: { velocity: 85, projectsCompleted: 42, onTimeCompletion: 38, complexity: 92, risk: 2 } // High performer, low risk
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
        projects: ["Loominn Rebuild", "Design System V2"],
        stats: { velocity: 78, projectsCompleted: 15, onTimeCompletion: 12, complexity: 65, risk: 3 } // Solid output, moderate complexity
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
        projects: ["Commerce V1"],
        stats: { velocity: 95, projectsCompleted: 8, onTimeCompletion: 8, complexity: 50, risk: 5 } // High speed, average complexity, moderate risk
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
        projects: ["Startup Launch"],
        stats: { velocity: 60, projectsCompleted: 120, onTimeCompletion: 110, complexity: 88, risk: 1 } // Careful, high complexity, very low risk
    },
];

// --- Project Metadata Registry (Simulating a Projects Table) ---
export const PROJECT_REGISTRY: Record<string, { domain: string; industry: string; roles?: Array<{ title: string; minScore: number }> }> = {
    // Elena's Projects
    "DeepLearning": {
        domain: "AI",
        industry: "Research",
        roles: [
            { title: "Senior AI Researcher", minScore: 8000 },
            { title: "Data Scientist", minScore: 4000 }
        ]
    },
    "Eco-Tracker": {
        domain: "Mobile",
        industry: "Sustainability",
        roles: [
            { title: "Mobile Lead", minScore: 5000 },
            { title: "UI Designer", minScore: 2000 }
        ]
    },

    // James's Projects
    "Loominn Rebuild": {
        domain: "Web",
        industry: "SaaS",
        roles: [
            { title: "Frontend Architect", minScore: 6500 },
            { title: "React Developer", minScore: 2500 },
            { title: "UI Designer", minScore: 1500 }
        ]
    },
    "Design System V2": {
        domain: "Design",
        industry: "Tools",
        roles: [
            { title: "Design System Lead", minScore: 6000 },
            { title: "Iconographer", minScore: 1000 }
        ]
    },

    // Sofia's Projects
    "Commerce V1": {
        domain: "Web",
        industry: "E-commerce",
        roles: [
            { title: "FullStack Engineer", minScore: 3500 },
            { title: "QA Engineer", minScore: 1000 }
        ]
    },

    // Marcus's Projects
    "Startup Launch": {
        domain: "Business",
        industry: "Startups",
        roles: [
            { title: "Co-Founder (Tech)", minScore: 9000 },
            { title: "Growth Hacker", minScore: 2500 }
        ]
    },
};
