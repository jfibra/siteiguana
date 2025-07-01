import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/resend"

export async function POST() {
  try {
    // In a real application, you'd get the user's email and name from authentication
    // For testing, we'll use a dummy email and name
    const testEmail = "test@example.com" // Replace with a real email for actual testing
    const testName = "Test User"

    const { success, error } = await sendWelcomeEmail(testEmail, testName)

    if (success) {
      return NextResponse.json({ message: "Test email sent successfully!" }, { status: 200 })
    } else {
      console.error("Resend API error:", error)
      return NextResponse.json({ error: error?.message || "Failed to send test email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Internal server error during Resend test:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
