import { NextResponse } from "next/server"
import { WebhookHelper } from "@/app/helpers/webhookHelper" // Assuming you have PAYPAL_WEBHOOK_SECRET

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    // In a real scenario, you'd get headers for verification.
    // const paypalWebhookSecret = process.env.PAYPAL_WEBHOOK_SECRET;
    // if (!paypalWebhookSecret) throw new Error("PAYPAL_WEBHOOK_SECRET not set");
    // const helper = new WebhookHelper(paypalWebhookSecret); // Or handle verification differently for PayPal

    // For PayPal, verification is more complex (certs, etc.)
    // We'll just pass it to a generic processor for now.
    const helper = new WebhookHelper("mock-paypal-secret-if-needed-for-generic-class")
    const result = await helper.processPaypalWebhook(payload, request.headers)

    if (result.success) {
      return NextResponse.json({ message: result.message || "Webhook processed" })
    } else {
      return NextResponse.json({ error: result.message || "Failed to process webhook" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in /api/paypal/webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
