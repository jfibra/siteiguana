import type React from "react"
import type { Metadata } from "next"
import ClientRootLayout from "./client-layout" // Import as default

export const metadata: Metadata = {
  title: "Site Iguana - Professional Website Subscriptions",
  description:
    "Professional websites built for you by Site Iguana. Pay monthly, no upfront costs. Modern Next.js sites with ongoing support and iguana-powered excellence.",
  keywords: "website design, monthly subscription, professional websites, Site Iguana, web development",
  openGraph: {
    title: "Site Iguana - Professional Website Subscriptions",
    description: "Professional websites built for you by Site Iguana. Pay monthly, no upfront costs.",
    images: ["/site-iguana-logo.png"],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}


import './globals.css'