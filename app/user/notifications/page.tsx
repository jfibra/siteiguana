"use client"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle, XCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic" // Corrected: hyphen instead of underscore

interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "error"
  created_at: string
  read: boolean
}

export default function NotificationsPage() {
  const { toast } = useToast()

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSupabase(getSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    async function fetchNotifications() {
      if (!supabase) return

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view notifications.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      setUserId(user.id)

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        toast({
          title: "Error",
          description: `Failed to load notifications: ${error.message}`,
          variant: "destructive",
        })
      } else if (data) {
        setNotifications(data as Notification[])
      }
      setLoading(false)
    }
    fetchNotifications()
  }, [supabase, toast])

  const getIconForNotificationType = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <Info className="h-5 w-5 text-yellow-500" />
      case "info":
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  if (loading || !supabase) {
    return (
      <div className="min-h-screen pt-16 gradient-bg flex items-center justify-center">
        <p className="text-gray-600">Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 gradient-bg flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full mx-4"
      >
        <Card className="shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-plus-jakarta font-extrabold text-3xl mb-2">Your Notifications</CardTitle>
            <p className="text-gray-600">Stay updated with important alerts and messages.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No new notifications.</div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      notification.read ? "bg-gray-50 text-gray-500" : "bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex-shrink-0">{getIconForNotificationType(notification.type)}</div>
                    <div className="flex-1">
                      <p className={`text-sm ${notification.read ? "line-through" : "font-medium"}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
