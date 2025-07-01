export const dynamic = "force-dynamic"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Users } from "lucide-react"
import Link from "next/link"

type UserProfile = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  role: string | null
  status: string | null
  created_at: string
}

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient()

  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select(`
      id,
      first_name,
      last_name,
      status,
      created_at,
      roles ( name ),
      user_profile:auth.users ( email )
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  const users: UserProfile[] =
    usersData?.map((u) => ({
      id: u.id,
      first_name: u.first_name,
      last_name: u.last_name,
      status: u.status,
      created_at: u.created_at,
      // @ts-ignore
      email: u.user_profile?.email || "N/A",
      // @ts-ignore
      role: u.roles?.name || "N/A",
    })) || []

  const getStatusColor = (status: string | null) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold font-plus-jakarta">User Management</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" /> All Users
            </div>
            {/* Add search/filter components here later */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usersError && <p className="text-red-500">Error loading users: {usersError.message}</p>}
          {!users || users.length === 0 ? (
            <p className="text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
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
                              <Link href={`/admin/users/${user.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
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
