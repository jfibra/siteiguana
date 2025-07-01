"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

let singleton: SupabaseClient<Database> | null = null

export function createSupabaseClient(): SupabaseClient<Database> {
  if (!singleton) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase env vars missing. Using mock client.")
      const noop = async () => ({ data: null, error: null })
      singleton = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          signOut: noop,
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({ select: () => ({ eq: () => ({ single: noop }) }) }),
      } as unknown as SupabaseClient<Database>
    } else {
      singleton = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      )
    }
  }
  return singleton
}

export const getSupabaseBrowserClient = createSupabaseClient
