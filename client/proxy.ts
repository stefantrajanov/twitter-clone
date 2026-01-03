// middleware.ts
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/login", "/register"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const allowedRoutes = ['/'];

export default async function authMiddleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    const isAuthRoute = authRoutes.includes(pathName);
    const isPasswordRoute = passwordRoutes.includes(pathName);
    const isAllowedRoute = allowedRoutes.includes(pathName);

    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",
        {
            baseURL: process.env.BETTER_AUTH_URL,
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        }
    );

    if (!session) {
        if (!isAuthRoute && !isPasswordRoute && !isAllowedRoute) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else {
        if (isAuthRoute || isPasswordRoute) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    ],
};