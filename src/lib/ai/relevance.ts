import { UserProfile } from "@/lib/types/schema";

export interface RelevanceResult {
    score: number;       // Raw score
    percentage: string;  // Formatted "XX%"
    matches: {
        skills: string[];
        projects: string[];
    };
}

/**
 * Calculates the AI Relevance Score between a user and a potential partner.
 * 
 * Algorithm:
 * 1. Skill Matching: +15 points per shared skill.
 * 2. Project Synergy: +20 points per shared project.
 * 3. Base Score: Starts at 50.
 * 4. Normalization: Clamped between 40% (min) and 99% (max).
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
            matches: { skills: [], projects: [] }
        };
    }

    let score = 50; // Base affinity

    // 1. Skill Matching (High Impact)
    const userSkills = userProfile.skills || [];
    const sharedSkills = partnerProfile.skills.filter(s => userSkills.includes(s));
    score += sharedSkills.length * 15;

    // 2. Project Overlap (Very High Impact - "Contributions")
    const userProjects = userProfile.projects || [];
    const sharedProjects = partnerProfile.projects.filter(p => userProjects.includes(p));
    score += sharedProjects.length * 20;

    // 3. Normalization / Clamping
    if (score > 99) score = 99;
    if (score < 40) score = 40;

    return {
        score,
        percentage: `${score}%`,
        matches: {
            skills: sharedSkills,
            projects: sharedProjects
        }
    };
}
