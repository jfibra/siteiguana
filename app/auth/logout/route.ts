import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // Sign out from Supabase
    await supabase.auth.signOut()

    // Create response that redirects to login
    const response = NextResponse.redirect(
      new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    )

    // Clear all auth-related cookies
    const cookiesToClear = [
      "sb-access-token",
      "sb-refresh-token",
      "supabase-auth-token",
      "supabase.auth.token",
      "sb-localhost-auth-token",
      "sb-localhost-auth-token-code-verifier",
    ]

    cookiesToClear.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      })
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    // Even if there's an error, redirect to login
    return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
  }
}

export async function GET() {
  return POST()
}
