"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReactionButton from "@/components/ui/ReactionButton";
import { useGlobalState } from "@/context/GlobalStateContext";
import StoriesRail from "@/components/feed/StoriesRail";

import { motion } from "framer-motion";
import { Heart, MessageSquare, ArrowUpRight, Zap, Star } from "lucide-react";
import { useMemo, useState } from "react";

// Types for the mixed feed
type FeedItemType = "social" | "project" | "milestone";

interface BaseFeedItem {
  id: number | string;
  type: FeedItemType;
  time?: string;
  likes?: number;
}

interface SocialFeedItem extends BaseFeedItem {
  type: "social";
  user: string;
  avatar: string;
  content: string;
  comments?: number;
}

interface ProjectFeedItem extends BaseFeedItem {
  type: "project";
  title: string;
  description: string;
  status: string;
  color: string;
  author: string;
}

interface MilestoneFeedItem extends BaseFeedItem {
  type: "milestone";
  user: string;
  content: string;
  project: string;
}

type FeedItem = SocialFeedItem | ProjectFeedItem | MilestoneFeedItem;

const BUILDER_FEED_ITEMS: FeedItem[] = [
  {
    type: "social",
    id: "builder-1",
    user: "Elena Rostova",
    avatar: "ER",
    content: "Reflecting on event-sourced orbit proofs for Loominn. When consensus across 3+ verified project contributors validates milestone delivery, our cryptographic audit trail guarantees transparent credibility without relying on opaque karma scores. #systems #orbit",
    time: "24m ago",
    likes: 68,
    comments: 14
  },
  {
    type: "project",
    id: "loominn-rebuild",
    title: "Autonomous Agent Orchestration Mesh",
    description: "Decentralized execution network enabling autonomous agents to coordinate work contracts, peer audits, and state verification.",
    status: "Active Work",
    color: "from-blue-600 to-indigo-700",
    likes: 342,
    author: "Maya Patel"
  },
  {
    type: "social",
    id: "builder-3",
    user: "Dev Singh",
    avatar: "DS",
    content: "Benchmark results on CRDT-backed collaborative canvas vs operational transformation: 42% reduction in memory overhead with zero conflict degradation during 20-node concurrent stress tests. Code pushed to workspace! 🚀",
    time: "2h ago",
    likes: 83,
    comments: 19
  }
];

