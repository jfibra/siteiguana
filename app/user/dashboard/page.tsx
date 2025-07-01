"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Globe,
  Settings,
  MessageSquare,
  CreditCard,
  BarChart3,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Lightbulb,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase/client"

interface Website {
  id: string
  name: string
  status: "pending" | "in_progress" | "completed" | "live"
  created_at: string
  live_url?: string
}

interface Payment {
  id: string
  amount: number
  status: string
  created_at: string
  website_name: string
}

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [websites, setWebsites] = useState<Website[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session?.user) {
          router.push("/auth")
          return
        }

        setUser(session.user)

        // Fetch user's websites
        const { data: websitesData } = await supabase
          .from("website_requests")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (websitesData) {
          setWebsites(websitesData)
        }

        // Fetch user's payments
        const { data: paymentsData } = await supabase
          .from("payments")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (paymentsData) {
          setPayments(paymentsData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, supabase])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "live":
        return <Globe className="h-4 w-4 text-green-600" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      live: "bg-green-100 text-green-800",
    }

    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const handleNewWebsite = () => {
    router.push("/user/websites/wizard/start")
  }

  const handleRequestChanges = () => {
    router.push("/user/request-edit")
  }

  const handleViewWebsite = (id: string) => {
    router.push(`/user/websites/${id}`)
  }

  const handleViewBilling = () => {
    router.push("/user/billing")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
          <p className="text-lg text-gray-600">Manage your websites and track your projects from your dashboard.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white"
            onClick={handleNewWebsite}
          >
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">New Website</h3>
              <p className="text-sm text-gray-600">Start a new project</p>
            </CardContent>
          </Card>

          {websites.length > 0 && (
            <Card
              className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white"
              onClick={handleRequestChanges}
            >
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Request Changes</h3>
                <p className="text-sm text-gray-600">Edit existing sites</p>
              </CardContent>
            </Card>
          )}

          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white"
            onClick={() => router.push("/user/profile")}
          >
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Edit Profile</h3>
              <p className="text-sm text-gray-600">Update your info</p>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white"
            onClick={handleViewBilling}
          >
            <CardContent className="p-6 text-center">
              <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Billing</h3>
              <p className="text-sm text-gray-600">View payments</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-sm text-gray-600">Coming soon</p>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white"
            onClick={() => router.push("/user/test-env")}
          >
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-3" /> {/* Using Lightbulb for 'Test' */}
              <h3 className="font-semibold text-gray-900 mb-1">Test Env</h3>
              <p className="text-sm text-gray-600">Check API Keys</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Websites */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">My Websites</CardTitle>
                  <Button onClick={handleNewWebsite} className="iguana-button text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Website
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {websites.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No websites yet</h3>
                    <p className="text-gray-600 mb-6">
                      Ready to create your first professional website? Let's get started!
                    </p>
                    <Button onClick={handleNewWebsite} className="iguana-button text-white">
                      Create Your First Website
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {websites.map((website) => (
                      <div
                        key={website.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(website.status)}
                            <h4 className="font-semibold text-gray-900">{website.name}</h4>
                            {getStatusBadge(website.status)}
                          </div>
                          <div className="flex items-center space-x-2">
                            {website.live_url && (
                              <Button
                                onClick={() => window.open(website.live_url, "_blank")}
                                variant="outline"
                                size="sm"
                                className="border-green-600 text-green-600 hover:bg-green-50"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Live
                              </Button>
                            )}
                            <Button
                              onClick={() => handleViewWebsite(website.id)}
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Created {new Date(website.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ready to Create CTA */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-orange-500 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Ready to Create Your Next Website?</h3>
                <p className="text-green-100 mb-4 text-sm">
                  Our website wizard makes it easy to get started. Answer a few questions and we'll handle the rest.
                </p>
                <Button onClick={handleNewWebsite} className="w-full bg-white text-green-600 hover:bg-gray-100">
                  Start Website Wizard
                </Button>
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">No payments yet</p>
                ) : (
                  <div className="space-y-3">
                    {payments.slice(0, 3).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900 text-sm">${payment.amount}</p>
                          <p className="text-xs text-gray-600">{payment.website_name}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">{payment.status}</Badge>
                      </div>
                    ))}
                    <Button
                      onClick={handleViewBilling}
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      View All Payments
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Total Websites</span>
                  <span className="font-semibold text-gray-900">{websites.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Live Websites</span>
                  <span className="font-semibold text-gray-900">
                    {websites.filter((w) => w.status === "live").length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">In Progress</span>
                  <span className="font-semibold text-gray-900">
                    {websites.filter((w) => w.status === "in_progress").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
