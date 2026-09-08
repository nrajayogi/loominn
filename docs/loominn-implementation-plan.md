# Loominn Comprehensive Implementation Plan

## 1. Executive Summary & Current State Audit

### 1.1 Architectural Evaluation
The Loominn codebase is built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, and NextAuth with Prisma.
The concept combines an ambient dark visual aesthetic with novel concepts like **Orbit Score**, **Perspectives (StoriesRail)**, **SuggestionNet**, and **Collaborative Workspaces**.

However, an audit reveals several crucial gaps that separate the prototype from a fully realized, work-centered social network:
1. **Authentication Dual-System Conflict**: A legacy, disconnected `AuthContext.tsx` with mock `loominn_user` exists alongside standard `next-auth/react` and `src/security/auth.ts`. We must standardize completely on NextAuth.
2. **Homogeneous Feed Rendering**: All feed items (posts, announcements, launch announcements) were previously coerced into `ProjectCard`, distorting ordinary social posts and perspectives into mock projects.
3. **Discover vs. Social Duplication**: `/discover` and `/social` currently exist as two disconnected, half-finished pages. They must be unified into a cohesive discovery experience with 5 dedicated tabs (`For You`, `People`, `Projects`, `Perspectives`, `Topics`).
4. **Placeholder Screens**: `/messages` was an 11-line placeholder; `/projects/[id]/board` lacked interactive task manipulation; and role application flow lacked clear transparent explanation for when a user's Orbit Score is below target.
5. **Perspectives Isolation**: Perspectives existed solely in `StoriesRail` and could not be created from the Create studio or commented on/saved as discrete work items in the feed.
6. **Orbit Score Transparency**: Orbit Score was previously presented as an unyielding gate without showing the calculation breakdown, why a candidate does or does not qualify, or how to submit custom proof-of-work evidence.

---

## 2. Intended State & Architecture Decisions

### 2.1 Technical Architecture Decisions
1. **Unified NextAuth Pipeline**:
   - Deprecate `AuthContext.tsx` in favor of standard NextAuth `useSession()` and `signIn()` / `signOut()`.
   - Provide an automated, interactive Onboarding modal/flow when a user signs in for the first time without configured goals/skills.
2. **Polymorphic Feed & Card Hierarchy**:
   - Create distinct, dedicated card components:
     - `PostCard.tsx`: For personal technical reflections, queries, and quick links.
     - `PerspectiveCard.tsx`: For deep-dive work, visual prototypes, and research logs with direct launcher into the Perspective viewer.
     - `ProjectOpportunityCard.tsx`: For projects actively recruiting with clear role requirements and Orbit guidance.
     - `ContributionCard.tsx`: For verified completed tasks, milestone achievements, and peer endorsements.
     - `AnnouncementCard.tsx`: For official platform and system announcements.
3. **Unified Discovery Experience (`/discover`)**:
   - Consolidate `/discover` and `/social` into a tabbed discovery engine.
   - Redirect `/social` to `/discover?tab=people`.
   - Implement transparent, explainable recommendations in `SuggestionNet` (e.g. *"Recommended because you both work with Next.js and System Architecture"*).
4. **Interactive Perspective Viewer**:
   - Enhance the viewer with slide navigation, pause/resume, technical metadata, inline comment drawer, and bookmarking.
   - Allow Perspectives to be drafted and published from `/projects/create` and `/create`.
5. **Robust Workspace & Application Pipeline**:
   - Enhance `CommitModal.tsx` to handle both direct staking (for eligible candidates) and custom evidence submissions with explanations for candidates below threshold.
   - Enable interactive task creation and status changes on `/projects/[id]/board`.
   - Enable applicant review on `/projects/[id]/members` where the project owner can accept or decline candidates with feedback.
   - Accepted applicants gain entry to the project workspace and appear in the project roster.
6. **Real-time Simulated & Persisted Messaging**:
   - Transform `/messages` from a placeholder into a responsive split-pane messenger connected to network contacts and project members.
7. **Transparent Orbit Score Explanation**:
   - Provide a dedicated explanation modal and profile view breaking down the formula:
     $$\text{Score} = \frac{(\text{Velocity} + 10 \times \text{Projects} + 5 \times \text{OnTime}) \times \text{Complexity}}{\text{Risk}}$$
   - Show how users can increase their score through verified contributions.

---

## 3. Detailed Phase-by-Phase Implementation Plan

