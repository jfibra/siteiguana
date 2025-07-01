export const dynamic = "force-dynamic"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"
import type { Database } from "@/types/supabase"

type FeatureRequest = Database["public"]["Tables"]["feature_requests"]["Row"] & {
  users: { first_name: string | null; last_name: string | null } | null
  websites: { title: string | null } | null
}

export default async function AdminFeatureRequestsPage() {
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

  const { data: requests, error: requestsError } = await supabase
    .from("feature_requests")
    .select(`
      id,
      title,
      description,
      priority,
      status,
      created_at,
      users(first_name, last_name),
      websites(title)
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "planned":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 font-plus-jakarta">Feature Requests</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" /> All Feature Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requestsError && <p className="text-red-500">Error loading feature requests: {requestsError.message}</p>}
          {!requests || requests.length === 0 ? (
            <p className="text-muted-foreground">No feature requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req: FeatureRequest) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.title}</TableCell>
                      <TableCell>
                        {req.users?.first_name} {req.users?.last_name || "N/A"}
                      </TableCell>
                      <TableCell>{req.websites?.title || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(req.priority)}>
                          {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1).replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                        {req.description}
                      </TableCell>
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
