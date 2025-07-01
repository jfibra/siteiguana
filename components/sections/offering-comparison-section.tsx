"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const comparisonData = [
  {
    service: "Design & Build",
    agency: true,
    subscription: true,
    description: "Custom-built websites tailored to your brand and business goals.",
  },
  {
    service: "Monthly Edits",
    agency: false,
    subscription: true,
    description: "We handle updates, content changes, and minor layout adjustments so you don’t have to.",
  },
  {
    service: "Hosting & SSL",
    agency: false,
    subscription: true,
    description: "Secure, fast hosting and SSL certificates included in your monthly plan.",
  },
  {
    service: "Ongoing Support",
    agency: false,
    subscription: true,
    description: "Dedicated support for any questions or issues, ensuring your site runs smoothly.",
  },
  {
    service: "No Upfront Cost",
    agency: false,
    subscription: true,
    description: "Avoid large initial investments with our affordable monthly subscription model.",
  },
  {
    service: "Cancel Anytime",
    agency: false,
    subscription: true,
    description: "Flexibility to cancel your subscription at any time without hidden fees.",
  },
]

export function OfferingComparisonSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-plus-jakarta font-extrabold text-4xl md:text-6xl mb-6">
            Why Our <span className="gradient-text">Subscription Model</span> Wins
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare our flexible, all-inclusive service with traditional web agencies.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <Card className="min-w-[600px] rounded-xl shadow-lg">
            <CardHeader className="grid grid-cols-3 gap-4 border-b pb-4">
              <CardTitle className="text-lg font-semibold text-gray-700">Service</CardTitle>
              <CardTitle className="text-lg font-semibold text-center text-gray-700">One-Time Web Agency</CardTitle>
              <CardTitle className="text-lg font-semibold text-center text-blue-600">Our Subscription Model</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {comparisonData.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-4 items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.service}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex justify-center">
                    {item.agency ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <X className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex justify-center">
                    {item.subscription ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <X className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