### Phase 1: Foundations & Core Data Contracts
- **Clean Up Auth Architecture**:
  - Remove dead `AuthContext.tsx` and ensure all components consume `useSession()` and `useGlobalState()`.
  - Add comprehensive types in `src/lib/types/schema.ts` for all feed items, comments, reactions, applications, tasks, and contributions.
- **Card System Foundation**:
  - Implement `PostCard`, `PerspectiveCard`, `ProjectOpportunityCard`, `ContributionCard`, and `AnnouncementCard` in `src/components/feed/`.
  - Implement shared `ReactionButton.tsx`, `CommentDrawer.tsx`, and `ShareModal.tsx`.

### Phase 2: Social Experience & Perspectives
- **Refactor Network Feed (`/feed`)**:
  - Update `src/app/(dashboard)/feed/page.tsx` to render diverse card types dynamically.
  - Wire real reaction counts, comments, and bookmark states to global state.
- **Elevate Perspectives (`StoriesRail.tsx` & Viewer)**:
  - Add inline comment support and slide indexing.
  - Allow Perspective creation from `/create` and `/projects/create`.
- **Unify Discover & Social (`/discover`)**:
  - Build the unified multi-tab Discover page with `For You`, `People`, `Projects`, `Perspectives`, and `Topics`.
  - Make `/social` redirect seamlessly to `/discover?tab=people`.
  - Add explainable recommendation cards in `SuggestionNet`.

### Phase 3: Network, Profiles & Communication
- **Network Overview (`/network`)**:
  - Implement distinct filters: `Partners`, `Colleagues`, `Allies`, and `Pending Requests`.
  - Add actions to accept, decline, connect, or change relationship tier.
- **Full Messaging Experience (`/messages`)**:
  - Replace the 11-line placeholder with a full-featured messenger supporting conversations, message sending, and attachment previews.
- **Channels (`/channels`)**:
  - Connect project channels directly with project workspaces.
- **Creator Profiles (`/profile` & `/profile/[username]`)**:
  - Render creator Orbit score breakdown, active projects, perspectives, and verified contributions ledger.

### Phase 4: Projects & Collaborative Workspaces
- **Project Marketplace (`/projects`)**:
  - Display project cards with role slots, score requirements, and application status.
- **Role Application & Staking (`CommitModal.tsx` & `/projects/status`)**:
  - Show transparent explanation when below score threshold.
  - Allow submitting evidence and motivation.
  - Track live application status in `/projects/status`.
- **Project Workspace (`/projects/[id]`, `/board`, `/timeline`, `/members`)**:
  - Implement interactive task board where tasks can be added, moved across columns, and marked done.
  - Enable applicant management in `/members` where owners can accept/decline applicants.
  - When an applicant is accepted, add them to project members and create a verified contribution opportunity.

### Phase 5: Safety, Polish & Production Verification
- **Safety & Moderation Flows**:
  - Add Report, Mute, and Block modal actions on all cards and profiles.
  - Add Blocked & Muted user management inside `/settings`.
- **Onboarding Modal**:
  - Add onboarding prompt for new accounts to pick goals, skills, and availability.
- **Quality Assurance**:
  - Run `npx tsc --noEmit` and verify zero errors.
  - Run `npm run build` and ensure clean production generation of all routes.
  - Perform end-to-end verification of user flows.

---

## 4. Acceptance Criteria Checklist

- [ ] New user can sign up, complete onboarding goals/skills, and land on a personalized feed.
- [ ] Feed displays distinct visual treatments for Posts, Perspectives, Project Opportunities, Contributions, and Announcements.
- [ ] Perspectives can be created from Create Studio, viewed in an immersive viewer, and commented on.
- [ ] Orbit Discovery provides clear explanations for why each person or project is recommended.
- [ ] Users can manage Partners, Colleagues, and Allies with clear status transitions.
- [ ] Messages is a fully functional split-pane conversation interface instead of a placeholder.
- [ ] Project roles feature transparent Orbit Score explanations and allow evidence submission if below threshold.
- [ ] Project owners can review and accept applicants, granting them workspace access.
- [ ] Project workspaces feature an interactive task board with moving and completing tasks.
- [ ] Completed work feeds into the user's verified contribution history.
- [ ] Safety actions (report, mute, block) are accessible with management in Settings.
- [ ] Discover and Social are unified without duplicate routes.
- [ ] All code builds cleanly with zero TypeScript or Next.js build errors.
