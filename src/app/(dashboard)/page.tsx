"use client";

import ReactionButton from "@/components/ui/ReactionButton";

import { motion } from "framer-motion";
import { Heart, MessageSquare, ArrowUpRight, Zap, Star } from "lucide-react";

const SPOTLIGHT_PROJECT = {
  title: "NeuroLink AI Interface",
  description: "A next-generation brain-computer interface for seamless digital interaction. Experience the future of thought-controlled computing.",
  author: "Sarah Chen",
  tags: ["AI", "Neurotech", "React"],
  likes: 1240,
  image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80"
};

const FEED_ITEMS = [
  {
    type: "social",
    id: 1,
    user: "Mike Ross",
    avatar: "MR",
    content: "Just pushed the new authentication flow! 🔒 It's smoother than ever. #webdev #security",
    time: "10m ago",
    likes: 45,
    comments: 12
  },
  {
    type: "project",
    id: 2,
    title: "EcoTrack Mobile",
    description: "Sustainability tracking for everyday life.",
    status: "Launched",
    color: "from-green-500 to-emerald-700",
    likes: 890,
    author: "EcoTeam"
  },
  {
    type: "social",
    id: 3,
    user: "Jessica Lee",
    avatar: "JL",
    content: "Can anyone recommend a good library for 3D data visualization in React? 🤔",
    time: "1h ago",
    likes: 12,
    comments: 24
  },
  {
    type: "milestone",
    id: 4,
    user: "David Kim",
    avatar: "DK",
    content: "just reached 1,000 stars on GitHub!",
    project: "OpenUI",
    time: "2h ago"
  },
  {
    type: "project",
    id: 5,
    title: "Mars Colonizer",
    description: "Simulation game for Red Planet survival.",
    status: "Beta",
    color: "from-orange-500 to-red-700",
    likes: 2300,
    author: "SpaceX Fan"
  }
];

export default function Home() {
  return (
    <div className="space-y-12 pb-24 relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Project Spotlight (The USP) */}
      <section className="relative h-[60vh] w-full rounded-none overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${SPOTLIGHT_PROJECT.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-20" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap size={12} className="fill-current" /> Spotlight
            </span>
            <span className="text-zinc-300 text-sm">by {SPOTLIGHT_PROJECT.author}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-3xl leading-tight"
          >
            {SPOTLIGHT_PROJECT.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-zinc-300 max-w-2xl mb-8 line-clamp-2"
          >
            {SPOTLIGHT_PROJECT.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6"
          >
            <button className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
              View Project <ArrowUpRight size={18} />
            </button>
            <div className="flex items-center gap-2 text-white">
              <Heart className="fill-current text-red-500" />
              <span className="font-bold">{SPOTLIGHT_PROJECT.likes}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mosaic Feed */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">All</button>
            <button className="px-4 py-2 rounded-full bg-transparent text-zinc-500 text-sm hover:text-white transition-colors">Projects</button>
            <button className="px-4 py-2 rounded-full bg-transparent text-zinc-500 text-sm hover:text-white transition-colors">Social</button>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {FEED_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="break-inside-avoid"
            >
              {/* Social Post Card */}
              {item.type === "social" && (
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
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
                  <div className="flex items-center gap-4 text-zinc-500 text-xs">
                    <ReactionButton initialCount={item.likes} />
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors"><MessageSquare size={14} /> {item.comments}</button>
                  </div>
                </div>
              )}

              {/* Project Card */}
              {item.type === "project" && (
                <div className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
                  <div className={`h-32 bg-gradient-to-br ${item.color} relative p-6 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-1 rounded-md bg-black/20 backdrop-blur-md text-xs text-white font-medium">
                        {item.status}
                      </span>
                      <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{item.description}</p>
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
      </section>
    </div>
  );
}
