// Client-safe version - uses browser client
"use client"

import { createSupabaseClient } from "@/lib/supabase/client"

export async function getPlansClient() {
  const supabase = createSupabaseClient()
  const { data: plans, error } = await supabase
    .from("plans")
    .select("*")
    .eq("status", "active")
    .order("monthly_price", { ascending: true })

  if (error) {
    console.error("Error fetching plans (client):", error)
    return []
  }
  return plans
}

export interface Plan {
  id: number
  name: string
  description: string
  long_description: string | null
  monthly_price: number
  setup_fee: number | null
  edit_limit: number
  is_custom: boolean
  is_popular: boolean
  features: string[] | null
  ideal_for: string[] | null
  status: string
}
