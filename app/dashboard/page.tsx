"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Edit,
  CreditCard,
  Settings,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
} from "lucide-react"

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  plan: "Informational",
  monthlyFee: 59,
  nextBilling: "2024-02-15",
  website: {
    url: "https://johndoe-business.com",
    status: "live",
    lastUpdated: "2024-01-10",
    editsUsed: 2,
    editsAllowed: 3,
  },
}

const recentChanges = [
  {
    id: 1,
    type: "content",
    description: "Updated homepage hero text",
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: 2,
    type: "image",
    description: "Replaced team photo on About page",
    date: "2024-01-08",
    status: "completed",
  },
  {
    id: 3,
    type: "content",
    description: "Added new service to Services page",
    date: "2024-01-05",
    status: "pending",
  },
]

export default function DashboardPage() {
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [changeRequest, setChangeRequest] = useState({
    type: "content",
    description: "",
    priority: "normal",
  })

  const handleSubmitChange = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle change request submission
    setShowChangeForm(false)
    setChangeRequest({ type: "content", description: "", priority: "normal" })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "in-progress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800"
      case "development":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-plus-jakarta font-extrabold text-3xl md:text-4xl mb-2">Welcome back, {mockUser.name}!</h1>
          <p className="text-gray-600">Manage your website and subscription from your dashboard.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Website Status</p>
                    <Badge className={getStatusColor(mockUser.website.status)}>
                      {mockUser.website.status.charAt(0).toUpperCase() + mockUser.website.status.slice(1)}
                    </Badge>
                  </div>
                  <Globe className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Edits</p>
                    <p className="text-2xl font-bold">
                      {mockUser.website.editsUsed}/{mockUser.website.editsAllowed}
                    </p>
                  </div>
                  <Edit className="w-8 h-8 text-green-500" />
                </div>
                <Progress value={(mockUser.website.editsUsed / mockUser.website.editsAllowed) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Plan</p>
                    <p className="text-2xl font-bold">{mockUser.plan}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Billing</p>
                    <p className="text-lg font-bold">{mockUser.nextBilling}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Website Management */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Website Management</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={mockUser.website.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Site
                      </a>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="changes">Recent Changes</TabsTrigger>
                      <TabsTrigger value="request">Request Change</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Website URL</p>
                          <p className="text-blue-600 hover:text-blue-800">
                            <a href={mockUser.website.url} target="_blank" rel="noopener noreferrer">
                              {mockUser.website.url}
                            </a>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Last Updated</p>
                          <p>{mockUser.website.lastUpdated}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Monthly Edit Allowance</h4>
                        <p className="text-blue-800 text-sm">
                          You have {mockUser.website.editsAllowed - mockUser.website.editsUsed} edits remaining this
                          month. Edits reset on your billing date ({mockUser.nextBilling}).
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="changes" className="space-y-4">
                      <div className="space-y-3">
                        {recentChanges.map((change) => (
                          <div key={change.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            {getStatusIcon(change.status)}
                            <div className="flex-1">
                              <p className="font-medium">{change.description}</p>
                              <p className="text-sm text-gray-600">{change.date}</p>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {change.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="request" className="space-y-4">
                      {!showChangeForm ? (
                        <div className="text-center py-8">
                          <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-semibold text-lg mb-2">Request a Change</h3>
                          <p className="text-gray-600 mb-4">
                            Need updates to your website? Submit a change request and we'll handle it within 48 hours.
                          </p>
                          <Button onClick={() => setShowChangeForm(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Change Request
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitChange} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Change Type</label>
                            <select
                              value={changeRequest.type}
                              onChange={(e) => setChangeRequest({ ...changeRequest, type: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="content">Content Update</option>
                              <option value="image">Image Change</option>
                              <option value="layout">Layout Adjustment</option>
                              <option value="feature">New Feature</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              value={changeRequest.description}
                              onChange={(e) => setChangeRequest({ ...changeRequest, description: e.target.value })}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Describe the changes you'd like to make..."
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select
                              value={changeRequest.priority}
                              onChange={(e) => setChangeRequest({ ...changeRequest, priority: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="low">Low - Within 1 week</option>
                              <option value="normal">Normal - Within 48 hours</option>
                              <option value="high">High - Within 24 hours</option>
                            </select>
                          </div>

                          <div className="flex space-x-3">
                            <Button type="submit" className="flex-1">
                              Submit Request
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowChangeForm(false)}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Plan</p>
                    <p className="font-semibold">{mockUser.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Fee</p>
                    <p className="font-semibold">${mockUser.monthlyFee}/month</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Billing Date</p>
                    <p className="font-semibold">{mockUser.nextBilling}</p>
                  </div>
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                    <Button variant="outline" className="w-full">
                      Upgrade Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    View Website
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Request Changes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Our support team is here to help with any questions or issues.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/contact">Contact Support</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
