import { createSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get user session to determine redirect
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Get user role with better error handling
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("roles(name)")
          .eq("id", session.user.id)
          .single()

        if (!profileError && profile) {
          // @ts-ignore
          const userRole = profile?.roles?.name

          console.log("Auth callback - User role:", userRole) // Debug log

          if (userRole === "admin") {
            console.log("Redirecting admin to /admin") // Debug log
            return NextResponse.redirect(`${origin}/admin`)
          } else {
            console.log("Redirecting user to /user/dashboard") // Debug log
            return NextResponse.redirect(`${origin}/user/dashboard`)
          }
        } else {
          console.error("Profile fetch error:", profileError)
          // Default to user dashboard if role fetch fails
          return NextResponse.redirect(`${origin}/user/dashboard`)
        }
      }
    } else {
      console.error("Auth exchange error:", error)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
