"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WizardStep1Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    description: "",
    targetAudience: "",
    primaryGoal: "",
  })

  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("websiteWizardData")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setFormData((prev) => ({ ...prev, ...parsed.step1 }))
    }
  }, [])

  useEffect(() => {
    // Check if form is valid
    const { businessName, businessType, description } = formData
    setIsValid(businessName.trim() !== "" && businessType !== "" && description.trim() !== "")
  }, [formData])

  const handleNext = () => {
    // Save data to localStorage
    const existingData = JSON.parse(localStorage.getItem("websiteWizardData") || "{}")
    const updatedData = {
      ...existingData,
      step1: formData,
      currentStep: 2,
    }
    localStorage.setItem("websiteWizardData", JSON.stringify(updatedData))
    router.push("/user/websites/wizard/step-2")
  }

  const businessTypes = [
    "Restaurant & Food Service",
    "E-commerce & Retail",
    "Professional Services",
    "Healthcare & Medical",
    "Real Estate",
    "Education & Training",
    "Technology & Software",
    "Creative & Design",
    "Fitness & Wellness",
    "Non-profit Organization",
    "Manufacturing",
    "Consulting",
    "Other",
  ]

  const primaryGoals = [
    "Generate leads and inquiries",
    "Sell products online",
    "Showcase my work/portfolio",
    "Provide information about services",
    "Build brand awareness",
    "Accept bookings/appointments",
    "Share content and blog posts",
    "Collect donations",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6 border-2 hover:bg-iguana-50">
            <Link href="/user/websites/wizard/start">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-iguana-600">Step 1 of 5</span>
              <span className="text-sm text-gray-500">About Your Business</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-iguana-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "20%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="shadow-2xl border-2 border-gray-100">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Tell Us About Your Business</CardTitle>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Help us understand what you do and who you serve so we can create the perfect website for you.
                </p>
              </CardHeader>
              <CardContent className="p-12">
                <div className="space-y-8">
                  {/* Business Name */}
                  <div>
                    <Label htmlFor="businessName" className="text-lg font-semibold text-gray-900 mb-3 block">
                      What's your business name? *
                    </Label>
                    <Input
                      id="businessName"
                      placeholder="e.g., Acme Restaurant, John's Consulting, etc."
                      value={formData.businessName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, businessName: e.target.value }))}
                      className="text-lg p-4 border-2 focus:border-iguana-500"
                    />
                  </div>

                  {/* Business Type */}
                  <div>
                    <Label htmlFor="businessType" className="text-lg font-semibold text-gray-900 mb-3 block">
                      What type of business is it? *
                    </Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}
                    >
                      <SelectTrigger className="text-lg p-4 border-2 focus:border-iguana-500">
                        <SelectValue placeholder="Choose your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type} className="text-lg py-3">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-lg font-semibold text-gray-900 mb-3 block">
                      Describe what you do *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your business, what makes you unique, and what you offer..."
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="text-lg p-4 border-2 focus:border-iguana-500 resize-none"
                    />
                  </div>

                  {/* Target Audience */}
                  <div>
                    <Label htmlFor="targetAudience" className="text-lg font-semibold text-gray-900 mb-3 block">
                      Who are your ideal customers?
                    </Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., Young professionals, families with kids, small business owners..."
                      value={formData.targetAudience}
                      onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                      className="text-lg p-4 border-2 focus:border-iguana-500"
                    />
                  </div>

                  {/* Primary Goal */}
                  <div>
                    <Label htmlFor="primaryGoal" className="text-lg font-semibold text-gray-900 mb-3 block">
                      What's your main goal for this website?
                    </Label>
                    <Select
                      value={formData.primaryGoal}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, primaryGoal: value }))}
                    >
                      <SelectTrigger className="text-lg p-4 border-2 focus:border-iguana-500">
                        <SelectValue placeholder="Choose your primary goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {primaryGoals.map((goal) => (
                          <SelectItem key={goal} value={goal} className="text-lg py-3">
                            {goal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-gray-100">
                  <Button variant="outline" asChild className="text-lg px-8 py-4 border-2">
                    <Link href="/user/websites/wizard/start">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Link>
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!isValid}
                    className="bg-gradient-to-r from-iguana-500 to-orange-500 hover:from-iguana-600 hover:to-orange-600 text-white font-bold text-lg px-12 py-4 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
