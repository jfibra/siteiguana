"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Palette } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function WizardStep2Page() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    colorScheme: "",
    websiteStyle: "",
    layoutPreference: "",
  })

  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("websiteWizardData")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setFormData((prev) => ({ ...prev, ...parsed.step2 }))
    }
  }, [])

  useEffect(() => {
    // Check if form is valid
    const { colorScheme, websiteStyle } = formData
    setIsValid(colorScheme !== "" && websiteStyle !== "")
  }, [formData])

  const handleNext = () => {
    // Save data to localStorage
    const existingData = JSON.parse(localStorage.getItem("websiteWizardData") || "{}")
    const updatedData = {
      ...existingData,
      step2: formData,
      currentStep: 3,
    }
    localStorage.setItem("websiteWizardData", JSON.stringify(updatedData))
    router.push("/user/websites/wizard/step-3")
  }

  const colorSchemes = [
    {
      name: "Professional Blue",
      value: "professional-blue",
      colors: ["#1e40af", "#3b82f6", "#60a5fa"],
      description: "Trust and reliability",
    },
    {
      name: "Nature Green",
      value: "nature-green",
      colors: ["#059669", "#10b981", "#34d399"],
      description: "Growth and harmony",
    },
    {
      name: "Warm Orange",
      value: "warm-orange",
      colors: ["#ea580c", "#f97316", "#fb923c"],
      description: "Energy and creativity",
    },
    {
      name: "Elegant Purple",
      value: "elegant-purple",
      colors: ["#7c3aed", "#8b5cf6", "#a78bfa"],
      description: "Luxury and sophistication",
    },
    {
      name: "Modern Gray",
      value: "modern-gray",
      colors: ["#374151", "#6b7280", "#9ca3af"],
      description: "Clean and minimal",
    },
    {
      name: "Bold Red",
      value: "bold-red",
      colors: ["#dc2626", "#ef4444", "#f87171"],
      description: "Power and passion",
    },
  ]

  const websiteStyles = [
    {
      name: "Modern & Minimalist",
      value: "modern-minimalist",
      description: "Clean lines, lots of white space, simple navigation",
    },
    {
      name: "Bold & Vibrant",
      value: "bold-vibrant",
      description: "Eye-catching colors, dynamic layouts, strong visuals",
    },
    {
      name: "Classic & Professional",
      value: "classic-professional",
      description: "Traditional layouts, conservative colors, business-focused",
    },
    {
      name: "Creative & Artistic",
      value: "creative-artistic",
      description: "Unique layouts, creative elements, expressive design",
    },
    {
      name: "Tech & Futuristic",
      value: "tech-futuristic",
      description: "Modern tech feel, sleek interfaces, innovative design",
    },
    {
      name: "Warm & Friendly",
      value: "warm-friendly",
      description: "Welcoming colors, approachable design, personal touch",
    },
  ]

  const layoutPreferences = [
    {
      name: "Single Page",
      value: "single-page",
      description: "Everything on one scrolling page",
    },
    {
      name: "Multi-Page Traditional",
      value: "multi-page",
      description: "Separate pages with navigation menu",
    },
    {
      name: "Grid-Based",
      value: "grid-based",
      description: "Organized in neat grid layouts",
    },
    {
      name: "Full-Width Design",
      value: "full-width",
      description: "Content spans the full browser width",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6 border-2 hover:bg-iguana-50">
            <Link href="/user/websites/wizard/step-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-iguana-600">Step 2 of 5</span>
              <span className="text-sm text-gray-500">Design & Style</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-iguana-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="shadow-2xl border-2 border-gray-100">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Choose Your Style</CardTitle>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Let's make your website look amazing. Pick the colors and style that represent your brand.
                </p>
              </CardHeader>
              <CardContent className="p-12">
                <div className="space-y-12">
                  {/* Color Scheme */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Color Scheme *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {colorSchemes.map((scheme) => (
                        <div
                          key={scheme.value}
                          onClick={() => setFormData((prev) => ({ ...prev, colorScheme: scheme.value }))}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            formData.colorScheme === scheme.value
                              ? "border-iguana-500 bg-iguana-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex space-x-2 mb-4">
                            {scheme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: color }}
                              ></div>
                            ))}
                          </div>
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{scheme.name}</h4>
                          <p className="text-gray-600">{scheme.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Website Style */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Website Style *</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {websiteStyles.map((style) => (
                        <div
                          key={style.value}
                          onClick={() => setFormData((prev) => ({ ...prev, websiteStyle: style.value }))}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            formData.websiteStyle === style.value
                              ? "border-iguana-500 bg-iguana-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{style.name}</h4>
                          <p className="text-gray-600">{style.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Layout Preference */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Layout Preference</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {layoutPreferences.map((layout) => (
                        <div
                          key={layout.value}
                          onClick={() => setFormData((prev) => ({ ...prev, layoutPreference: layout.value }))}
                          className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                            formData.layoutPreference === layout.value
                              ? "border-iguana-500 bg-iguana-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{layout.name}</h4>
                          <p className="text-gray-600">{layout.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-gray-100">
                  <Button variant="outline" asChild className="text-lg px-8 py-4 border-2">
                    <Link href="/user/websites/wizard/step-1">
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
