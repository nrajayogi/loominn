
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        }),
        Apple({
            clientId: process.env.AUTH_APPLE_ID,
            clientSecret: process.env.AUTH_APPLE_SECRET,
        }),
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
    callbacks: {
        async session({ session, user }) {
            // Add ID to session
            if (session.user && user) {
                session.user.id = user.id;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login', // Custom login page
    }
})
