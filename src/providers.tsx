"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalStateProvider } from "@/context/GlobalStateContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <GlobalStateProvider>
                {children}
            </GlobalStateProvider>
        </SessionProvider>
    );
}
