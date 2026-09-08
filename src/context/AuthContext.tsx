"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { createContext, useContext, ReactNode } from "react";

interface AuthContextType {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
    isLoading: boolean;
    login: (provider?: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = !!session?.user;

    const login = async (provider: string = "credentials") => {
        await signIn(provider, { callbackUrl: "/feed" });
    };

    const logout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <AuthContext.Provider
            value={{
                user: session?.user || null,
                isLoading,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    const sessionContext = useSession();

    if (context === undefined) {
        // Fallback directly to useSession if outside AuthProvider
        const { data: session, status } = sessionContext;
        return {
            user: session?.user || null,
            isLoading: status === "loading",
            login: async (provider: string = "credentials") => {
                await signIn(provider, { callbackUrl: "/feed" });
            },
            logout: async () => {
                await signOut({ callbackUrl: "/login" });
            },
            isAuthenticated: !!session?.user
        };
    }
    return context;
}

