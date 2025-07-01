"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, DollarSign, Check } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getPlansClient, type Plan } from "@/lib/supabase/get-plans-client"

export default function WizardStep4Page() {
  const router = useRouter()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedPlans = await getPlansClient()
        setPlans(fetchedPlans)
      } catch (err) {
        console.error("Failed to fetch plans for wizard step 4:", err)
        setError("Failed to load pricing plans. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("websiteWizardData")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setSelectedPlanId(parsed.step4?.selectedPlanId || null)
    }
  }, [])

  const handleNext = () => {
    if (selectedPlanId) {
      // Save data to localStorage
      const existingData = JSON.parse(localStorage.getItem("websiteWizardData") || "{}")
      const updatedData = {
        ...existingData,
        step4: { selectedPlanId },
        currentStep: 5,
      }
      localStorage.setItem("websiteWizardData", JSON.stringify(updatedData))
      router.push("/user/websites/wizard/step-5")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50 flex items-center justify-center">
        <p>Loading pricing plans...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50 flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-6 border-2 hover:bg-iguana-50">
            <Link href="/user/websites/wizard/step-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-iguana-600">Step 4 of 5</span>
              <span className="text-sm text-gray-500">Choose Your Plan</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-iguana-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="shadow-2xl border-2 border-gray-100">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-iguana-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-4xl font-bold text-gray-900 mb-4">Select Your Pricing Plan</CardTitle>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose the plan that best fits your website needs and budget.
                </p>
              </CardHeader>
              <CardContent className="p-12">
                <RadioGroup
                  value={selectedPlanId || ""}
                  onValueChange={setSelectedPlanId}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Label
                        htmlFor={`plan-${plan.id}`}
                        className={`flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedPlanId === String(plan.id)
                            ? "border-iguana-500 bg-iguana-50 shadow-lg"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
                          <RadioGroupItem
                            value={String(plan.id)}
                            id={`plan-${plan.id}`}
                            className="w-6 h-6 text-iguana-500 border-iguana-500"
                          />
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{plan.long_description || plan.description}</p>
                        <div className="flex items-baseline mb-4">
                          <span className="text-4xl font-bold text-gray-900">
                            {plan.is_custom ? "From $" : "$"}
                            {plan.monthly_price}
                          </span>
                          <span className="text-lg text-gray-500 ml-1">/month</span>
                        </div>
                        {plan.setup_fee && plan.setup_fee > 0 && (
                          <p className="text-sm text-gray-500 mb-4">${plan.setup_fee} setup fee</p>
                        )}
                        <ul className="space-y-2 text-sm text-gray-700">
                          {plan.features?.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {plan.edit_limit > 0 && plan.edit_limit !== -1 && (
                            <li className="flex items-center">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {plan.edit_limit} monthly content edits
                            </li>
                          )}
                          {plan.edit_limit === -1 && (
                            <li className="flex items-center">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              Unlimited monthly content edits
                            </li>
                          )}
                        </ul>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-gray-100">
                  <Button variant="outline" asChild className="text-lg px-8 py-4 border-2">
                    <Link href="/user/websites/wizard/step-3">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Link>
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!selectedPlanId}
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
