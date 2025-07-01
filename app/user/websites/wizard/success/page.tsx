"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, CreditCard, Eye, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function WizardSuccessPage() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-iguana-50 via-white to-orange-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card className="shadow-2xl border-2 border-gray-100 overflow-hidden">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-iguana-500 to-orange-500 text-white p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-4xl font-bold mb-4"
                >
                  🎉 Website Request Submitted Successfully!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-xl text-white/90"
                >
                  Thank you for choosing Site Iguana! We're excited to bring your vision to life.
                </motion.p>
              </div>

              <CardContent className="p-12">
                {/* What Happens Next */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What Happens Next?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">1. Review & Approval</h3>
                      <p className="text-gray-600">
                        Our team will review your request and approve your website proposal within 24 hours.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">2. Choose Subscription</h3>
                      <p className="text-gray-600">
                        Once approved, select your monthly subscription plan and set up payment to begin development.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">3. We Build Your Site!</h3>
                      <p className="text-gray-600">
                        After payment setup, we'll start building your website and provide regular updates.
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Status Tracking */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Track Your Request Status</h3>
                  <p className="text-gray-700 mb-4">
                    You can check the status of your website request anytime from your dashboard. We'll update you as we
                    progress through each stage:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-center font-semibold">
                      Pending Review
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-center font-semibold">
                      Approved
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-center font-semibold">
                      In Development
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-center font-semibold">
                      Live
                    </div>
                  </div>
                  <p className="text-gray-700">
                    <strong>Important:</strong> Your monthly subscription will only begin after you approve the proposal
                    and set up payment.
                  </p>
                </motion.div>

                {/* Subscription Information */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">💳 About Your Subscription</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Monthly Subscription Plans</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>
                          • <strong>Basic:</strong> $99/month - Perfect for small businesses
                        </li>
                        <li>
                          • <strong>Standard:</strong> $199/month - Growing businesses
                        </li>
                        <li>
                          • <strong>Premium:</strong> $399/month - Enterprise features
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Website hosting & SSL certificate</li>
                        <li>• Monthly content updates</li>
                        <li>• 24/7 technical support</li>
                        <li>• Performance monitoring</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600">
                      <strong>No Hidden Fees:</strong> Cancel anytime, no long-term contracts. Your subscription starts
                      only after you approve our proposal.
                    </p>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.9, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Button
                    onClick={() => router.push("/user/dashboard")}
                    size="lg"
                    className="bg-gradient-to-r from-iguana-500 to-orange-500 hover:from-iguana-600 hover:to-orange-600 text-white font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Check Request Status
                  </Button>
                  <Button
                    onClick={() => router.push("/user/support")}
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-4 border-2"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contact Support
                  </Button>
                </motion.div>

                {/* Additional Help */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1, duration: 0.6 }}
                  className="text-center mt-8 pt-8 border-t border-gray-200"
                >
                  <p className="text-gray-600">
                    Questions about our subscription plans?{" "}
                    <button
                      onClick={() => router.push("/pricing")}
                      className="text-iguana-600 hover:text-iguana-700 font-semibold underline"
                    >
                      View detailed pricing
                    </button>
                    {" or "}
                    <button
                      onClick={() => router.push("/contact")}
                      className="text-iguana-600 hover:text-iguana-700 font-semibold underline"
                    >
                      contact our team
                    </button>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
