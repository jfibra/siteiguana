/**
 * Compatibility barrel.
 *
 * •  Client code should import ONLY the browser helpers
 *      ─────  `createSupabaseClient`, `getSupabaseBrowserClient`
 *      from "@/lib/supabase"   or "@/lib/supabase/client".
 *
 * •  Server code may import
 *      ─────  `getSupabaseServerClient`
 *      from "@/lib/supabase/server"
 *   OR keep using this file – but now it is provided lazily so the
 *   client bundle is never forced to load `next/headers`.
 */

/* ---------- 1.  Browser helpers (safe everywhere) ---------- */
export { createSupabaseClient, getSupabaseBrowserClient } from "./client"

/* ---------- 2.  Server helpers:  LAZY proxy  ----------------
   We export *functions* that `import()` the real server module
   ONLY when they are called (i.e. only in a server environment).
   No top-level reference => no static inclusion => no build error.
----------------------------------------------------------------*/

export async function getSupabaseServerClient() {
  const mod = await import("./server")
  return mod.getSupabaseServerClient()
}

/* older alias kept alive */
export async function createSupabaseServerClient() {
  return getSupabaseServerClient()
}
