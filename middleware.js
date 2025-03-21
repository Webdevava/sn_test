import { NextResponse } from "next/server";
import { parse } from "cookie";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",           // Root route with login dialog
  "/_next",      // Next.js internals
  "/static",
  "/assets",
  "/favicon.ico",
  "/public",
];

export function middleware(request) {
  const cookieHeader = request.headers.get("cookie");
  const parsedCookies = cookieHeader ? parse(cookieHeader) : {};
  const authToken = parsedCookies.access_token;

  const { pathname } = request.nextUrl;

  // Allow public routes and static assets without token check
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next(); // Always allow access to public routes, including /
  }

  // For protected routes, redirect to / if no token
  if (!authToken) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to root (with login dialog)
  }

  // User is authenticated, proceed to requested route
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};