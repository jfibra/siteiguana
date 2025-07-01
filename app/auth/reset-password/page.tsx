import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password · Site Iguana",
  description: "Set a new password for your Site Iguana account.",
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold">Reset your password</h1>

      <p className="text-muted-foreground max-w-md text-center">
        This feature hasn{"'"}t been wired up yet. If you landed here from an email link, please contact support so we
        can finish resetting your password.
      </p>
    </main>
  )
}
