"use client"

import { createSupabaseClient } from "@/lib/supabase/client"

export const handleLogout = async () => {
  try {
    const supabase = createSupabaseClient()

    // Clear the session on the client side
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
    }

    // Clear any local storage or session storage
    if (typeof window !== "undefined") {
      localStorage.clear()
      sessionStorage.clear()
    }

    // Force a hard redirect to clear all state
    window.location.replace("/auth/login")
  } catch (error) {
    console.error("Logout failed:", error)
    // Force redirect even on error
    window.location.replace("/auth/login")
  }
}
