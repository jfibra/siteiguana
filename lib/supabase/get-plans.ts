// Compatibility wrapper - detects runtime context
import type { Plan } from "./get-plans-server"

export async function getPlans(): Promise<Plan[]> {
  // Check if we're in a server context
  if (typeof window === "undefined") {
    // Server-side: use the server version
    try {
      const { getPlansServer } = await import("./get-plans-server")
      return await getPlansServer()
    } catch (error) {
      console.error("Error loading server plans:", error)
      return []
    }
  } else {
    // Client-side: use the client version
    try {
      const { getPlansClient } = await import("./get-plans-client")
      return await getPlansClient()
    } catch (error) {
      console.error("Error loading client plans:", error)
      return []
    }
  }
}

export type { Plan } from "./get-plans-server"
