"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function CTASection() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/user/websites/wizard/start")
  }

  const handleViewPricing = () => {
    router.push("/services#pricing")
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-orange-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <img src="/iguana-leaf-pattern.png" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <Sparkles className="h-12 w-12 text-white" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Online Presence?</h2>

          <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
            Join hundreds of businesses that chose Site Iguana for their professional website. Get started today and see
            your vision come to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Website Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              onClick={handleViewPricing}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
            >
              View Pricing
            </Button>
          </div>

          <div className="mt-8 text-green-100">
            <p className="text-sm">✨ No setup fees • 🚀 Fast delivery • 📱 Mobile optimized • 🔒 Secure hosting</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
