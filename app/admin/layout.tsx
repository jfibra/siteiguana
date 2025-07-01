import type React from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("roles(name)").eq("id", session.user.id).single()

  // @ts-ignore
  if (profile?.roles?.name !== "admin") {
    redirect("/user/dashboard?error=unauthorized")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-muted/40 p-4 sm:p-6 md:p-8 ml-0 sm:ml-64">{children}</main>
    </div>
  )
}
