"use client"

import type React from "react"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "../app/globals.css" // Use relative path for client component
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { ConditionalLayoutWrapper } from "@/components/layout/conditional-layout-wrapper"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="icon" href="/iguana-favicon.png" />
        {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && (
          <Script
            src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className="font-inter antialiased">
        <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
        <ScrollToTop />
        <Toaster />
      </body>
    </html>
  )
}
