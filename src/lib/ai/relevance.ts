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
        trustScore?: number;
    };
}

function calculateTrustScore(stats: { velocity: number; complexity: number; risk: number }): number {
    // Formula: Velocity * Complexity / Risk (Metric / 200 for scale)
    // Adjusted log scale to keep it as a reasonable bonus (0-15)
    if (!stats) return 0;
    const { velocity, complexity, risk } = stats;
    // Base Calculation: (V * C) / R
    const formulaScore = (velocity * complexity) / (Math.max(risk, 1));
    // Log scaling: 0-15 points
    const bonus = Math.min(Math.floor(Math.log10(Math.max(formulaScore, 10)) * 5), 15);
    return bonus;
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
            breakdown: { skillScore: 15, projectScore: 20, domainScore: 10, trustScore: 10 }
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

    // 3. Domain Alignment (Bonus)
    // Get domains from user's projects to build an interest profile
    const userDomains = userProjects.map(p => PROJECT_REGISTRY[p]?.domain).filter(Boolean);
    const partnerDomains = partnerProfile.projects.map(p => PROJECT_REGISTRY[p]?.domain).filter(Boolean);

    // Find shared domains (intersection of arrays)
    const sharedDomains = partnerDomains.filter(d => userDomains.includes(d));
    // Unique shared domains to avoid double counting same domain multiple times if logic dictates, 
    // but here we reward per matching project's domain roughly:
    // Actually, let's just count how many of the partner's projects match the user's preferred domains.
    const matchingDomainProjects = partnerProfile.projects.filter(p => {
        const pDomain = PROJECT_REGISTRY[p]?.domain;
        return userDomains.includes(pDomain);
    });

    // 10 points per matching domain project?
    const domainScore = matchingDomainProjects.length * 10;
    score += domainScore;

    // 4. Trust Score (Verification Bonus)
    // Formula: Velocity * Complexity / Risk
    let trustScore = 0;
    if (partnerProfile.stats) {
        trustScore = calculateTrustScore(partnerProfile.stats);
        score += trustScore;
    }

    // 5. Normalization / Clamping
    if (score > 99) score = 99;
    if (score < 40) score = 40;

    return {
        score,
        percentage: `${score}%`,
        matches: {
            skills: sharedSkills,
            projects: sharedProjects,
            domains: matchingDomainProjects.map(p => PROJECT_REGISTRY[p]?.domain).filter(Boolean) as string[]
        },
        breakdown: {
            skillScore,
            projectScore,
            domainScore,
            trustScore
        }
    };
}
