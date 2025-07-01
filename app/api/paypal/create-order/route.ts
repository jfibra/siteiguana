import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { amount } = await request.json()
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }
    const mockOrderId = `MOCK_PAYPAL_ORDER_${Date.now()}`
    console.log(`Mock PayPal order created: ${mockOrderId} for amount ${amount}`)
    return NextResponse.json({ orderId: mockOrderId })
  } catch (error) {
    console.error("Error in /api/paypal/create-order:", error)
    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
  }
}
