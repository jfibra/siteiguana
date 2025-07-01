"use client"

import { motion } from "framer-motion"
import { MessageSquare, Palette, Rocket, Headphones } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Tell Us Your Vision",
    description: "Share your business goals, style preferences, and requirements through our simple form.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Palette,
    title: "We Design & Build",
    description: "Our team creates a custom Next.js website tailored to your brand and optimized for performance.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Rocket,
    title: "Launch & Grow",
    description: "Your site goes live with full hosting, SSL, and performance monitoring included.",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    description: "We handle updates, maintenance, and improvements so you can focus on your business.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From concept to launch, we handle everything. Your website evolves naturally with your business needs.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 z-10">
                {index + 1}
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                {/* Icon */}
                <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>

              {/* Connector Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gray-200 z-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">Ready to get started? Your website can be live in just 24 hours.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
