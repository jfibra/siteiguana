"use client"

import { useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalButtonProps {
  planId: number
  amount: number
  planName: string
  onSuccess?: (details: any) => void
  onError?: (error: any) => void
}

export function PayPalButton({ planId, amount, planName, onSuccess, onError }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (window.paypal && paypalRef.current) {
      window.paypal
        .Buttons({
          createOrder: async () => {
            try {
              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  planId,
                  amount,
                }),
              })

              const data = await response.json()

              if (!response.ok) {
                throw new Error(data.error || "Failed to create order")
              }

              return data.orderID
            } catch (error) {
              console.error("Error creating PayPal order:", error)
              toast({
                title: "Error",
                description: "Failed to create payment order. Please try again.",
                variant: "destructive",
              })
              throw error
            }
          },
          onApprove: async (data: any) => {
            try {
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderID: data.orderID,
                }),
              })

              const captureData = await response.json()

              if (response.ok && captureData.success) {
                toast({
                  title: "Payment Successful!",
                  description: `Your ${planName} subscription has been activated.`,
                })
                onSuccess?.(captureData)
              } else {
                throw new Error(captureData.error || "Payment capture failed")
              }
            } catch (error) {
              console.error("Error capturing payment:", error)
              toast({
                title: "Payment Error",
                description: "There was an issue processing your payment. Please contact support.",
                variant: "destructive",
              })
              onError?.(error)
            }
          },
          onError: (error: any) => {
            console.error("PayPal error:", error)
            toast({
              title: "Payment Error",
              description: "There was an issue with PayPal. Please try again.",
              variant: "destructive",
            })
            onError?.(error)
          },
          onCancel: () => {
            toast({
              title: "Payment Cancelled",
              description: "Your payment was cancelled.",
            })
          },
        })
        .render(paypalRef.current)
    }
  }, [planId, amount, planName, onSuccess, onError, toast])

  return <div ref={paypalRef} />
}
