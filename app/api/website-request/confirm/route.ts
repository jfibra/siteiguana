import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
let resend: Resend | null = null
if (resendApiKey) {
  resend = new Resend(resendApiKey)
} else {
  console.warn("RESEND_API_KEY not set. Email sending will be disabled.")
}

export async function POST(request: Request) {
  try {
    const { websiteRequestId } = await request.json()
    if (!websiteRequestId) {
      return NextResponse.json({ error: "websiteRequestId is required" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    const { data: websiteRequest, error: fetchError } = await supabase
      .from("website_requests")
      .select("email, name, website_type") // Select only necessary fields
      .eq("id", websiteRequestId)
      .single()

    if (fetchError || !websiteRequest) {
      console.error("Error fetching website request:", fetchError?.message)
      return NextResponse.json(
        { error: "Website request not found or error fetching" },
        { status: fetchError ? 500 : 404 },
      )
    }

    const { error: updateError } = await supabase
      .from("website_requests")
      .update({ status: "confirmed" })
      .eq("id", websiteRequestId)

    if (updateError) {
      console.error("Error updating website request status:", updateError.message)
      return NextResponse.json({ error: "Failed to confirm website request" }, { status: 500 })
    }

    if (resend && websiteRequest.email) {
      try {
        await resend.emails.send({
          from: "Site Iguana Onboarding <onboarding@siteiguana.com>", // Replace with your verified Resend domain
          to: websiteRequest.email,
          subject: "Your Site Iguana Website Request is Confirmed!",
          html: `<h1>Hello ${websiteRequest.name || "Customer"},</h1><p>Your website request for "${websiteRequest.website_type}" has been confirmed!</p><p>We will be in touch shortly.</p><p>Thank you!</p>`,
        })
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError)
        // Do not fail the request if email sending fails, DB update was successful
      }
    } else if (!resend) {
      console.log("Resend not initialized, skipping email for request:", websiteRequestId)
    }

    return NextResponse.json({ message: "Website request confirmed!" })
  } catch (error) {
    console.error("Error in /api/website-request/confirm:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
