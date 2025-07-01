"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { uploadWebsiteAsset } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Send, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic" // Corrected: hyphen instead of underscore

export default function RequestEditPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [websites, setWebsites] = useState<any[]>([])
  const [selectedWebsiteId, setSelectedWebsiteId] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSupabase(getSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    async function fetchUserWebsites() {
      if (!supabase) return

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to request an edit.",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }
      setUserId(user.id)

      const { data, error } = await supabase.from("websites").select("id, title").eq("user_id", user.id)

      if (error) {
        toast({
          title: "Error",
          description: `Failed to load websites: ${error.message}`,
          variant: "destructive",
        })
      } else if (data) {
        setWebsites(data)
        if (data.length > 0) {
          setSelectedWebsiteId(data[0].id) // Select the first website by default
        }
      }
      setLoading(false)
    }
    fetchUserWebsites()
  }, [supabase, router, toast])

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setAttachment(file || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!userId || !supabase || !selectedWebsiteId || !editDescription) {
      toast({
        title: "Missing Information",
        description: "Please select a website and provide a description for your edit request.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    let attachmentUrl: string | null = null
    if (attachment) {
      const { publicUrl, error: uploadError } = await uploadWebsiteAsset(
        attachment,
        userId,
        "edit-request-attachments",
        `${selectedWebsiteId}-${Date.now()}-${attachment.name}`,
      )
      if (uploadError) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload attachment: ${uploadError.message}`,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
      attachmentUrl = publicUrl
    }

    const { error } = await supabase.from("edit_requests").insert([
      {
        website_id: selectedWebsiteId,
        user_id: userId,
        description: editDescription,
        attachment_url: attachmentUrl,
        status: "pending", // Default status for new requests
      },
    ])

    if (error) {
      toast({
        title: "Request Failed",
        description: `Error submitting edit request: ${error.message}`,
        variant: "destructive",
        icon: <XCircle className="h-5 w-5" />,
      })
    } else {
      toast({
        title: "Request Submitted!",
        description: "Your edit request has been successfully submitted.",
        variant: "default",
        icon: <CheckCircle className="h-5 w-5" />,
      })
      // Clear form
      setEditDescription("")
      setAttachment(null)
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
            <CardTitle className="font-plus-jakarta font-extrabold text-3xl mb-2">Request Website Edit</CardTitle>
            <p className="text-gray-600">Submit a request for changes to your existing website.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="website">Select Website</Label>
                <Select value={selectedWebsiteId} onValueChange={setSelectedWebsiteId} required>
                  <SelectTrigger id="website">
                    <SelectValue placeholder="Choose your website" />
                  </SelectTrigger>
                  <SelectContent>
                    {websites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {websites.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">You don't have any websites yet. Create one first!</p>
                )}
              </div>

              <div>
                <Label htmlFor="editDescription">Description of Changes</Label>
                <Textarea
                  id="editDescription"
                  placeholder="Describe the changes you need for your website in detail."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="attachment">Attach Files (Optional)</Label>
                <Input id="attachment" type="file" onChange={handleAttachmentChange} />
                <p className="text-xs text-gray-500 mt-1">
                  You can attach screenshots, mockups, or any relevant documents.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || websites.length === 0}>
                {isSubmitting ? "Submitting Request..." : "Submit Edit Request"}
                {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
