# AI Relevance Algorithm Technical Report

## Overview

The **Loominn AI Relevance Engine** is designed to foster meaningful professional connections ("Orbital Resonance") by analyzing the compatibility between users. Unlike traditional social graphs that rely on mutual friends, our algorithm calculates resonance based on shared competencies and collaborative history.

## Architecture

The logic resides in `src/lib/ai/relevance.ts` and is purely deterministic in its current iteration, ensuring transparency and predictability.

### Inputs

The algorithm accepts two primary data structures:

1. **Active User Profile**: The currently logged-in professional.
2. **Target Partner Profile**: The candidate being evaluated for the "Orbit Discovery" feed.

Both profiles must contain:

* `skills`: Array of strings (e.g., `["React", "AI", "Design Systems"]`).
* `projects`: Array of strings representing contributions (e.g., `["Eco-Tracker", "Loominn Rebuild"]`).

## The Algorithm

The core function `calculateRelevanceScore` computes a weighted affinity score.

### 1. Base Resonance

* **Base Score**: `50`
* *Rationale*: We assume a baseline level of professional courtesy and potential interest for all community members.

### 2. Weighting Factors

The algorithm prioritizes actionable collaboration over theoretical knowledge.

| Factor | Weight | Description |
| :--- | :--- | :--- |
| **Skill Match** | `+15 pts` | Per shared skill. Indicates shared technical language and capabilities. |
| **Project Contributions** | `+20 pts` | Per shared project. Indicates proven ability to work together on specific initiatives. |

### 3. Processing Logic

```typescript
let score = 50;
score += (sharedskills_count * 15);
score += (shared_projects_count * 20);
```

### 4. Normalization

To present a user-friendly metric:

* **Ceiling**: Scores are capped at `99%`. (Perfection is asymptotic).
* **Floor**: Scores are floored at `40%`. (Prevent discouragingly low matches).

## Future ML Roadmap

As the dataset grows, we plan to evolve this heuristic into a localized Machine Learning model:

1. **Vector Embeddings**: Replace exact string matching with semantic vector space (e.g., "React" and "Vue" are close neighbors).
2. **Collaborative Filtering**: Suggest partners based on who similar users have connected with.
3. **Interaction Feedback Loop**: Adjust weights based on successful "Partner" requests (e.g., if users ignore "Skill" matches but click "Project" matches, increase Project weight).
