import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")

  // Protected routes that require authentication
  const protectedRoutes = ["/profile"]

  // Auth routes that should redirect to home if already logged in
  const authRoutes = ["/login", "/signup"]

  const path = request.nextUrl.pathname

  // Check if the route is protected and user is not logged in
  if (protectedRoutes.some((route) => path.startsWith(route)) && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Check if the route is an auth route and user is already logged in
  if (authRoutes.some((route) => path.startsWith(route)) && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile", "/login", "/signup"],
}
