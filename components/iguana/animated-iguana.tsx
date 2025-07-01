"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedIguana({ size = 120, className = "" }: { size?: number; className?: string }) {
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      },
      3000 + Math.random() * 2000,
    )

    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.svg
        width={size}
        height={size * 0.8}
        viewBox="0 0 120 96"
        className="drop-shadow-lg"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Iguana Body */}
        <motion.ellipse
          cx="60"
          cy="70"
          rx="45"
          ry="20"
          fill="url(#iguanaBodyGradient)"
          animate={{
            rx: [45, 47, 45],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Iguana Head */}
        <motion.ellipse
          cx="60"
          cy="40"
          rx="25"
          ry="18"
          fill="url(#iguanaHeadGradient)"
          animate={{
            rx: [25, 26, 25],
            ry: [18, 19, 18],
          }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Iguana Spikes */}
        <motion.path
          d="M35 25 L40 15 L45 25 L50 15 L55 25 L60 15 L65 25 L70 15 L75 25 L80 15 L85 25"
          stroke="url(#iguanaSpikeGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              "M35 25 L40 15 L45 25 L50 15 L55 25 L60 15 L65 25 L70 15 L75 25 L80 15 L85 25",
              "M35 25 L40 12 L45 25 L50 12 L55 25 L60 12 L65 25 L70 12 L75 25 L80 12 L85 25",
              "M35 25 L40 15 L45 25 L50 15 L55 25 L60 15 L65 25 L70 15 L75 25 L80 15 L85 25",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Eyes */}
        <circle cx="50" cy="35" r="4" fill="#FFD700" />
        <circle cx="70" cy="35" r="4" fill="#FFD700" />

        {/* Eye pupils */}
        <motion.circle cx="50" cy="35" r={isBlinking ? "0" : "2"} fill="#000" transition={{ duration: 0.1 }} />
        <motion.circle cx="70" cy="35" r={isBlinking ? "0" : "2"} fill="#000" transition={{ duration: 0.1 }} />

        {/* Tail */}
        <motion.path
          d="M15 75 Q5 80 10 90 Q15 85 25 88 Q20 82 30 85"
          stroke="url(#iguanaTailGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              "M15 75 Q5 80 10 90 Q15 85 25 88 Q20 82 30 85",
              "M15 75 Q8 78 12 88 Q18 83 28 86 Q23 80 33 83",
              "M15 75 Q5 80 10 90 Q15 85 25 88 Q20 82 30 85",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Legs */}
        <ellipse cx="40" cy="85" rx="6" ry="8" fill="url(#iguanaLegGradient)" />
        <ellipse cx="55" cy="88" rx="6" ry="8" fill="url(#iguanaLegGradient)" />
        <ellipse cx="70" cy="88" rx="6" ry="8" fill="url(#iguanaLegGradient)" />
        <ellipse cx="85" cy="85" rx="6" ry="8" fill="url(#iguanaLegGradient)" />

        {/* Gradients */}
        <defs>
          <linearGradient id="iguanaBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="iguanaHeadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="iguanaSpikeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="iguanaTailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="iguanaLegGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>
      </motion.svg>
    </motion.div>
  )
}
