import {
    Shield,
    TrendingUp,
    Globe,
    Zap,
    Video,
    Code,
    Rocket,
    Users,
    Layers,
    Building2,
    Landmark,
    Briefcase,
    LineChart
} from "lucide-react";

export type SlideType = 'hero' | 'standard' | 'feature' | 'founders' | 'skill-score' | 'match-score';

export interface SlideData {
    id: number;
    title: string;
    subtitle: string;
    tagline?: string;
    content?: string[];
    quote?: string;
    type: SlideType;
    icon?: React.ElementType;
    image?: string;
    accent?: string;
    bgGradient?: string;
    citation?: string;
    citationLink?: string;
    // Founder specific
    founder1?: { name: string; role: string; videoSrc?: string; image?: string };
    founder2?: { name: string; role: string; videoSrc?: string; image?: string };
}

export const DECK_VARIANTS: Record<string, SlideData[]> = {
    standard: [
        {
            id: 1,
            title: "LOOMINN",
            subtitle: "The Future of Meritocratic Talent",
            tagline: "Don't tell us what you did. Show us what you built.",
            type: "hero",
            bgGradient: "from-blue-950 via-black to-black"
        },
        {
            id: 2,
            title: "The Problem",
            subtitle: "The Resume Trust Crisis",
            content: [
                "Static & Verify-Last: Resumes are text claims, not proof.",
                "Signal-to-Noise: 80% of hiring time is filtering.",
                "Credential Wall: Talent hidden behind missing keywords."
            ],
            quote: "\"The resume looks great, but they can't code.\" — Every Hiring Manager",
            type: "standard",
            icon: Shield,
            accent: "text-red-400",
            citation: "Kline, P., Rose, E., & Walters, C. (2021). Systemic Discrimination Among Large U.S. Employers. NBER Working Paper No. 29053.",
            citationLink: "https://www.nber.org/papers/w29053"
        },
        {
            id: 3,
            title: "The Cost",
            subtitle: "The 'HR Infrastructure' Black Hole",
            content: [
                "Bloated Tech Stack: Expensive ATS & Screening tools.",
                "Human Cost: Thousands of hours on screening.",
                "Turnover Tax: Bad hires cost 30% of annual salary."
            ],
            type: "standard",
            icon: TrendingUp,
            accent: "text-orange-400",
            citation: "U.S. Department of Labor. (2023). Cost of a Bad Hire Report. Estimated at 30% of employee's first-year earnings.",
            citationLink: "https://www.dol.gov"
        },
        {
            id: 4,
            title: "The Bias",
            subtitle: "The Opportunity Gap",
            content: [
                "Geography ≠ Destiny: Remote talent is often invisible.",
                "Paper Bias: Prestige over Output.",
                "Upskilling Disconnect: Talent guesses what to learn."
            ],
            type: "standard",
            icon: Globe,
            accent: "text-yellow-400",
            citation: "Bloom, N., et al. (2023). Hybrid Working From Home Works Out. NBER Working Paper; Nature (Trip.com study).",
            citationLink: "https://www.nature.com/articles/s41586-024-07500-2"
        },
        {
            id: 5,
            title: "The Solution",
            subtitle: "Loominn: Verified Talent Protocol",
            content: [
                "Proof-of-Work: Output defines rank, not claims.",
                "Holistic Profile: vResume (Soft) + Commits (Hard).",
                "Trust-First: Verification happens BEFORE you see them."
            ],
            type: "standard",
            icon: Zap,
            accent: "text-blue-400"
        },
        {
            id: 6,
            title: "vResume",
            subtitle: "Decentralizing Personality",
            content: [
                "Dynamic Video Intro: Soft skills & passion on display.",
                "Gut Check: Assess fit in 30 seconds.",
                "Bypass Bias: Speak directly to decision makers."
            ],
            type: "feature",
            icon: Video,
            image: "vResume",
            accent: "text-purple-400"
        },
        {
            id: 7,
            title: "Commit Ledger",
            subtitle: "The New Currency of Hiring",
            content: [
                "Metric: Projects Shipped > Years of Experience.",
                "Verification: Collaborative history is tracked.",
                "Meritocracy: You can't inflate a commit ledger."
            ],
            type: "feature",
            icon: Code,
            image: "Ledger",
            accent: "text-green-400"
        },
        {
            id: 8,
            title: "Orbit Engine",
            subtitle: "AI-Driven Discovery",
            tagline: "Algorithmic Relevance Calculation",
            content: [
                "Skills: +15pts (Verified Capability)",
                "Projects: +20pts (Proven Output)",
                "Domain: +10pts (Contextual Fit)"
            ],
            type: "match-score",
            icon: Rocket,
            image: "Orbit",
            accent: "text-cyan-400"
        },
        {
            id: 9,
            title: "Business Value",
            subtitle: "Reducing Infrastructure Costs",
            content: [
                "Slash Screening: Loominn acts as the primary filter.",
                "Lean HR: Enterprise-grade scouting for startups.",
                "Pay-for-Performance: Secure talent, don't just post ads."
            ],
            type: "standard",
            icon: TrendingUp,
            accent: "text-emerald-400"
        },
        {
            id: 10,
            title: "Social Impact",
            subtitle: "Equal Opportunity",
            content: [
                "Blind Evaluation: Code has no gender or geography.",
                "The Great Equalizer: Output over Ivy League degrees.",
                "Global Access: A stage for anyone who builds."
            ],
            type: "standard",
            icon: Users,
            accent: "text-pink-400"
        },
        {
            id: 11,
            title: "Market Validation",
            subtitle: "Why Now?",
            content: [
                "Gig Economy: Shift to Project-Based work.",
                "Remote Trust: Geography is irrelevant, trust is key.",
                "AI Disruption: Human judgment & shipping is premium."
            ],
            type: "standard",
            icon: Layers,
            accent: "text-indigo-400",
            citation: "World Economic Forum. (2025). The Future of Jobs Report 2025. Skill gaps cited as top barrier to transformation.",
            citationLink: "https://www.weforum.org/publications/the-future-of-jobs-report-2023/"
        },
        {
            id: 15,
            title: "Trust Through Verification",
            subtitle: "The Risk-Adjusted Skill Score",
            tagline: "Quantifying engineering excellence through algorithmic verification.",
            type: "skill-score",
            content: [
                "Eliminates need for technical screening calls.",
                "Predictable engineering velocity from Day 1.",
                "De-risked hiring through verified history."
            ],
            bgGradient: "from-blue-900/40 via-black to-black"
        },
        {
            id: 12,
            title: "Meet the Builders",
            subtitle: "Fusing Vision with Execution",
            tagline: "Building the infrastructure for the next generation of work.",
            type: "founders",
            founder1: { name: "Alex Chen", role: "CEO & Product Vision", image: "/founders/alex.jpg", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
            founder2: { name: "Sarah Jones", role: "CTO & Architecture", image: "/founders/sarah.jpg", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
            bgGradient: "from-zinc-900 via-zinc-900 to-black"
        },
        {
            id: 13,
            title: "The Roadmap",
            subtitle: "Q1-Q4 2025",
            content: [
                "Q1: Beta Launch with 50 Partner Companies.",
                "Q2: Integrate Orbit Engine v2.",
                "Q3: Global Expansion to APAC & EMEA."
            ],
            type: "standard",
            icon: Layers,
            accent: "text-purple-400"
        },
        {
            id: 14,
            title: "The Vision",
            subtitle: "Building the Standard",
            content: [
                "Vision: 'Loominn Verified' as the global credential.",
                "Ask: Join us in building the infrastructure.",
                "Investment: Scaling the Orbit Engine."
            ],
            type: "hero",
            bgGradient: "from-indigo-950 via-purple-950 to-black"
        }
    ],
    company: [
        {
            id: 1,
            title: "LOOMINN",
            subtitle: "Enterprise Talent Infrastructure",
            tagline: "Precision Hiring. Zero Noise. Verified Output.",
            type: "hero",
            bgGradient: "from-slate-900 via-zinc-900 to-black"
        },
        {
            id: 2,
            title: "The Enterprise Drain",
            subtitle: "The High Cost of Uncertainty",
            content: [
                "Financial Leakage: Bad hires cost 30% of annual salary.",
                "Time Sink: 42 days average time-to-fill for tech roles.",
                "Ghost Hours: Senior engineers waste weeks interviewing unverified candidates."
            ],
            type: "standard",
            icon: Briefcase,
            accent: "text-red-400",
            citation: "U.S. Department of Labor. (2023). Cost of a Bad Hire Report.",
            citationLink: "https://www.dol.gov"
        },
        {
            id: 3,
            title: "The Solution",
            subtitle: "Verify-First Protocol",
            content: [
                "Invert the Funnel: Verify skills BEFORE the interview.",
                "Algorithmic Match: 95% reduction in screening time.",
                "Risk Mitigation: 'Commit Ledger' proves technical capability."
            ],
            type: "standard",
            icon: Shield,
            accent: "text-blue-400"
        },
        {
            id: 4,
            title: "vResume",
            subtitle: "Cultural De-Risking",
            content: [
                "Efficiency: Evaluate soft skills in 30 seconds, not 30 minutes.",
                "Team Fit: See the person behind the code immediately.",
                "Consistency: Standardized format for rapid comparison."
            ],
            type: "feature",
            icon: Video,
            image: "vResume",
            accent: "text-purple-400"
        },
        {
            id: 5,
            title: "Commit Ledger",
            subtitle: "Technical Assurance",
            content: [
                "Immutable Proof: Code history that cannot be faked.",
                "Velocity Tracking: Know how fast they ship.",
                "Collaboration Graph: See how they work with teams."
            ],
            type: "feature",
            icon: Code,
            image: "Ledger",
            accent: "text-green-400"
        },
        {
            id: 16,
            title: "Trust Through Verification",
            subtitle: "The Risk-Adjusted Skill Score",
            tagline: "Quantifying engineering excellence through algorithmic verification.",
            type: "skill-score",
            content: [
                "Eliminates need for technical screening calls.",
                "Predictable engineering velocity from Day 1.",
                "De-risked hiring through verified history."
            ],
            bgGradient: "from-blue-900/40 via-black to-black"
        },
        {
            id: 6,
            title: "Meet the Builders",
            subtitle: "Fusing Vision with Execution",
            tagline: "Building the infrastructure for the next generation of work.",
            type: "founders",
            founder1: { name: "Alex Chen", role: "CEO & Product Vision", image: "/founders/alex.jpg", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
            founder2: { name: "Sarah Jones", role: "CTO & Architecture", image: "/founders/sarah.jpg", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
            bgGradient: "from-zinc-900 via-zinc-900 to-black"
        },
        {
            id: 7,
            title: "Seamless Integration",
            subtitle: "Works With Your Stack",
            content: [
                "ATS Connect: Native integration with Greenhouse, lever, and Workday.",
                "Slack/Teams: Receive candidate briefs directly in chat.",
                "API First: Build custom workflows on our data layer."
            ],
            type: "feature",
            icon: Layers,
            image: "Integration",
            accent: "text-blue-400"
        },
        {
            id: 8,
            title: "Enterprise Security",
            subtitle: "SOC2 Compliance & Data Privacy",
            content: [
                "Data Encryption: End-to-end encryption for all candidate data.",
                "GDPR Ready: Full compliance with global privacy standards.",
                "Role-Based Access: Granular control over who sees what."
            ],
            type: "standard",
            icon: Shield,
            accent: "text-emerald-400"
        },
        {
            id: 9,
            title: "Case Study: TechCorp",
            subtitle: "Reducing Time-to-Hire by 60%",
            content: [
                "Challenge: High volume of unqualified applicants.",
                "Solution: Implemented Loominn Verify-First protocol.",
                "Result: Interview-to-Offer ratio improved from 10:1 to 3:1."
            ],
            type: "standard",
            icon: TrendingUp,
            accent: "text-orange-400"
        },
        {
            id: 10,
            title: "Onboarding Velocity",
            subtitle: "Day 1 Productivity",
            content: [
                "Context Aware: New hires arrive with project context.",
                "Skill Matching: Assignments based on verified capability.",
                "Reduced Ramp: 30% faster time to first commit."
            ],
            type: "standard",
            icon: Users,
            accent: "text-cyan-400"
        },
        {
            id: 11,
            title: "Flexible Pricing",
            subtitle: "Scale With Your Needs",
            content: [
                "Per Seat: For growing teams needing consistent pipeline.",
                "Enterprise License: Unlimited access for global orgs.",
                "Custom SLAs: Dedicated support and uptime guarantees."
            ],
            type: "standard",
            icon: LineChart,
            accent: "text-indigo-400"
        },
        {
            id: 12,
            title: "Business Impact",
            subtitle: "Operational Efficiency",
            content: [
                "Speed: Reduce time-to-hire by 60%.",
                "Cost: Eliminate reliance on external agencies.",
                "Retention: Verified skills + culture fit = longer tenure."
            ],
            type: "standard",
            icon: LineChart,
            accent: "text-emerald-400",
            citation: "Bloom, N., et al. (2023). Hybrid Working From Home Works Out.",
            citationLink: "https://www.nature.com/articles/s41586-024-07500-2"
        },
        {
            id: 13,
            title: "Roadmap Alignment",
            subtitle: "Future Proofing Your Talent",
            content: [
                "Q3 2025: Advanced AI Skill Verification.",
                "Q4 2025: Internal Mobility Marketplace.",
                "2026: Global Payroll Integration."
            ],
            type: "standard",
            icon: Rocket,
            accent: "text-purple-400"
        },
        {
            id: 14,
            title: "Partnership Choice",
            subtitle: "Why Loominn?",
            content: [
                "Integration: API-first design for your existing ATS.",
                "Scale: Handle 10 or 10,000 applicants with equal ease.",
                "Security: Enterprise-grade data protection."
            ],
            type: "hero",
            bgGradient: "from-emerald-950 via-slate-950 to-black"
        }
    ],
    gov: [
        {
            id: 1,
            title: "LOOMINN",
            subtitle: "National Talent Infrastructure",
            tagline: "Empowering the Workforce of Tomorrow.",
            type: "hero",
            bgGradient: "from-blue-900 via-slate-900 to-black"
        },
        {
            id: 2,
            title: "The Public Challenge",
            subtitle: "Unlocking Human Capital",
            content: [
                "Regional Disparity: Talent exists outside major hubs.",
                "Credential Barriers: Skills > Degrees for modern economy.",
                "Workforce Agility: Rapidly reskilling for the AI age."
            ],
            type: "standard",
            icon: Landmark,
            accent: "text-orange-400",
            citation: "World Economic Forum. (2025). The Future of Jobs Report 2025.",
            citationLink: "https://www.weforum.org/publications/the-future-of-jobs-report-2023/"
        },
        {
            id: 3,
            title: "The Solution",
            subtitle: "Meritocratic Infrastructure",
            content: [
                "Universal Access: A platform based on output, not pedigree.",
                "Bias Elimination: Algorithmic matching ignores demographics.",
                "Economic Mobility: Connecting rural talent to global roles."
            ],
            type: "standard",
            icon: Building2,
            accent: "text-blue-400",
            citation: "Kline, P., et al. (2021). Systemic Discrimination.",
            citationLink: "https://www.nber.org/papers/w29053"
        },
        {
            id: 4,
            title: "Orbit Engine",
            subtitle: "The Great Equalizer",
            tagline: "Algorithmic Relevance Calculation",
            content: [
                "Skills: +15pts (Objective Merit)",
                "Projects: +20pts (Verified Output)",
                "Domain: +10pts (Regional Focus)"
            ],
            type: "match-score",
            icon: Globe,
            image: "Orbit",
            accent: "text-cyan-400"
        },
        {
            id: 17,
            title: "Trust Through Verification",
            subtitle: "The Risk-Adjusted Skill Score",
            tagline: "Quantifying engineering excellence through algorithmic verification.",
            type: "skill-score",
            content: [
                "Eliminates need for technical screening calls.",
                "Predictable engineering velocity from Day 1.",
                "De-risked hiring through verified history."
            ],
            bgGradient: "from-blue-900/40 via-black to-black"
        },
        {
            id: 5,
            title: "Meet the Builders",
            subtitle: "Fusing Vision with Execution",
            tagline: "Building the infrastructure for the next generation of work.",
            type: "founders",
            founder1: { name: "Alex Chen", role: "CEO & Product Vision", image: "/founders/alex.jpg", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
            founder2: { name: "Sarah Jones", role: "CTO & Architecture", image: "/founders/sarah.jpg", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
            bgGradient: "from-zinc-900 via-zinc-900 to-black"
        },
        {
            id: 6,
            title: "Regulatory Compliance",
            subtitle: "Built for Government Standards",
            content: [
                "FedRAMP Ready: Architecture designed for federal authorization.",
                "ADA Compliant: Fully accessible interface for all citizens.",
                "Equal Opportunity: Audit trails for every hiring decision."
            ],
            type: "standard",
            icon: Shield,
            accent: "text-red-400"
        },
        {
            id: 7,
            title: "Data Sovereignty",
            subtitle: "Secure & Localized",
            content: [
                "On-Premise Options: For sensitive agency requirements.",
                "Data Residency: Guarantees data stays within national borders.",
                "Encryption: Military-grade security protocols."
            ],
            type: "standard",
            icon: Shield,
            accent: "text-emerald-400"
        },
        {
            id: 8,
            title: "Pilot Program",
            subtitle: "Rapid Deployment Model",
            content: [
                "Phase 1: Regional workforce development boards.",
                "Phase 2: State-level agency integration.",
                "Phase 3: National rollout across federal departments."
            ],
            type: "feature",
            icon: Rocket,
            image: "Pilot",
            accent: "text-blue-400"
        },
        {
            id: 9,
            title: "Social Impact metrics",
            subtitle: "Measuring Success",
            content: [
                "GDP Growth: Maximizing workforce utilization.",
                "Diversity: Naturally diverse outcomes via blind merit.",
                "Resilience: A workforce adaptable to technological change."
            ],
            type: "standard",
            icon: Users,
            accent: "text-pink-400"
        },
        {
            id: 10,
            title: "Fiscal Responsibility",
            subtitle: "Maximizing Taxpayer Value",
            content: [
                "Cost Reduction: Lowers unemployment benefit dependency.",
                "Efficiency: Automates labor-intensive matching processes.",
                "ROI: Positive economic impact within 12 months."
            ],
            type: "standard",
            icon: LineChart,
            accent: "text-green-400"
        },
        {
            id: 11,
            title: "Case Study: City of Innovation",
            subtitle: "Revitalizing Local Economy",
            content: [
                "Problem: Tech talent leaving for coastal cities.",
                "Action: Deployed Loominn to connect locals with remote jobs.",
                "Outcome: 200+ high-paying remote roles filled locally."
            ],
            type: "standard",
            icon: TrendingUp,
            accent: "text-orange-400"
        },
        {
            id: 12,
            title: "Implementation Plan",
            subtitle: "12-Month Rollout",
            content: [
                "Q1: Technical integration & security audit.",
                "Q2: Pilot launch with select agencies.",
                "Q3-Q4: Full scale deployment & training."
            ],
            type: "standard",
            icon: Layers,
            accent: "text-indigo-400"
        },
        {
            id: 13,
            title: "Future of Work",
            subtitle: "Policy Alignment",
            content: [
                "Skills-Based Hiring: Supporting executive orders.",
                "AI Readiness: Preparing the workforce for automation.",
                "Global Competitiveness: Securing national talent advantage."
            ],
            type: "standard",
            icon: Globe,
            accent: "text-cyan-400"
        },
        {
            id: 14,
            title: "Strategic Vision",
            subtitle: "Public-Private Partnership",
            content: [
                "Policy: Adopting skills-based hiring standards.",
                "Education: Aligning training with real-time market data.",
                "Adoption: Government as a model employer."
            ],
            type: "hero",
            bgGradient: "from-blue-950 via-indigo-950 to-black"
        }
    ]
};
