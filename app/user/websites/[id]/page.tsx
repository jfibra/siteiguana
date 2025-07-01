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
import { Save, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic" // Corrected: hyphen instead of underscore

interface WebsiteDetailPageProps {
  params: {
    id: string
  }
}

export default function WebsiteDetailPage({ params }: WebsiteDetailPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [website, setWebsite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    setSupabase(getSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    async function fetchWebsite() {
      if (!supabase) return

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view website details.",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }
      setUserId(user.id)

      const { data, error } = await supabase.from("websites").select("*").eq("id", id).eq("user_id", user.id).single()

      if (error) {
        toast({
          title: "Error",
          description: `Failed to load website: ${error.message}`,
          variant: "destructive",
        })
        router.push("/user/dashboard") // Redirect if website not found or not owned by user
      } else if (data) {
        setWebsite(data)
        setImagePreviewUrl(data.preview_image_url)
      }
      setLoading(false)
    }
    fetchWebsite()
  }, [id, supabase, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWebsite({ ...website, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setWebsite({ ...website, plan: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewImageFile(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewImageFile(null)
      setImagePreviewUrl(website?.preview_image_url || null) // Revert to existing image if no new file
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!userId || !supabase || !website) {
      toast({
        title: "Error",
        description: "User not authenticated or Supabase client not initialized.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    let newImageUrl = website.preview_image_url

    if (previewImageFile) {
      const { publicUrl, error: uploadError } = await uploadWebsiteAsset(
        previewImageFile,
        userId,
        "website-previews",
        `${website.title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
      )
      if (uploadError) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload preview image: ${uploadError.message}`,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
      newImageUrl = publicUrl
    }

    const { error: updateError } = await supabase
      .from("websites")
      .update({
        title: website.title,
        description: website.description,
        plan: website.plan,
        tech_stack: website.tech_stack,
        preview_image_url: newImageUrl,
      })
      .eq("id", id)
      .eq("user_id", userId)

    if (updateError) {
      toast({
        title: "Update Failed",
        description: `Error updating website: ${updateError.message}`,
        variant: "destructive",
        icon: <XCircle className="h-5 w-5" />,
      })
    } else {
      toast({
        title: "Website Updated!",
        description: "Your website details have been successfully updated.",
        variant: "default",
        icon: <CheckCircle className="h-5 w-5" />,
      })
      setWebsite((prev: any) => ({ ...prev, preview_image_url: newImageUrl })) // Update state with new URL
      setPreviewImageFile(null) // Clear file input after successful upload
    }
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this website? This action cannot be undone.")) {
      setIsDeleting(true)
      if (!supabase || !userId) {
        toast({
          title: "Error",
          description: "Supabase client not initialized or user not authenticated.",
          variant: "destructive",
        })
        setIsDeleting(false)
        return
      }

      const { error } = await supabase.from("websites").delete().eq("id", id).eq("user_id", userId)

      if (error) {
        toast({
          title: "Deletion Failed",
          description: `Error deleting website: ${error.message}`,
          variant: "destructive",
          icon: <XCircle className="h-5 w-5" />,
        })
      } else {
        toast({
          title: "Website Deleted!",
          description: "The website has been successfully removed.",
          variant: "default",
          icon: <CheckCircle className="h-5 w-5" />,
        })
        router.push("/user/dashboard") // Redirect to dashboard after deletion
      }
      setIsDeleting(false)
    }
  }

  if (loading || !supabase || !website) {
    return (
      <div className="min-h-screen pt-16 gradient-bg flex items-center justify-center">
        <p className="text-gray-600">Loading website details...</p>
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
            <CardTitle className="font-plus-jakarta font-extrabold text-3xl mb-2">Manage Website</CardTitle>
            <p className="text-gray-600">Update details or delete your website project.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Website Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="My Awesome Website"
                  value={website.title || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="A brief description of your website's purpose and features."
                  value={website.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="plan">Plan</Label>
                <Select value={website.plan || ""} onValueChange={handleSelectChange} required>
                  <SelectTrigger id="plan">
                    <SelectValue placeholder="Choose a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="techStack">Preferred Tech Stack</Label>
                <Input
                  id="techStack"
                  name="tech_stack"
                  type="text"
                  placeholder="e.g., Next.js, Tailwind CSS, Supabase"
                  value={website.tech_stack || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="previewImage">Preview Image</Label>
                <div className="flex items-center space-x-4">
                  <Input id="previewImage" type="file" accept="image/*" onChange={handleImageChange} />
                  {imagePreviewUrl && (
                    <img
                      src={imagePreviewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one.</p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Website
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
