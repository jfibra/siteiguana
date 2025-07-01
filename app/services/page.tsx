"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, ArrowRight, Globe, ShoppingCart, Building, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getPlansClient, type Plan } from "@/lib/supabase/get-plans-client"

export default function ServicesPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getPlansClient()
        setPlans(plansData)
      } catch (error) {
        console.error("Error fetching plans:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const services = [
    {
      icon: <Globe className="h-12 w-12 text-green-600" />,
      title: "One-Page Websites",
      description:
        "Perfect for small businesses, freelancers, and personal brands who need a professional online presence.",
      features: ["Single scrolling page", "Contact forms", "Social media integration", "Mobile responsive"],
      id: "one-pager",
    },
    {
      icon: <Building className="h-12 w-12 text-green-600" />,
      title: "Business Websites",
      description: "Multi-page websites for established businesses that need to showcase their services and expertise.",
      features: ["Multiple pages", "Service showcases", "About & team pages", "Blog integration"],
      id: "informational",
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-green-600" />,
      title: "E-commerce Sites",
      description: "Full-featured online stores with payment processing, inventory management, and customer accounts.",
      features: ["Product catalogs", "Shopping cart", "Payment processing", "Order management"],
      id: "ecommerce",
    },
    {
      icon: <Zap className="h-12 w-12 text-green-600" />,
      title: "Custom Solutions",
      description: "Tailored websites with advanced functionality, integrations, and unique design requirements.",
      features: ["Custom development", "API integrations", "Advanced features", "Ongoing support"],
      id: "custom",
    },
  ]

  const handleGetStarted = (planId: string) => {
    router.push(`/user/websites/wizard/start?plan=${planId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">
              Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            From simple landing pages to complex e-commerce platforms, we create websites that help your business grow.
          </p>
          <Link href="#pricing">
            <Button className="iguana-button text-white px-8 py-3 text-lg">View Pricing</Button>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">Professional websites tailored to your business needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                id={service.id}
                className="border-0 shadow-xl hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    {service.icon}
                    <CardTitle className="text-2xl text-gray-900">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Transparent pricing with no hidden fees</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-0 shadow-xl hover:shadow-2xl transition-all bg-white ${plan.is_popular ? "ring-2 ring-green-500 scale-105" : ""}`}
              >
                {plan.is_popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.monthly_price}</span>
                    <span className="text-gray-600 ml-2">one-time</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  {plan.long_description && <p className="text-sm text-gray-500 mt-2">{plan.long_description}</p>}
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleGetStarted(String(plan.id))}
                    className={`w-full ${plan.is_popular ? "iguana-button text-white" : "border-green-600 text-green-600 hover:bg-green-50"} transition-all`}
                    variant={plan.is_popular ? "default" : "outline"}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">Simple, transparent, and efficient</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Discovery",
                description:
                  "We learn about your business, goals, and requirements through our detailed questionnaire.",
              },
              {
                step: "2",
                title: "Design & Build",
                description: "Our team creates your website using modern technologies and best practices.",
              },
              {
                step: "3",
                title: "Launch & Support",
                description: "We launch your site and provide ongoing support to ensure your success.",
              },
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-lg text-center bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join hundreds of businesses that trust Site Iguana for their online presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/user/websites/wizard/start">
              <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Start Your Website
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
