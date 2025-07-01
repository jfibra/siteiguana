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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, CheckCircle, XCircle, ArrowLeft, Palette, Layout, Users, Target } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export default function CreateWebsitePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic Information
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [primaryGoals, setPrimaryGoals] = useState("")

  // Design & Style
  const [colorScheme, setColorScheme] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#3B82F6")
  const [secondaryColor, setSecondaryColor] = useState("#10B981")
  const [accentColor, setAccentColor] = useState("#F59E0B")
  const [websiteStyle, setWebsiteStyle] = useState("")
  const [typography, setTypography] = useState("")
  const [layoutPreference, setLayoutPreference] = useState("")

  // Content & Features
  const [requiredPages, setRequiredPages] = useState<string[]>([])
  const [specialFeatures, setSpecialFeatures] = useState<string[]>([])
  const [contentProvided, setContentProvided] = useState("")
  const [socialMedia, setSocialMedia] = useState<string[]>([])

  // Technical & Business
  const [plan, setPlan] = useState("")
  const [domainPreference, setDomainPreference] = useState("")
  const [hostingRequirements, setHostingRequirements] = useState("")
  const [budgetRange, setBudgetRange] = useState("")
  const [timeline, setTimeline] = useState("")
  const [additionalRequirements, setAdditionalRequirements] = useState("")

  // Files
  const [previewImage, setPreviewImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

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
        router.push("/auth")
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

  const handleCheckboxChange = (
    value: string,
    checked: boolean,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (checked) {
      setter((prev) => [...prev, value])
    } else {
      setter((prev) => prev.filter((item) => item !== value))
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

    // Create comprehensive website request object
    const websiteData = {
      user_id: userId,
      title,
      description,
      plan,
      preview_image_url: imageUrl,
      status: "pending",
      // Store all the detailed information in a JSON field or separate fields
      business_type: businessType,
      target_audience: targetAudience,
      primary_goals: primaryGoals,
      color_scheme: colorScheme,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      website_style: websiteStyle,
      typography_preference: typography,
      layout_preference: layoutPreference,
      required_pages: requiredPages.join(", "),
      special_features: specialFeatures.join(", "),
      content_provided: contentProvided,
      social_media_integration: socialMedia.join(", "),
      domain_preference: domainPreference,
      hosting_requirements: hostingRequirements,
      budget_range: budgetRange,
      timeline_expectation: timeline,
      additional_requirements: additionalRequirements,
    }

    const { error } = await supabase.from("websites").insert([websiteData])

    if (error) {
      toast({
        title: "Website Creation Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
        icon: <XCircle className="h-5 w-5" />,
      })
    } else {
      toast({
        title: "Website Request Submitted!",
        description:
          "Your detailed website request has been submitted successfully. We'll review it and get back to you soon!",
        variant: "default",
        icon: <CheckCircle className="h-5 w-5" />,
      })
      router.push("/user/dashboard")
    }
    setIsSubmitting(false)
  }

  if (loading || !supabase) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/user/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Dream Website</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tell us everything about your vision, and we'll bring it to life. The more details you provide, the better
              we can serve you!
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Website Title *</Label>
                    <Input
                      id="title"
                      placeholder="My Amazing Business"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select value={businessType} onValueChange={setBusinessType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="nonprofit">Non-profit</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Website Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your website's purpose, what you do, and what makes you unique..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      placeholder="Young professionals, families, businesses..."
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryGoals">Primary Goals</Label>
                    <Input
                      id="primaryGoals"
                      placeholder="Generate leads, sell products, showcase work..."
                      value={primaryGoals}
                      onChange={(e) => setPrimaryGoals(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design & Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Design & Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="primaryColor"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="secondaryColor"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="accentColor"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        placeholder="#F59E0B"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="websiteStyle">Website Style & Vibe</Label>
                    <Select value={websiteStyle} onValueChange={setWebsiteStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern-minimalist">Modern & Minimalist</SelectItem>
                        <SelectItem value="bold-vibrant">Bold & Vibrant</SelectItem>
                        <SelectItem value="classic-elegant">Classic & Elegant</SelectItem>
                        <SelectItem value="playful-creative">Playful & Creative</SelectItem>
                        <SelectItem value="professional-corporate">Professional & Corporate</SelectItem>
                        <SelectItem value="artistic-unique">Artistic & Unique</SelectItem>
                        <SelectItem value="warm-friendly">Warm & Friendly</SelectItem>
                        <SelectItem value="tech-futuristic">Tech & Futuristic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="typography">Typography Preference</Label>
                    <Select value={typography} onValueChange={setTypography}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose typography style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clean-sans">Clean Sans-serif</SelectItem>
                        <SelectItem value="elegant-serif">Elegant Serif</SelectItem>
                        <SelectItem value="modern-geometric">Modern Geometric</SelectItem>
                        <SelectItem value="handwritten">Handwritten/Script</SelectItem>
                        <SelectItem value="bold-display">Bold Display</SelectItem>
                        <SelectItem value="mixed-fonts">Mixed Font Styles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="layoutPreference">Layout Preference</Label>
                  <Select value={layoutPreference} onValueChange={setLayoutPreference}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose layout style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-page">Single Page (All content on one page)</SelectItem>
                      <SelectItem value="multi-page-traditional">Multi-page Traditional</SelectItem>
                      <SelectItem value="grid-based">Grid-based Layout</SelectItem>
                      <SelectItem value="asymmetrical">Asymmetrical/Creative</SelectItem>
                      <SelectItem value="sidebar-navigation">Sidebar Navigation</SelectItem>
                      <SelectItem value="full-width">Full-width Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Content & Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layout className="w-5 h-5 mr-2" />
                  Content & Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Required Pages (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {[
                      "Home",
                      "About",
                      "Services",
                      "Products",
                      "Portfolio",
                      "Blog",
                      "Contact",
                      "Testimonials",
                      "FAQ",
                      "Privacy Policy",
                      "Terms",
                      "Team",
                    ].map((page) => (
                      <div key={page} className="flex items-center space-x-2">
                        <Checkbox
                          id={page}
                          checked={requiredPages.includes(page)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(page, checked as boolean, setRequiredPages)
                          }
                        />
                        <Label htmlFor={page} className="text-sm">
                          {page}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Special Features Needed</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {[
                      "Online Store/E-commerce",
                      "Booking System",
                      "Contact Forms",
                      "Live Chat",
                      "Newsletter Signup",
                      "Social Media Integration",
                      "Photo Gallery",
                      "Video Integration",
                      "Search Functionality",
                      "User Accounts/Login",
                      "Payment Processing",
                      "Multi-language Support",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={specialFeatures.includes(feature)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(feature, checked as boolean, setSpecialFeatures)
                          }
                        />
                        <Label htmlFor={feature} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="contentProvided">Content You'll Provide</Label>
                  <Textarea
                    id="contentProvided"
                    placeholder="Describe what content you have ready (text, images, videos, logos, etc.) and what you need help creating..."
                    value={contentProvided}
                    onChange={(e) => setContentProvided(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Social Media Platforms to Integrate</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {["Facebook", "Instagram", "Twitter", "LinkedIn", "YouTube", "TikTok", "Pinterest", "WhatsApp"].map(
                      (platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={platform}
                            checked={socialMedia.includes(platform)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(platform, checked as boolean, setSocialMedia)
                            }
                          />
                          <Label htmlFor={platform} className="text-sm">
                            {platform}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical & Business */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Technical & Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="plan">Select Plan *</Label>
                    <Select value={plan} onValueChange={setPlan} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic - $299</SelectItem>
                        <SelectItem value="standard">Standard - $599</SelectItem>
                        <SelectItem value="premium">Premium - $999</SelectItem>
                        <SelectItem value="enterprise">Enterprise - Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline Expectation</Label>
                    <Select value={timeline} onValueChange={setTimeline}>
                      <SelectTrigger>
                        <SelectValue placeholder="When do you need this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP (Rush job)</SelectItem>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="3-4-weeks">3-4 weeks</SelectItem>
                        <SelectItem value="1-2-months">1-2 months</SelectItem>
                        <SelectItem value="flexible">Flexible timeline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="domainPreference">Domain Preference</Label>
                    <Input
                      id="domainPreference"
                      placeholder="myawesomesite.com (if you have ideas)"
                      value={domainPreference}
                      onChange={(e) => setDomainPreference(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetRange">Budget Range</Label>
                    <Select value={budgetRange} onValueChange={setBudgetRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500">Under $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                        <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                        <SelectItem value="5000-plus">$5,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="hostingRequirements">Hosting Requirements</Label>
                  <Textarea
                    id="hostingRequirements"
                    placeholder="Any specific hosting needs, performance requirements, or technical specifications..."
                    value={hostingRequirements}
                    onChange={(e) => setHostingRequirements(e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalRequirements">Additional Requirements & Notes</Label>
                  <Textarea
                    id="additionalRequirements"
                    placeholder="Anything else you'd like us to know? Specific requests, concerns, inspiration websites, etc..."
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="previewImage">Inspiration Image or Logo (Optional)</Label>
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
                  <p className="text-xs text-gray-500 mt-1">
                    Upload any inspiration images, logos, or examples that represent your vision.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Your Request..." : "Submit Website Request"}
                {!isSubmitting && <PlusCircle className="ml-2 w-5 h-5" />}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                We'll review your request and get back to you within 24 hours with a detailed proposal!
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
