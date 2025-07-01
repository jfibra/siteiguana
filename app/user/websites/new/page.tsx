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
import { PlusCircle, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic" // Corrected: hyphen instead of underscore

export default function NewWebsitePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [plan, setPlan] = useState("")
  const [techStack, setTechStack] = useState("")
  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
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
          description: "Please log in to create a new website.",
          variant: "destructive",
        })
        router.push("/auth/login")
      }
      setLoading(false)
    }
    fetchUser()
  }, [supabase, router, toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewImage(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewImage(null)
      setImagePreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!userId || !supabase) {
      toast({
        title: "Error",
        description: "User not authenticated or Supabase client not initialized.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    let imageUrl: string | null = null
    if (previewImage) {
      const { publicUrl, error: uploadError } = await uploadWebsiteAsset(
        previewImage,
        userId,
        "website-previews",
        `${title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
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
      imageUrl = publicUrl
    }

    const { data, error } = await supabase.from("websites").insert([
      {
        user_id: userId,
        title,
        description,
        plan,
        tech_stack: techStack,
        preview_image_url: imageUrl,
        status: "pending", // Default status for new websites
      },
    ])

    if (error) {
      toast({
        title: "Website Creation Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
        icon: <XCircle className="h-5 w-5" />,
      })
    } else {
      toast({
        title: "Website Created!",
        description: "Your website request has been submitted successfully.",
        variant: "default",
        icon: <CheckCircle className="h-5 w-5" />,
      })
      router.push("/user/dashboard") // Redirect to user dashboard
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
            <CardTitle className="font-plus-jakarta font-extrabold text-3xl mb-2">Create New Website</CardTitle>
            <p className="text-gray-600">Fill in the details for your new website project.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Website Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="My Awesome Website"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your website's purpose and features."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="plan">Select Plan</Label>
                <Select value={plan} onValueChange={setPlan} required>
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
                  type="text"
                  placeholder="e.g., Next.js, Tailwind CSS, Supabase"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="previewImage">Preview Image (Optional)</Label>
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
                <p className="text-xs text-gray-500 mt-1">Upload an image that represents your website idea.</p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create Website"}
                {!isSubmitting && <PlusCircle className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
