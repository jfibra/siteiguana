export const dynamic = "force-dynamic"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Globe, MessageSquare, Activity, CreditCard, FileText } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()

  // Fetch comprehensive stats
  const [
    { count: userCount },
    { count: websiteCount },
    { count: openTicketsCount },
    { count: totalTransactions },
    { count: pendingWebsites },
    { count: activeUsers },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).eq("is_deleted", false),
    supabase.from("websites").select("*", { count: "exact", head: true }).eq("is_deleted", false),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
    supabase.from("websites").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("status", "active"),
  ])

  // Fetch recent activities
  const { data: recentUsers } = await supabase
    .from("users")
    .select("id, first_name, last_name, created_at, roles(name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentWebsites } = await supabase
    .from("websites")
    .select("*, users(first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentTickets } = await supabase
    .from("support_tickets")
    .select("*, users(first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800"
      case "development":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paused":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-plus-jakarta">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">Welcome back, Administrator</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">{activeUsers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Websites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websiteCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">{pendingWebsites} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTicketsCount ?? 0}</div>
            <Link href="/admin/support-tickets" className="text-xs text-blue-600 hover:underline">
              View All
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions ?? 0}</div>
            <Link href="/admin/transactions" className="text-xs text-blue-600 hover:underline">
              View All
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Live</div>
            <Link href="/admin/activity-logs" className="text-xs text-blue-600 hover:underline">
              View Logs
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <Link href="/admin/reports" className="text-xs text-blue-600 hover:underline">
              Generate
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      <Badge variant="outline">{user.roles?.name || "user"}</Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Websites</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentWebsites?.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.title}</TableCell>
                    <TableCell>
                      {site.users?.first_name} {site.users?.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(site.status)}>{site.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recent Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTickets?.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>
                    {ticket.users?.first_name} {ticket.users?.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ticket.priority === "urgent" ? "destructive" : "secondary"}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === "open" ? "destructive" : "secondary"}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
