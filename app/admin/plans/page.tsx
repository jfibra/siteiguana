export const dynamic = "force-dynamic"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"

export default async function AdminPlansPage() {
  const supabase = await createSupabaseServerClient()

  const { data: plans, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_deleted", false)
    .order("monthly_price", { ascending: true })

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-plus-jakarta">Plans Management</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">Error loading plans: {error.message}</p>}
          {!plans || plans.length === 0 ? (
            <p className="text-muted-foreground">No plans found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Monthly Price</TableHead>
                    <TableHead>Setup Fee</TableHead>
                    <TableHead>Edit Limit</TableHead>
                    <TableHead>Custom</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                      <TableCell>${Number(plan.monthly_price || 0).toFixed(2)}</TableCell>
                      <TableCell>${Number(plan.setup_fee || 0).toFixed(2)}</TableCell>
                      <TableCell>{plan.edit_limit}</TableCell>
                      <TableCell>
                        <Badge variant={plan.is_custom ? "default" : "secondary"}>
                          {plan.is_custom ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
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
