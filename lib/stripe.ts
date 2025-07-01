// lib/stripe.ts
import Stripe from "stripe"

let cachedStripe: Stripe | null = null

/**
 * Lazily create (or return) the Stripe client.
 * Throws **only when the helper is called** and no secret key is available,
 * so the build step won’t fail if the env-var is missing.
 */
export function getStripe(): Stripe {
  if (cachedStripe) return cachedStripe

  const secretKey =
    process.env.STRIPE_SECRET_KEY || process.env.SECRET_KEY // fallback for legacy name

  if (!secretKey) {
    throw new Error(
      "Stripe secret key is not set - add STRIPE_SECRET_KEY (or SECRET_KEY) to your env."
    )
  }

  cachedStripe = new Stripe(secretKey, {
    apiVersion: "2023-10-16",
    typescript: true,
  })

  return cachedStripe
}
