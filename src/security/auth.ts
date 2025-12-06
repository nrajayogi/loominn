
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
        // Re-declare providers to ensure they are loaded (NextAuth sometimes needs this)
        // OR better: spread them. existing providers are fine.
        ...authConfig.providers.filter((p: any) => p?.id !== "credentials"), // Remove mock credentials

        // Add Full Credentials Provider with DB Access
        Credentials({
            name: "Test Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "test@loominn.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Mock validation for the "Test Login" requested by user
                if (credentials.email === "test@loominn.com" && credentials.password === "password123") {
                    // Check if user exists in DB, if not create them for the test
                    let user = await prisma.user.findUnique({ where: { email: "test@loominn.com" } });
                    if (!user) {
                        user = await prisma.user.create({
                            data: {
                                email: "test@loominn.com",
                                name: "Test User",
                                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                                role: "user"
                            }
                        })
                    }
                    return user;
                }
                return null;
            }
        }),
    ],
    session: {
        strategy: "jwt"
    },
})
