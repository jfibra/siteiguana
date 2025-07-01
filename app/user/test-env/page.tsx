"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PayPalButton } from "@/components/paypal-button"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function TestEnvPage() {
  const [stripeLoading, setStripeLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendStatus, setResendStatus] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME
  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  const NEXT_PUBLIC_PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY // Should be public

  useEffect(() => {
    const stripeStatus = searchParams.get("status")
    if (stripeStatus === "stripe_success") {
      toast({
        title: "Stripe Test Payment",
        description: "Stripe checkout successful!",
        variant: "default",
      })
      router.replace("/user/test-env") // Clean the URL
    } else if (stripeStatus === "stripe_cancelled") {
      toast({
        title: "Stripe Test Payment",
        description: "Stripe checkout cancelled.",
        variant: "destructive",
      })
      router.replace("/user/test-env") // Clean the URL
    }
  }, [searchParams, toast, router])

  const handleTestStripe = async () => {
    setStripeLoading(true)
    try {
      const response = await fetch("/api/stripe-test", {
        method: "POST",
      })
      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Failed to create Stripe session")
      }
    } catch (error) {
      console.error("Stripe test error:", error)
      toast({
        title: "Stripe Test Failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setStripeLoading(false)
    }
  }

  const handleTestResend = async () => {
    setResendLoading(true)
    setResendStatus(null)
    try {
      const response = await fetch("/api/resend-test", {
        method: "POST",
      })
      const data = await response.json()

      if (response.ok) {
        setResendStatus("success")
        toast({
          title: "Resend Test Successful",
          description: data.message,
          variant: "default",
        })
      } else {
        setResendStatus("error")
        throw new Error(data.error || "Failed to send test email")
      }
    } catch (error) {
      console.error("Resend test error:", error)
      setResendStatus("error")
      toast({
        title: "Resend Test Failed",
        description: `Error: ${(error as Error).message}`,
        variant: "destructive",
      })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Environment Variable Test Page (Temporary)</h1>
        <p className="text-gray-600">
          This page is for verifying that your environment variables are correctly configured and accessible. Remember
          to remove this page before deploying to production.
        </p>

        {/* Public Environment Variables */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Public Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>
              **NEXT_PUBLIC_SUPABASE_URL**:{" "}
              <span className="font-mono break-all">{NEXT_PUBLIC_SUPABASE_URL || "Not set"}</span>
            </p>
            <p>
              **NEXT_PUBLIC_SUPABASE_ANON_KEY**:{" "}
              <span className="font-mono break-all">{NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (masked)" : "Not set"}</span>
            </p>
            <p>
              **NEXT_PUBLIC_APP_NAME**: <span className="font-mono break-all">{NEXT_PUBLIC_APP_NAME || "Not set"}</span>
            </p>
            <p>
              **NEXT_PUBLIC_SITE_URL**: <span className="font-mono break-all">{NEXT_PUBLIC_SITE_URL || "Not set"}</span>
            </p>
            <p>
              **NEXT_PUBLIC_PAYPAL_CLIENT_ID**:{" "}
              <span className="font-mono break-all">{NEXT_PUBLIC_PAYPAL_CLIENT_ID ? "Set (masked)" : "Not set"}</span>
            </p>
            <p>
              **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**:{" "}
              <span className="font-mono break-all">{STRIPE_PUBLISHABLE_KEY ? "Set (masked)" : "Not set"}</span>
            </p>
            <p className="text-gray-500 italic">
              (Private variables like `SECRET_KEY`, `RESEND_API_KEY`, `PAYPAL_SECRET_KEY` are only accessible on the
              server.)
            </p>
          </CardContent>
        </Card>

        {/* Stripe Test */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Test Stripe Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTestStripe} disabled={stripeLoading} className="iguana-button w-full">
              {stripeLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Initiate Test Stripe Checkout ($10.00)"
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              This will redirect you to a Stripe checkout page. No real money will be charged.
            </p>
          </CardContent>
        </Card>

        {/* Resend Test */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Test Resend Email</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTestResend} disabled={resendLoading} className="iguana-button w-full">
              {resendLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Test Welcome Email"}
            </Button>
            {resendStatus === "success" && (
              <p className="mt-2 text-green-600 text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Email sent successfully to test@example.com (check your spam)!
              </p>
            )}
            {resendStatus === "error" && (
              <p className="mt-2 text-red-600 text-sm flex items-center">
                <XCircle className="h-4 w-4 mr-1" /> Failed to send email. Check console for errors.
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              This will attempt to send a dummy welcome email using your Resend API key to "test@example.com".
            </p>
          </CardContent>
        </Card>

        {/* PayPal Test */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Test PayPal Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-500">
              This will render a PayPal button using your configured PayPal client ID.
            </p>
            <PayPalButton
              planId={999} // Dummy plan ID
              amount={1.0} // Dummy amount for testing
              planName="Test PayPal Plan"
              onSuccess={(details) => {
                toast({
                  title: "PayPal Test Successful!",
                  description: "Dummy PayPal payment completed.",
                })
                console.log("PayPal Success Details:", details)
              }}
              onError={(error) => {
                toast({
                  title: "PayPal Test Failed",
                  description: "Check console for PayPal error.",
                  variant: "destructive",
                })
                console.error("PayPal Error:", error)
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
