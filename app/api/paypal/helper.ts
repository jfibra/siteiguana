// Server-side helper, no `next/headers` needed here directly.
export async function capturePayment(
  orderId: string,
  amount: number,
): Promise<{ success: boolean; message?: string; data?: any }> {
  console.log(`Mock: Capturing PayPal payment for order ${orderId} with amount ${amount}`)
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (orderId.includes("FAIL")) {
    return { success: false, message: "Failed to capture payment (mock)" }
  }
  return { success: true, message: "Payment captured successfully (mock)", data: { id: orderId, status: "COMPLETED" } }
}
