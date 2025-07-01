export const dynamic = "force-dynamic"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Globe } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/types/supabase"

type Website = Database["public"]["Tables"]["websites"]["Row"] & {
  users: { first_name: string | null; last_name: string | null } | null
  plans: { name: string | null } | null
}

export default async function AdminWebsitesPage() {
  const supabase = await createSupabaseServerClient()

  const { data: websites, error: websitesError } = await supabase
    .from("websites")
    .select(`
      *,
      users(first_name, last_name),
      plans(name)
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string | null) => {
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
      <h1 className="text-3xl font-bold font-plus-jakarta">Website Management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" /> All Websites
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {websitesError && <p className="text-red-500">Error loading websites: {websitesError.message}</p>}
          {!websites || websites.length === 0 ? (
            <p className="text-muted-foreground">No websites found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {websites.map((site: Website) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.title}</TableCell>
                      <TableCell>
                        {site.users?.first_name} {site.users?.last_name}
                      </TableCell>
                      <TableCell>{site.plans?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(site.status)}>{site.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(site.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/websites/${site.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            {site.live_url && (
                              <DropdownMenuItem asChild>
                                <a href={site.live_url} target="_blank" rel="noopener noreferrer">
                                  View Live Site
                                </a>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
