import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: "",
              ...options,
            })
          },
        },
      },
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { pathname } = request.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/about", "/services", "/contact", "/pricing", "/terms", "/privacy"]

    const authRoutes = [
      "/auth",
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/callback",
    ]

    // Allow public routes, auth routes, and API routes
    if (
      publicRoutes.includes(pathname) ||
      authRoutes.some((route) => pathname.startsWith(route)) ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next") ||
      pathname.includes(".")
    ) {
      // If user is logged in and tries to access auth pages, redirect to appropriate dashboard
      if (session && authRoutes.some((route) => pathname.startsWith(route)) && pathname !== "/auth/callback") {
        try {
          const { data: profile } = await supabase
            .from("users")
            .select("roles(name)")
            .eq("id", session.user.id)
            .single()

          const userRole = profile?.roles?.name

          if (userRole === "admin") {
            return NextResponse.redirect(new URL("/admin", request.url))
          } else {
            return NextResponse.redirect(new URL("/user/dashboard", request.url))
          }
        } catch (error) {
          console.error("Middleware role fetch error:", error)
          return NextResponse.redirect(new URL("/user/dashboard", request.url))
        }
      }
      return response
    }

    // Redirect to login if not authenticated
    if (!session) {
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.set("redirectedFrom", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Fetch user's role for authenticated users
    let userRole: string | null = null
    try {
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("roles(name)")
        .eq("id", session.user.id)
        .single()

      if (profileError) {
        console.error("Middleware: Error fetching user profile:", profileError)
        const redirectUrl = new URL("/auth/login?error=profile_fetch_failed", request.url)
        return NextResponse.redirect(redirectUrl)
      }

      userRole = profile?.roles?.name || null
    } catch (error) {
      console.error("Middleware: Exception fetching user role:", error)
      const redirectUrl = new URL("/auth/login?error=profile_exception", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    if (!userRole) {
      console.error("Middleware: User role not found for user:", session.user.id)
      const redirectUrl = new URL("/auth/login?error=role_not_found", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Role-based access control
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/user/dashboard?error=unauthorized_admin_access", request.url))
    }

    // Redirect /dashboard to role-specific dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else if (userRole === "user") {
        return NextResponse.redirect(new URL("/user/dashboard", request.url))
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // Return a basic response to prevent middleware failure
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
