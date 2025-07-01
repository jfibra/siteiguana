"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, MessageSquare, Send, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic" // Corrected: hyphen instead of underscore

export default function SupportPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSupabase(getSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    async function fetchUser() {
      if (!supabase) return

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        toast({
          title: "Authentication Required",
          description: "Please log in to access support.",
          variant: "destructive",
        })
        router.push("/auth/login")
      }
      setLoading(false)
    }
    fetchUser()
  }, [supabase, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!userId || !supabase || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide a subject and a message for your support ticket.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from("support_tickets").insert([
      {
        user_id: userId,
        subject,
        message,
        status: "open", // Default status for new tickets
      },
    ])

    if (error) {
      toast({
        title: "Ticket Submission Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
        icon: <XCircle className="h-5 w-5" />,
      })
    } else {
      toast({
        title: "Ticket Submitted!",
        description: "Your support ticket has been successfully submitted.",
        variant: "default",
        icon: <CheckCircle className="h-5 w-5" />,
      })
      // Clear form
      setSubject("")
      setMessage("")
      // Optionally redirect or show a success message
      router.push("/user/dashboard")
    }
    setIsSubmitting(false)
  }

  if (loading || !supabase) {
    return (
      <div className="min-h-screen pt-16 gradient-bg flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
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
            <CardTitle className="font-plus-jakarta font-extrabold text-3xl mb-2">Contact Support</CardTitle>
            <p className="text-gray-600">Submit a support ticket and we'll get back to you as soon as possible.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="subject"
                    type="text"
                    placeholder="e.g., Website not loading"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <div className="relative mt-1">
                  <MessageSquare className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question in detail."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Ticket..." : "Submit Ticket"}
                {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