export default function Home() {
  const { data: session } = useSession();
  const { posts, userProfile, userProjects } = useGlobalState();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "projects" | "perspectives">("all");
  const [spotlightLiked, setSpotlightLiked] = useState(false);

  // 1. Dynamic Spotlight: Find the latest approved project or fallback
  const spotlightProject = useMemo(() => {
    // Try to find a featured/approved project from user projects first
    const approved = userProjects.find(p => p.status === 'approved');
    if (approved) {
      return {
        id: approved.id || "loominn-rebuild",
        title: approved.title,
        description: approved.description,
        author: userProfile.name,
        tags: ["Featured", "New"],
        likes: 128,
        image: approved.slides && approved.slides.length > 0 ? approved.slides[0] : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80",
        isDynamic: true
      };
    }
    // Fallback static spotlight
    return {
      id: "loominn-rebuild",
      title: "Loominn Rebuild & Orbit Mesh",
      description: "A next-generation work-centered network for builders. Connect via Partner, Colleague, and Ally tiers and earn transparent credibility through verified contributions.",
      author: "Loominn Core",
      tags: ["Work Network", "Credibility", "Next.js"],
      likes: 1240,
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80",
      isDynamic: false
    };
  }, [userProjects, userProfile]);

  // 2. Dynamic Feed Construction
  const feedItems = useMemo<FeedItem[]>(() => {
    const globalItems: FeedItem[] = posts.map(post => {
      if (post.projectData) {
        return {
          type: "project",
          id: `global-post-${post.id}`,
          title: post.projectData.title,
          description: post.content || post.projectData.description,
          status: "Verified",
          color: "from-blue-600 to-purple-600",
          author: userProfile.name,
          likes: post.likes,
          time: post.time
        };
      }

      return {
        type: "social",
        id: `global-post-${post.id}`,
        user: userProfile.name,
        avatar: (userProfile.name?.charAt(0) || "U") + (userProfile.name?.split(" ")[1]?.charAt(0) || ""),
        content: post.content,
        time: post.time,
        likes: post.likes,
        comments: post.comments
      };
    });

    return [...globalItems, ...BUILDER_FEED_ITEMS];
  }, [posts, userProfile]);

  // 3. Filtered items
  const displayedFeedItems = useMemo(() => {
    if (activeFilter === "projects") {
      return feedItems.filter(item => item.type === "project");
    }
    if (activeFilter === "perspectives") {
      return feedItems.filter(item => item.type === "social" || item.type === "milestone");
    }
    return feedItems;
  }, [feedItems, activeFilter]);

  return (
    <div className="space-y-12 pb-24 relative">
      {/* Project Spotlight (The USP) */}
      <section className="relative h-[55vh] min-h-[400px] w-full rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${spotlightProject.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-20" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-blue-600/30">
              <Zap size={12} className="fill-current" /> Spotlight
            </span>
            <span className="text-zinc-300 text-sm">by {spotlightProject.author}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight"
          >
            {spotlightProject.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg text-zinc-300 max-w-2xl mb-8 line-clamp-2 leading-relaxed"
          >
            {spotlightProject.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6"
          >
            <Link href={`/projects/${spotlightProject.id}`}>
              <button className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95">
                View Project <ArrowUpRight size={18} />
              </button>
            </Link>
            <button
              onClick={() => setSpotlightLiked(!spotlightLiked)}
              className="flex items-center gap-2 text-white hover:text-red-400 transition-colors"
            >
              <Heart className={spotlightLiked ? "fill-current text-red-500" : "text-zinc-300"} />
              <span className="font-bold">{spotlightProject.likes + (spotlightLiked ? 1 : 0)}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stories Rail */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto z-40 relative">
        <StoriesRail />
      </section>

      {/* Mosaic Feed */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Trending on Loominn</h2>
            <p className="text-zinc-400 text-xs mt-1">Discover perspectives, project opportunities, and engineering milestones</p>
          </div>
          <div className="flex gap-2 bg-zinc-900/80 p-1.5 rounded-full border border-white/10 w-fit">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("projects")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === "projects"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveFilter("perspectives")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === "perspectives"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Perspectives
            </button>
          </div>
        </div>

        {displayedFeedItems.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-white/5">
            <p className="text-zinc-400 text-sm">No items found in this category.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {displayedFeedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="break-inside-avoid"
              >
                {/* Social Post Card */}
                {item.type === "social" && (
                  <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {item.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{item.user}</h3>
                        <p className="text-xs text-zinc-500">{item.time}</p>
                      </div>
                    </div>
                    <p className="text-zinc-300 mb-4 text-sm leading-relaxed">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-4 text-zinc-500 text-xs pt-3 border-t border-white/5">
                      <ReactionButton initialCount={item.likes || 0} />
                      <button
                        onClick={() => router.push("/feed")}
                        className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                      >
                        <MessageSquare size={14} /> {item.comments || 0}
                      </button>
                    </div>
                  </div>
                )}

                {/* Project Card */}
                {item.type === "project" && (
                  <div className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 shadow-lg">
                    <div className={`h-32 bg-gradient-to-br ${item.color} relative p-6 flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-md text-xs text-white font-medium">
                          {item.status}
                        </span>
                        <Link href={`/projects/${item.id === "loominn-rebuild" ? "loominn-rebuild" : item.id}`}>
                          <button
                            aria-label={`Open ${item.title}`}
                            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"
                          >
                            <ArrowUpRight size={14} />
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className="p-5">
                      <Link href={`/projects/${item.id === "loominn-rebuild" ? "loominn-rebuild" : item.id}`}>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors cursor-pointer">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-xs text-zinc-500">by {item.author}</span>
                        <div className="flex items-center gap-1 text-zinc-400 text-xs">
                          <Star size={12} className="fill-current text-yellow-500" /> {item.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Milestone Card */}
                {item.type === "milestone" && (
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                      <Star size={24} className="fill-current" />
                    </div>
                    <div>
                      <p className="text-white text-sm">
                        <span className="font-bold">{item.user}</span> {item.content}
                      </p>
                      <p className="text-xs text-yellow-500/70 mt-1">{item.project} • {item.time}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
