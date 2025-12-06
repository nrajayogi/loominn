import { PROJECT_REGISTRY } from "@/lib/data/mock";
import { UserProfile } from "@/lib/types/schema";

export interface RelevanceResult {
    score: number;       // Raw score
    percentage: string;  // Formatted "XX%"
    matches: {
        skills: string[];
        projects: string[];
        domains: string[]; // [NEW] Matched domains
    };
    breakdown: {        // [NEW] Score components for tooltip
        skillScore: number;
        projectScore: number;
        domainScore: number;
    };
}

/**
 * Calculates the AI Relevance Score between a user and a potential partner.
 * 
 * Algorithm V2:
 * 1. Skill Matching: +15 points per shared skill.
 * 2. Project Synergy: +20 points per shared project.
 * 3. Domain Alignment: +10 points per project in matching high-value domains.
 * 4. Base Score: Starts at 50.
 * 5. Normalization: Clamped between 40% (min) and 99% (max).
 * 
 * @param userProfile The active user's profile with skills and projects.
 * @param partnerProfile The potential partner to score against.
 * @returns Object containing score, formatted percentage, and matched items.
 */
export function calculateRelevanceScore(
    userProfile: UserProfile | null,
    partnerProfile: UserProfile
): RelevanceResult {
    // Default fallback if no user profile is loaded
    if (!userProfile) {
        return {
            score: 85,
            percentage: "85%",
            matches: { skills: [], projects: [], domains: [] },
            breakdown: { skillScore: 45, projectScore: 20, domainScore: 20 }
        };
    }

    let score = 50; // Base affinity

    // 1. Skill Matching (High Impact)
    const userSkills = userProfile.skills || [];
    const sharedSkills = partnerProfile.skills.filter(s => userSkills.includes(s));
    const skillScore = sharedSkills.length * 15;
    score += skillScore;

    // 2. Project Overlap (Very High Impact - "Contributions")
    const userProjects = userProfile.projects || [];
    const sharedProjects = partnerProfile.projects.filter(p => userProjects.includes(p));
    const projectScore = sharedProjects.length * 20;
    score += projectScore;

    // 3. Domain Alignment (New Factor)
    // Identify User's "Top Domains"
    const userDomains = new Set<string>();
    userProjects.forEach(p => {
        const meta = PROJECT_REGISTRY[p];
        if (meta) userDomains.add(meta.domain);
    });

    let domainScore = 0;
    const matchedDomains: string[] = [];

    // Check if Partner's projects fall into User's Top Domains
    partnerProfile.projects.forEach(p => {
        const meta = PROJECT_REGISTRY[p];
        if (meta && userDomains.has(meta.domain)) {
            // Bonus for working in a relevant domain
            domainScore += 10;
            if (!matchedDomains.includes(meta.domain)) {
                matchedDomains.push(meta.domain);
            }
        }
    });
    score += domainScore;

    // 4. Normalization / Clamping
    if (score > 99) score = 99;
    if (score < 40) score = 40;

    return {
        score,
        percentage: `${score}%`,
        matches: {
            skills: sharedSkills,
            projects: sharedProjects,
            domains: matchedDomains
        },
        breakdown: {
            skillScore,
            projectScore,
            domainScore
        }
    };
}
