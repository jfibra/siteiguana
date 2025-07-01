import { NextResponse } from "next/server"
import { checkSupabaseStatus } from "@/lib/supabase-status"

export async function GET() {
  try {
    const isSupabaseReady = await checkSupabaseStatus()
    if (isSupabaseReady) {
      return NextResponse.json({ status: "ok", message: "Supabase environment variables are set." })
    } else {
      return NextResponse.json(
        { status: "error", message: "Supabase environment variables are missing." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in /api/supabase-status:", error)
    return NextResponse.json({ status: "error", message: "Internal server error." }, { status: 500 })
  }
}
