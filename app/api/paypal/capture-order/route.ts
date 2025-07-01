import { NextResponse } from "next/server"
import { capturePayment } from "@/app/api/paypal/helper"

export async function POST(request: Request) {
  try {
    const { orderId, amount } = await request.json()
    if (!orderId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Missing orderId or invalid amount" }, { status: 400 })
    }
    const result = await capturePayment(orderId, amount)
    if (result.success) {
      return NextResponse.json({ message: result.message, data: result.data })
    } else {
      return NextResponse.json({ error: result.message || "Failed to capture payment" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in /api/paypal/capture-order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
