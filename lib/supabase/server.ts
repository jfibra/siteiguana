// This file is intended for server-side use ONLY (Server Components, API Routes, Server Actions).
// It uses dynamic import for `next/headers` to avoid breaking client builds if accidentally imported.
"use server" // Ensures this module is treated as server-only by bundlers that support it.

import { createServerClient as _createServerClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { CookieOptions } from "@supabase/ssr"

export async function getSupabaseServerClient(): Promise<SupabaseClient<Database>> {
  const { cookies } = await import("next/headers") // Dynamic import

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL or Anon Key is missing in server.ts. Check env vars.")
  }

  return _createServerClient<Database>(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookies().set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        cookies().set({ name, value: "", ...options })
      },
    },
  })
}

export const createSupabaseServerClient = getSupabaseServerClient
