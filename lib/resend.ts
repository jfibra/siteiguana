import { Resend } from "resend"

const isServer = typeof window === "undefined"

// Only instantiate on the server to avoid env errors in the browser bundle
export const resend = isServer && process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

if (isServer && !resend) {
  throw new Error("RESEND_API_KEY is not set")
}

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  if (!resend) return { success: false, error: "Resend not initialised (client side)" }
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@yourdomain.com>`,
      to: [email],
      subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}!</h1>
          <p>Hi {{userName}},</p>
          <p>Thank you for joining ${process.env.NEXT_PUBLIC_APP_NAME}! We're excited to help you create amazing websites.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Browse our website templates</li>
            <li>Create your first website project</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/user/dashboard" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Get Started
            </a>
          </div>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `.replace("{{userName}}", firstName),
    })

    if (error) {
      console.error("Failed to send welcome email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error }
  }
}

export const sendWebsiteRequestConfirmation = async (
  email: string,
  userName: string,
  websiteTitle: string,
  requestId: number,
) => {
  if (!resend) return { success: false, error: "Resend not initialised (client side)" }
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@yourdomain.com>`,
      to: [email],
      subject: `Website Request Confirmation - ${websiteTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin-bottom: 10px;">🎉 Website Request Received!</h1>
            <p style="color: #6b7280; font-size: 18px;">Thank you for choosing Site Iguana</p>
          </div>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #059669; margin-top: 0;">Request Details</h2>
            <p><strong>Website Title:</strong> ${websiteTitle}</p>
            <p><strong>Request ID:</strong> #${requestId}</p>
            <p><strong>Submitted by:</strong> ${userName}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #374151;">What happens next?</h3>
            <ol style="color: #6b7280; line-height: 1.6;">
              <li><strong>Review (24 hours):</strong> Our team will review your request and create a detailed proposal</li>
              <li><strong>Approval & Payment:</strong> Once approved, you'll choose your subscription plan and set up payment</li>
              <li><strong>Development:</strong> After payment confirmation, we'll start building your website</li>
            </ol>
          </div>
          
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1d4ed8; margin-top: 0;">💳 Subscription Plans</h3>
            <p style="color: #374151; margin-bottom: 15px;">Choose from our flexible monthly plans:</p>
            <ul style="color: #6b7280; line-height: 1.6;">
              <li><strong>Basic ($99/month):</strong> Perfect for small businesses</li>
              <li><strong>Standard ($199/month):</strong> Growing businesses with more features</li>
              <li><strong>Premium ($399/month):</strong> Enterprise-level websites</li>
            </ul>
            <p style="color: #374151; font-size: 14px; margin-top: 15px;">
              <em>Your subscription starts only after you approve our proposal. No hidden fees, cancel anytime.</em>
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/user/dashboard" 
               style="background-color: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Check Request Status
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Need to make changes?</strong> No problem! You can contact our support team or check your request status anytime from your dashboard.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Questions? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/support" style="color: #059669;">support center</a>.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px;">
              Best regards,<br>
              The ${process.env.NEXT_PUBLIC_APP_NAME} Team
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Failed to send website request confirmation:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending website request confirmation:", error)
    return { success: false, error }
  }
}

export const sendPaymentSuccessEmail = async (
  email: string,
  userName: string,
  paymentId: string,
  amount: number,
  planName: string,
) => {
  if (!resend) return { success: false, error: "Resend not initialised (client side)" }
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@yourdomain.com>`,
      to: [email],
      subject: `Payment Confirmation - ${process.env.NEXT_PUBLIC_APP_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #28a745; text-align: center;">Payment Successful!</h1>
          <p>Hi {{userName}},</p>
          <p>Thank you for your payment! Your subscription has been activated.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Payment ID:</strong> {{paymentId}}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Your subscription is now active and you can start creating your websites!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/user/dashboard" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              View Dashboard
            </a>
          </div>
          
          <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME} Team</p>
        </div>
      `
        .replace("{{userName}}", userName)
        .replace("{{paymentId}}", paymentId),
    })

    if (error) {
      console.error("Failed to send payment success email:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending payment success email:", error)
    return { success: false, error }
  }
}

export const sendSupportTicketNotification = async (
  adminEmail: string,
  userName: string,
  subject: string,
  ticketId: number,
) => {
  if (!resend) return { success: false, error: "Resend not initialised (client side)" }
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@yourdomain.com>`,
      to: [adminEmail],
      subject: `New Support Ticket - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc3545; text-align: center;">New Support Ticket</h1>
          <p>A new support ticket has been submitted:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>From:</strong> {{userName}}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Ticket ID:</strong> #${ticketId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/support-tickets" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              View Ticket
            </a>
          </div>
        </div>
      `.replace("{{userName}}", userName),
    })

    if (error) {
      console.error("Failed to send support ticket notification:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending support ticket notification:", error)
    return { success: false, error }
  }
}
