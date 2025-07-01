"use client"

import { motion } from "framer-motion"
import { DollarSign, Clock, Users, Zap, Shield, Headphones } from "lucide-react"

const benefits = [
  {
    icon: DollarSign,
    title: "No Large Upfront Costs",
    description: "Start with just a monthly subscription. No need to pay thousands upfront for website development.",
  },
  {
    icon: Clock,
    title: "Ongoing Maintenance Included",
    description: "We handle all updates, security patches, and maintenance so you can focus on your business.",
  },
  {
    icon: Users,
    title: "Dedicated Support Team",
    description: "Get direct access to our team of web experts whenever you need help or have questions.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Get your website live in days, not weeks. Our streamlined process gets you online quickly.",
  },
  {
    icon: Shield,
    title: "Always Up-to-Date",
    description:
      "Your site stays current with the latest web standards, security updates, and performance optimizations.",
  },
  {
    icon: Headphones,
    title: "Unlimited Revisions",
    description: "Make changes anytime. Our subscription includes ongoing updates and improvements to your site.",
  },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-16 sm:py-24 bg-gradient-to-br from-green-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Subscription Model?
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Traditional web development requires huge upfront investments and leaves you on your own for maintenance.
            Our subscription model changes everything.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <benefit.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
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
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of businesses who've made the smart choice with our subscription model.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                Start Your Website Today
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-50 text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 transition-colors"
              >
                Schedule a Consultation
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
