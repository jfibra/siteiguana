"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Edit, Globe, Palette, Layout, FileText, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { SupabaseClient } from "@supabase/supabase-js"
// import { sendWebsiteRequestConfirmation } from "@/lib/resend"

export default function WizardStep5Page() {
  const router = useRouter()
  const [wizardData, setWizardData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

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
          description: "Please log in to submit your website request.",
          variant: "destructive",
        })
        router.push("/auth")
      }
    }
    fetchUser()
  }, [supabase, router, toast])

  useEffect(() => {
    // Load all wizard data from localStorage
    const savedData = localStorage.getItem("websiteWizardData")
    if (savedData) {
      setWizardData(JSON.parse(savedData))
    } else {
      // If no data, redirect to start
      router.push("/user/websites/wizard/start")
    }
  }, [router])

  const uploadLogo = async (file: File, websiteId: string): Promise<string | null> => {
    if (!supabase || !userId) return null

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `logo-${websiteId}-${Date.now()}.${fileExt}`
      const filePath = `${userId}/websites/${websiteId}/${fileName}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage.from("websites_assets").upload(filePath, file)

      if (error) {
        console.error("Storage upload error:", error)
        return null
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("websites_assets").getPublicUrl(filePath)

      return urlData?.publicUrl || null
    } catch (error) {
      console.error("Logo upload error:", error)
      return null
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      if (!supabase || !userId) {
        throw new Error("Authentication required")
      }

      // Prepare the website data for database insertion
      const websiteData = {
        user_id: userId,
        title: wizardData.step1?.businessName || "Untitled Website",
        description: wizardData.step1?.description || "",
        business_type: wizardData.step1?.businessType || "",
        target_audience: wizardData.step1?.targetAudience || "",
        primary_goals: wizardData.step1?.primaryGoal || "",

        // Design & Style
        color_scheme: wizardData.step2?.colorScheme || "",
        website_style: wizardData.step2?.websiteStyle || "",
        layout_preference: wizardData.step2?.layoutPreference || "",

        // Features & Pages
        required_pages: wizardData.step3?.pages?.join(", ") || "",
        special_features: wizardData.step3?.features?.join(", ") || "",
        social_media_integration: wizardData.step3?.integrations?.join(", ") || "",

        // Content & Assets - using additional_requirements for content description
        content_provided: wizardData.step4?.contentReady || "",
        timeline_expectation: wizardData.step4?.timeline || "",
        budget_range: wizardData.step4?.budget || "",

        // Combine content description and special requests into additional_requirements
        additional_requirements: [
          wizardData.step4?.contentDescription ? `Content Description: ${wizardData.step4.contentDescription}` : "",
          wizardData.step4?.specialRequests ? `Special Requests: ${wizardData.step4.specialRequests}` : "",
          wizardData.step4?.socialMediaLinks
            ? `Social Media: ${JSON.stringify(wizardData.step4.socialMediaLinks)}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n"),

        // Status and metadata
        status: "pending",
        tech_stack: "Next.js, Tailwind CSS", // Default tech stack
        created_at: new Date().toISOString(),
      }

      // Insert the website request into the database
      const { data, error } = await supabase.from("websites").insert([websiteData]).select().single()

      if (error) {
        throw error
      }

      // After successful database insertion (around line 120, after the website is inserted)
      // Send confirmation email via server route
      try {
        const userEmail = (await supabase.auth.getUser()).data.user?.email
        const userName = wizardData.step1?.businessName || "User"

        if (userEmail) {
          await fetch("/api/website-request/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              userName,
              websiteTitle: wizardData.step1?.businessName || "Your Website",
              requestId: data.id,
            }),
          })
        }
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError)
        // Continue without failing the submission
      }

      // Handle logo upload if provided
      if (wizardData.step4?.logoFile && data) {
        try {
          const logoUrl = await uploadLogo(wizardData.step4.logoFile, data.id.toString())

          if (logoUrl) {
            // Update the website record with the logo URL
            await supabase.from("websites").update({ preview_image_url: logoUrl }).eq("id", data.id)
          }
        } catch (logoError) {
          console.error("Logo upload failed:", logoError)
          // Don't fail the entire submission for logo upload issues
          toast({
            title: "Logo Upload Warning",
            description: "Your request was submitted but the logo upload failed. You can upload it later.",
            variant: "default",
          })
        }
      }

      // Clear wizard data from localStorage after successful submission
      localStorage.removeItem("websiteWizardData")

      // Show success toast
      toast({
        title: "Website Request Submitted!",
        description: "We'll review your request and get back to you within 24 hours.",
        variant: "default",
      })

      // Redirect to success page
      router.push("/user/websites/wizard/success")
    } catch (error: any) {
      console.error("Submission error:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (step: number) => {
    router.push(`/user/websites/wizard/step-${step}`)
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iguana-500"></div>
      </div>
    )
  }

  const getColorSchemeDisplay = (value: string) => {
    const schemes: { [key: string]: { name: string; colors: string[] } } = {
      "professional-blue": { name: "Professional Blue", colors: ["#1e40af", "#3b82f6", "#60a5fa"] },
      "nature-green": { name: "Nature Green", colors: ["#059669", "#10b981", "#34d399"] },
      "warm-orange": { name: "Warm Orange", colors: ["#ea580c", "#f97316", "#fb923c"] },
      "elegant-purple": { name: "Elegant Purple", colors: ["#7c3aed", "#8b5cf6", "#a78bfa"] },
      "modern-gray": { name: "Modern Gray", colors: ["#374151", "#6b7280", "#9ca3af"] },
      "bold-red": { name: "Bold Red", colors: ["#dc2626", "#ef4444", "#f87171"] },
    }
    return schemes[value] || { name: value, colors: [] }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6 border-2 hover:bg-iguana-50">
            <Link href="/user/websites/wizard/step-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-iguana-600">Step 5 of 5</span>
              <span className="text-sm text-gray-500">Review & Submit</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-iguana-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="shadow-2xl border-2 border-gray-100">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Review Your Website Request</CardTitle>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Please review all the details below. You can edit any section by clicking the edit button.
                </p>
              </CardHeader>
              <CardContent className="p-12">
                <div className="space-y-8">
                  {/* Step 1: Business Information */}
                  <Card className="border-2 border-gray-100">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">Business Information</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(1)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Business Name</h4>
                          <p className="text-gray-600">{wizardData.step1?.businessName || "Not specified"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Business Type</h4>
                          <p className="text-gray-600">{wizardData.step1?.businessType || "Not specified"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                          <p className="text-gray-600">{wizardData.step1?.description || "Not specified"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Target Audience</h4>
                          <p className="text-gray-600">{wizardData.step1?.targetAudience || "Not specified"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Primary Goal</h4>
                          <p className="text-gray-600">{wizardData.step1?.primaryGoal || "Not specified"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 2: Design & Style */}
                  <Card className="border-2 border-gray-100">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <Palette className="w-5 h-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">Design & Style</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(2)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Color Scheme</h4>
                          {wizardData.step2?.colorScheme ? (
                            <div className="flex items-center space-x-3">
                              <div className="flex space-x-1">
                                {getColorSchemeDisplay(wizardData.step2.colorScheme).colors.map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: color }}
                                  ></div>
                                ))}
                              </div>
                              <span className="text-gray-600">
                                {getColorSchemeDisplay(wizardData.step2.colorScheme).name}
                              </span>
                            </div>
                          ) : (
                            <p className="text-gray-600">Not specified</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Website Style</h4>
                          <p className="text-gray-600">
                            {wizardData.step2?.websiteStyle
                              ?.replace(/-/g, " ")
                              .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Layout Preference</h4>
                          <p className="text-gray-600">
                            {wizardData.step2?.layoutPreference
                              ?.replace(/-/g, " ")
                              .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 3: Features & Pages */}
                  <Card className="border-2 border-gray-100">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Layout className="w-5 h-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">Features & Pages</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(3)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Selected Pages</h4>
                          <div className="flex flex-wrap gap-2">
                            {wizardData.step3?.pages?.map((page: string) => (
                              <Badge key={page} variant="outline" className="text-sm">
                                {page.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </Badge>
                            )) || <span className="text-gray-600">No pages selected</span>}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Selected Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {wizardData.step3?.features?.map((feature: string) => (
                              <Badge key={feature} variant="outline" className="text-sm bg-blue-50">
                                {feature.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </Badge>
                            )) || <span className="text-gray-600">No features selected</span>}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Integrations</h4>
                          <div className="flex flex-wrap gap-2">
                            {wizardData.step3?.integrations?.map((integration: string) => (
                              <Badge key={integration} variant="outline" className="text-sm bg-purple-50">
                                {integration.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </Badge>
                            )) || <span className="text-gray-600">No integrations selected</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 4: Content & Assets */}
                  <Card className="border-2 border-gray-100">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <CardTitle className="text-xl">Content & Assets</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(4)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Content Readiness</h4>
                          <p className="text-gray-600">
                            {wizardData.step4?.contentReady
                              ?.replace(/-/g, " ")
                              .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <p className="text-gray-600">
                              {wizardData.step4?.timeline
                                ?.replace(/-/g, " ")
                                .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Budget Range</h4>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <p className="text-gray-600">
                              {wizardData.step4?.budget
                                ?.replace(/-/g, " ")
                                .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Logo Uploaded</h4>
                          <p className="text-gray-600">{wizardData.step4?.logoFile ? "Yes" : "No"}</p>
                        </div>
                        {wizardData.step4?.contentDescription && (
                          <div className="md:col-span-2">
                            <h4 className="font-semibold text-gray-900 mb-2">Content Description</h4>
                            <p className="text-gray-600">{wizardData.step4.contentDescription}</p>
                          </div>
                        )}
                        {wizardData.step4?.specialRequests && (
                          <div className="md:col-span-2">
                            <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                            <p className="text-gray-600">{wizardData.step4.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Submit Section */}
                <div className="mt-12 pt-8 border-t-2 border-gray-100">
                  <Card className="bg-gradient-to-r from-iguana-500 to-orange-500 text-white border-0">
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-4">Ready to Submit Your Website Request?</h3>
                      <p className="text-lg text-white/90 mb-6">
                        We'll review your request and get back to you within 24 hours with a detailed proposal and
                        timeline.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          size="lg"
                          className="bg-white text-iguana-600 hover:bg-gray-100 text-xl px-12 py-6 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Website Request"}
                          {!isSubmitting && <CheckCircle className="w-6 h-6 ml-3" />}
                        </Button>
                        {isSubmitting && (
                          <div className="flex items-center space-x-2 text-white/90">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing your request...</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
