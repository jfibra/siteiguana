export const dynamic = "force-dynamic"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity } from "lucide-react"
import type { Database } from "@/types/supabase"

type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"] & {
  users: { first_name: string | null; last_name: string | null } | null
}

export default async function AdminActivityLogsPage() {
  let session = null
  let supabase

  try {
    supabase = await createSupabaseServerClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      redirect("/auth/login?error=session_error")
    }

    session = sessionData.session
  } catch (error) {
    console.error("Supabase client error:", error)
    redirect("/auth/login?error=client_error")
  }

  if (!session) {
    redirect("/auth/login")
  }

  // Ensure only admins can access this page
  try {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("roles(name)")
      .eq("id", session.user.id)
      .single()

    // @ts-ignore
    if (profileError || profile?.roles?.name !== "admin") {
      redirect("/user/dashboard?error=unauthorized")
    }
  } catch (error) {
    console.error("Profile check error:", error)
    redirect("/user/dashboard?error=profile_error")
  }

  const { data: activityLogs, error: logsError } = await supabase
    .from("activity_logs")
    .select(`
      id,
      activity,
      url,
      ip_address,
      device,
      browser,
      os,
      created_at,
      users(first_name, last_name)
    `)
    .order("created_at", { ascending: false })
    .limit(50) // Limit to recent 50 logs for performance

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 font-plus-jakarta">Activity Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" /> Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logsError && <p className="text-red-500">Error loading activity logs: {logsError.message}</p>}
          {!activityLogs || activityLogs.length === 0 ? (
            <p className="text-muted-foreground">No activity logs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device/Browser</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log: ActivityLog) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {log.users?.first_name} {log.users?.last_name || "N/A"}
                      </TableCell>
                      <TableCell>{log.activity}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {log.url || "N/A"}
                      </TableCell>
                      <TableCell>{log.ip_address || "N/A"}</TableCell>
                      <TableCell>
                        {log.device || "N/A"} / {log.browser || "N/A"}
                      </TableCell>
                      <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
