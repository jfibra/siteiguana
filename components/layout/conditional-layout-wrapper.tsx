"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const noLayoutPaths = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"]

const authOnlyPaths = ["/auth"]

export function ConditionalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Check if current path should not have layout
  const shouldHideLayout = noLayoutPaths.some((path) => pathname.startsWith(path))

  // Check if current path is auth-only (like /auth page)
  const isAuthOnlyPath = authOnlyPaths.includes(pathname)

  if (shouldHideLayout || isAuthOnlyPath) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
