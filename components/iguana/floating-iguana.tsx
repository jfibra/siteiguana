"use client"

import { motion } from "framer-motion"
import { AnimatedIguana } from "./animated-iguana"

export function FloatingIguana() {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40 cursor-pointer"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 1, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative"
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <AnimatedIguana size={80} />

        {/* Speech bubble */}
        <motion.div
          className="absolute -top-16 -left-20 bg-white rounded-lg p-3 shadow-lg border-2 border-green-200"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <div className="text-sm font-medium text-green-800">Need help? 🦎</div>
          <div className="absolute bottom-0 left-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white transform translate-y-full"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
