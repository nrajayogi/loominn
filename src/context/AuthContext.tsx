"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    avatar: string; // Mock avatar
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
    id: "user-1",
    name: "Rajayogi Nandina",
    email: "rajayogi@loominn.com",
    role: "user",
    avatar: "RN" // Initials for now
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Init: Check local storage or cookie
        const storedUser = localStorage.getItem("loominn_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string) => {
        setIsLoading(true);
        console.log("Logging in", email);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setUser(MOCK_USER);
        localStorage.setItem("loominn_user", JSON.stringify(MOCK_USER));

        setIsLoading(false);
        router.push("/feed"); // Redirect to feed after login
    };

    const logout = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setUser(null);
        localStorage.removeItem("loominn_user");

        setIsLoading(false);
        router.push("/login"); // Redirect to login
    };

    // Protected Route Logic (Client-side backup)
    useEffect(() => {
        const publicRoutes = ["/login", "/signup", "/"];
        if (!isLoading && !user && !publicRoutes.includes(pathname)) {
            // router.push("/login"); // Optional: strict client-side redirect
            // Disabled for now to prevent loops during dev if middleware handles it
        }
    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
