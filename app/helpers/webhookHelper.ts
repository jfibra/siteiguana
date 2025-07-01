// Server-side helper, no `next/headers` needed here directly.
export class WebhookHelper {
  private secret: string

  constructor(secret: string) {
    this.secret = secret
    if (!secret) {
      console.warn("WebhookHelper initialized without a secret. Signature verification will be skipped.")
    }
  }

  async verifyStripeSignature(payload: string | Buffer, sig: string | string[] | Buffer): Promise<boolean> {
    if (!this.secret) return true // Skip if no secret
    console.log(
      "Mock: Verifying Stripe signature (payload, sig, secret)",
      payload.toString().substring(0, 100) + "...",
      sig,
      this.secret.substring(0, 5) + "...",
    )
    // In a real scenario, use stripe.webhooks.constructEvent
    return true // Mock verification
  }

  async processStripeWebhook(payload: any, signature: string): Promise<{ success: boolean; message?: string }> {
    const isValid = await this.verifyStripeSignature(JSON.stringify(payload), signature)
    if (!isValid) {
      return { success: false, message: "Invalid Stripe signature (mock)" }
    }
    console.log("Mock: Processing Stripe webhook payload:", payload)
    return { success: true, message: "Stripe webhook processed (mock)" }
  }

  async processPaypalWebhook(payload: any, headers?: any): Promise<{ success: boolean; message?: string }> {
    // PayPal webhook verification is more complex, involving certs. Mocking for now.
    console.log("Mock: Processing PayPal webhook payload:", payload, "Headers:", headers)
    return { success: true, message: "PayPal webhook processed (mock)" }
  }
}
