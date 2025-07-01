"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedIguana } from "@/components/iguana/animated-iguana"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <AnimatedIguana size={200} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-3xl font-plus-jakarta font-bold text-gray-800 mb-4">Oops! This iguana got lost</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Even our smartest iguana couldn't find this page. Let's get you back to familiar territory!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="iguana-button text-white px-8 py-3" asChild>
            <Link href="/">
              <Home className="mr-2 w-5 h-5" />
              Back to Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-2 border-green-300 hover:bg-green-50 px-8 py-3"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-sm text-gray-500"
        >
          <p>🦎 Fun fact: Iguanas can live up to 20 years and grow up to 6 feet long!</p>
        </motion.div>
      </div>
    </div>
  )
}
