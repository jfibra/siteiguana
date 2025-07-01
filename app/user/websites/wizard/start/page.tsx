"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Sparkles, Target, Palette, Globe, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function WizardStartPage() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const features = [
    {
      icon: Target,
      title: "Tailored to Your Vision",
      description: "Every question helps us understand your unique needs and goals",
    },
    {
      icon: Palette,
      title: "Professional Design",
      description: "Get a website that looks amazing and converts visitors into customers",
    },
    {
      icon: Globe,
      title: "Mobile-First Approach",
      description: "Your site will look perfect on every device, from phones to desktops",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with modern technology for speed and performance",
    },
  ]

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iguana-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button variant="outline" asChild className="mb-8 border-2 hover:bg-iguana-50">
            <Link href="/user/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="mb-8">
              <Image
                src="/site-iguana-logo-new.png"
                alt="Site Iguana"
                width={150}
                height={90}
                className="mx-auto mb-6"
              />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Let's Create Your
              <span className="block bg-gradient-to-r from-iguana-600 to-orange-500 bg-clip-text text-transparent">
                Dream Website
              </span>
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our step-by-step wizard will guide you through creating the perfect website for your business. It takes
              just 5 minutes to get started!
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:border-iguana-200 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Process Overview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-iguana-500 to-orange-500 text-white border-0 shadow-2xl">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4">Here's How It Works</h2>
                  <p className="text-xl text-white/90">Simple steps to your perfect website</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Tell Us About You</h3>
                    <p className="text-white/90">Share your business, goals, and vision</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Choose Your Style</h3>
                    <p className="text-white/90">Pick colors, layouts, and features you love</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">We Build It</h3>
                    <p className="text-white/90">Sit back while we create your masterpiece</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Card className="border-2 border-iguana-200 shadow-2xl">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  The wizard takes about 5 minutes to complete. You can save your progress and come back anytime.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={() => router.push("/user/websites/wizard/step-1")}
                    className="bg-gradient-to-r from-iguana-500 to-orange-500 hover:from-iguana-600 hover:to-orange-600 text-white font-bold text-xl px-12 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-6 h-6 mr-3" />
                    Start the Wizard
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  <p className="text-sm text-gray-500">⏱️ Takes about 5 minutes</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
