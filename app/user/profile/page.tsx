"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Building, Save, Calendar, Users, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { SupabaseClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

interface UserProfile {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  company_name: string
  profile_image: string
  gender: string
  birthday: string
}

export default function UserProfilePage() {
  const { toast } = useToast()

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    profile_image: "",
    gender: "",
    birthday: "",
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setSupabase(getSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    async function fetchUserProfile() {
      if (!supabase) return

      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        const { data, error } = await supabase
          .from("users")
          .select("first_name, last_name, phone_number, company_name, profile_image, gender, birthday")
          .eq("id", user.id)
          .single()

        if (error) {
          toast({
            title: "Error",
            description: `Failed to load profile: ${error.message}`,
            variant: "destructive",
          })
        } else if (data) {
          setProfile({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: user.email || "",
            phone_number: data.phone_number || "",
            company_name: data.company_name || "",
            profile_image: data.profile_image || "",
            gender: data.gender || "",
            birthday: data.birthday || "",
          })
        }
      }
      setLoading(false)
    }
    fetchUserProfile()
  }, [supabase, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfile({ ...profile, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!userId || !supabase) {
      toast({
        title: "Error",
        description: "User ID or Supabase client not found. Please log in again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number || null,
        company_name: profile.company_name || null,
        gender: profile.gender || null,
        birthday: profile.birthday || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      toast({
        title: "Update Failed",
        description: `Failed to update profile: ${updateError.message}`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      })
    }
    setIsSubmitting(false)
  }

  if (loading || !supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/user/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your personal and company information.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card className="shadow-xl rounded-xl">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center gap-4">
                <div>
                  <CardTitle className="text-2xl mb-1">
                    {profile.first_name} {profile.last_name}
                  </CardTitle>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name *</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="first_name"
                          name="first_name"
                          type="text"
                          value={profile.first_name}
                          onChange={handleInputChange}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="last_name">Last Name *</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="last_name"
                          name="last_name"
                          type="text"
                          value={profile.last_name}
                          onChange={handleInputChange}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        className="pl-9 bg-gray-100 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <div className="relative mt-1">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                        <Select value={profile.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="birthday">Birthday</Label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="birthday"
                          name="birthday"
                          type="date"
                          value={profile.birthday}
                          onChange={handleInputChange}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={profile.phone_number}
                        onChange={handleInputChange}
                        className="pl-9"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Company Information</h3>

                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <div className="relative mt-1">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="company_name"
                        name="company_name"
                        type="text"
                        value={profile.company_name}
                        onChange={handleInputChange}
                        className="pl-9"
                        placeholder="Your Company Inc."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <Save className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/user/dashboard">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
