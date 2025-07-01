import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Test Product" },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/user/test-env?status=stripe_success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/user/test-env?status=stripe_cancelled`,
    })

    if (!session.url) {
      throw new Error("Stripe session URL is null")
    }
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error in /api/stripe-test:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to create Stripe session"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
