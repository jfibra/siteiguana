"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getPlansClient, type Plan } from "@/lib/supabase/get-plans-client"

export function PricingSection() {
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
        console.error("Failed to fetch plans:", err)
        setError("Failed to load pricing plans. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <section id="pricing" className="py-16 sm:py-24 bg-white text-center">
        <p>Loading pricing plans...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section id="pricing" className="py-16 sm:py-24 bg-white text-center text-red-500">
        <p>{error}</p>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Monthly Subscription Plans</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your monthly plan. All subscriptions include website hosting, SSL, ongoing maintenance, and monthly
            updates. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                plan.is_popular ? "border-green-500 ring-2 ring-green-500 ring-opacity-50" : "border-gray-200"
              } ${plan.is_popular ? "transform lg:scale-105" : ""}`}
            >
              {/* Popular Badge - uses plan.is_popular */}
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  {/* Displays long_description, falls back to description */}
                  <p className="text-gray-600 mb-4">{plan.long_description || plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                      {plan.is_custom ? "From $" : "$"}
                      {plan.monthly_price}
                    </span>
                    <span className="text-xl text-gray-500 ml-1">/month</span>
                  </div>
                  {plan.setup_fee && plan.setup_fee > 0 && (
                    <div className="text-sm text-gray-500 mt-1">+ ${plan.setup_fee} one-time setup</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">Billed monthly • Cancel anytime</div>
                </div>

                {/* Features List - iterates plan.features array */}
                <ul className="space-y-4 mb-8">
                  {plan.features?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${
                    plan.is_popular
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
                  }`}
                  asChild
                >
                  <Link href="/auth">{plan.is_custom ? "Contact Sales" : "Get Started"}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">
            All plans are monthly subscriptions with no long-term contracts. Includes 30-day money-back guarantee.
          </p>
          <p className="text-sm text-gray-500">
            Your subscription starts only after we approve your website request and you confirm payment.{" "}
            <Link href="/contact" className="text-green-600 hover:text-green-700 font-medium">
              Contact us
            </Link>{" "}
            for custom enterprise solutions.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
