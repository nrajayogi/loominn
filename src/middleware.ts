
import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/login')
    const isPublicPage = req.nextUrl.pathname === '/'

    if (!isLoggedIn && !isAuthPage && !isPublicPage) {
        return Response.redirect(new URL('/login', req.nextUrl))
    }

    if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/feed', req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
