import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { ProjectCard } from "@/components/ui/ProjectCard";

export default function ProfilePage({ params }: { params: { username: string } }) {
    const username = params.username === "me" ? "Rajayogi" : params.username;

    return (
        <div>
            {/* Cover Image */}
            <div className="h-64 rounded-3xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-accent/20 relative overflow-hidden mb-20">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
            </div>

            {/* Profile Info */}
            <div className="px-8 relative">
                <div className="absolute -top-24 left-8">
                    <div className="h-32 w-32 rounded-full bg-zinc-900 border-4 border-background flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                        {username[0]}
                    </div>
                </div>

                <div className="flex justify-between items-start mb-8">
                    <div className="pt-10">
                        <h1 className="text-3xl font-bold text-white mb-1">{username}</h1>
                        <p className="text-zinc-400 text-lg mb-4">Product Designer & Developer</p>

                        <div className="flex items-center gap-6 text-sm text-zinc-500">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>San Francisco, CA</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LinkIcon size={16} />
                                <a href="#" className="hover:text-primary transition-colors">loominn.com</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>Joined December 2025</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button className="px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors">
                            Follow
                        </button>
                        <button className="px-6 py-2.5 rounded-xl bg-card border border-border text-white font-medium hover:bg-zinc-800 transition-colors">
                            Message
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-12 border-y border-zinc-800 py-6 mb-10">
                    <div>
                        <span className="block text-2xl font-bold text-white">12.5k</span>
                        <span className="text-sm text-zinc-500">Followers</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-white">482</span>
                        <span className="text-sm text-zinc-500">Following</span>
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-white">1.2m</span>
                        <span className="text-sm text-zinc-500">Appreciations</span>
                    </div>
                </div>

                {/* Projects */}
                <h2 className="text-xl font-bold text-white mb-6">Recent Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProjectCard
                        title="Loominn Rebuild Concept"
                        description="A complete redesign of the Loominn platform with a focus on community and collaboration."
                        author={username}
                        image="/placeholder-3.jpg"
                        votes={2048}
                        comments={112}
                        tags={["Next.js", "Tailwind", "Web"]}
                    />
                    <ProjectCard
                        title="Neon City UI Kit"
                        description="Futuristic UI kit for your next project."
                        author={username}
                        image="/placeholder-1.jpg"
                        votes={1240}
                        comments={45}
                        tags={["UI Design", "Figma"]}
                    />
                </div>
            </div>
        </div>
    );
}
