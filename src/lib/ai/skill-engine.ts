/**
 * Orbit Skill Engine
 * 
 * This engine calculates a professional "Skill Score" (Orbit Score) based on three core engineering metrics.
 * This score serves as a "Proof of Work" verification for the platform.
 */

export interface SkillStats {
    /**
     * **Velocity** (Speed/Output)
     * Represents the quantity and frequency of contributions.
     * High velocity indicates an active, high-output engineer.
     * Normalized: 0-100 (but acts as a base multiplier).
     */
    velocity: number;

    /**
     * **Projects Completed** (Experience)
     * The total number of projects the engineer has successfully delivered.
     * This acts as a cumulative growth factor.
     */
    projectsCompleted: number;

    /**
     * **On-Time Completion** (Reliability)
     * The number of projects completed within the deadline.
     * Adds significant weight to the cumulative score.
     */
    onTimeCompletion: number;

    /**
     * **Complexity** (Depth/Difficulty)
     * Represents the technical difficulty of the work.
     * Factors include: dependency depth, algorithmic complexity, system architecture impact.
     * Normalized: 0-100 (Multiplier)
     */
    complexity: number;

    /**
     * **Risk** (Stability/Reliability)
     * Represents the potential for bugs or regressions.
     * We treat it as a denominator (inverse impact).
     * Range: 1 (Very Safe) - 10 (High Risk/Experimental)
     */
    risk: number;
}

export interface SkillScoreResult {
    raw: number;
    formatted: number; // Uncapped (e.g. 1250, 5000)
    label: string;     // Tier Label (e.g., "Grandmaster", "Architect")
    color: string;     // Color code for UI
}

/**
 * Calculates the dynamic Skill Score V2 (Cumulative).
 * Formula: ((Velocity + Projects + OnTime) * Complexity) / Risk
 * 
 * @param stats User's engineering stats
 * @returns Detailed score result
 */
export function calculateSkillScore(stats: SkillStats): SkillScoreResult {
    const { velocity, projectsCompleted, onTimeCompletion, complexity, risk } = stats;

    // Avoid division by zero
    const effectiveRisk = Math.max(risk, 1);

    // V2 Formula: Cumulative Growth
    // (Velocity + Projects + Deadline) * Complexity / Risk
    // Example: (80 + 15 + 12) * 85 / 2 = 107 * 85 / 2 = 9095 / 2 = 4547

    // We can weight "Projects" and "OnTime" to be more significant if they are just raw counts
    // Let's assume projectsCompleted is a raw count (e.g., 5, 20, 50)
    // We might want to give them more "points" per project.
    // Let's say 1 Project = 10 points. 
    // Modified Formula: (Velocity + (Projects * 10) + (OnTime * 5)) * Complexity / Risk

    const projectFactor = (projectsCompleted || 0) * 10;
    const deadlineFactor = (onTimeCompletion || 0) * 5;

    const basePower = velocity + projectFactor + deadlineFactor;

    const rawScore = Math.round((basePower * complexity) / effectiveRisk);

    // No normalization/capping. The score IS the score.
    const formatted = rawScore;

    // Tiering System (Adjusted for higher scale)
    // Novice: < 500
    // Contributor: 500 - 1500
    // Developer: 1500 - 3000
    // Senior: 3000 - 6000
    // Architect: 6000 - 10000
    // Grandmaster: 10000+

    let label = "Novice";
    let color = "text-zinc-500";

    if (formatted >= 10000) {
        label = "Grandmaster";
        color = "text-purple-400"; // Neon Purple
    } else if (formatted >= 6000) {
        label = "Architect";
        color = "text-amber-400"; // Gold
    } else if (formatted >= 3000) {
        label = "Senior";
        color = "text-blue-400"; // Neon Blue
    } else if (formatted >= 1500) {
        label = "Developer";
        color = "text-green-400"; // Neon Green
    } else if (formatted >= 500) {
        label = "Contributor";
        color = "text-cyan-400";
    }

    return {
        raw: rawScore,
        formatted,
        label,
        color
    };
}
