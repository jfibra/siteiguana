"use client"

import { useEffect, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PayPalButton } from "@/components/paypal-button"
import { Check, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Plan {
  id: number
  name: string
  description: string
  monthly_price: number
  setup_fee: number
  edit_limit: number
  is_custom: boolean
  status: string
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    fetchPlans()
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setIsAuthenticated(!!session)
  }

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("status", "active")
        .order("monthly_price", { ascending: true })

      if (error) throw error
      setPlans(data || [])
    } catch (error) {
      console.error("Error fetching plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (details: any) => {
    router.push("/user/dashboard?payment=success")
  }

  const handleSelectPlan = (planId: number) => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/pricing")
      return
    }
    setSelectedPlan(selectedPlan === planId ? null : planId)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading plans...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your website needs. All plans include ongoing support and maintenance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.is_custom ? "border-blue-500 shadow-lg" : ""}`}>
            {plan.is_custom && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.monthly_price}</span>
                <span className="text-gray-600">/month</span>
                {plan.setup_fee > 0 && <div className="text-sm text-gray-500 mt-1">+ ${plan.setup_fee} setup fee</div>}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Up to {plan.edit_limit} edits per month</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Mobile Responsive</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">SSL Certificate</span>
                </div>
              </div>

              <div className="pt-4">
                {selectedPlan === plan.id ? (
                  <div className="space-y-4">
                    <PayPalButton
                      planId={plan.id}
                      amount={plan.monthly_price + plan.setup_fee}
                      planName={plan.name}
                      onSuccess={handlePaymentSuccess}
                    />
                    <Button variant="outline" className="w-full" onClick={() => setSelectedPlan(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSelectPlan(plan.id)}
                    variant={plan.is_custom ? "default" : "outline"}
                  >
                    {isAuthenticated ? "Select Plan" : "Login to Select"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isAuthenticated && (
        <div className="text-center mt-8">
          <p className="text-gray-600">
            <Button variant="link" onClick={() => router.push("/auth/login")}>
              Login
            </Button>
            {" or "}
            <Button variant="link" onClick={() => router.push("/auth/register")}>
              Register
            </Button>
            {" to select a plan"}
          </p>
        </div>
      )}
    </div>
  )
}
