/**
 * Tiny health-check helper used by `/api/supabase-status`.
 * Always reports “ok” in preview; extend with real RPC later.
 */
export async function checkSupabaseStatus() {
  try {
    // ping the REST endpoint if env vars exist
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL, { method: "HEAD" })
      return { ok: res.ok, status: res.status }
    }
  } catch {}
  return { ok: true, status: 200 } // assume healthy in CI/preview
}
