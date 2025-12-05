"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        name: string;
        bio: string;
        location: string;
        image?: string;
    };
    onSave: (data: { name: string; bio: string; location: string; image?: string }) => void;
}

export default function EditProfileModal({ isOpen, onClose, userData, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState(userData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData({ ...formData, image: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ... (backdrop) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-6 z-50 shadow-2xl"
                    >
                        {/* ... header ... */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Image Mock */}
                            <div className="flex justify-center">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center overflow-hidden">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-zinc-500 text-xs text-center p-2">Change Image</div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 Uppercase tracking-wider">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 Uppercase tracking-wider">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 Uppercase tracking-wider">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                    className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2 mr-auto"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl bg-white/5 text-zinc-300 font-medium hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
