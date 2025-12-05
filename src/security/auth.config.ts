
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import Credentials from "next-auth/providers/credentials"
import type { Provider } from "next-auth/providers"

const providers: Provider[] = [
    Credentials({
        name: "Test Login",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            return null;
        }
    }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }));
}

if (process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET) {
    providers.push(Facebook({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }));
}

if (process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET) {
    providers.push(Apple({
        clientId: process.env.AUTH_APPLE_ID,
        clientSecret: process.env.AUTH_APPLE_SECRET,
    }));
}

export const authConfig = {
    providers,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt" // Ensure we use JWT so middleware can verify without DB
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
} satisfies NextAuthConfig
