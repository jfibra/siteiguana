/**
 * Minimal schema placeholder so the build finds `subscriptions`.
 * Replace with your actual SQL builder / Zod schema.
 */
export const subscriptions = {
  tableName: "subscriptions",
  columns: {
    id: "uuid",
    user_id: "uuid",
    plan: "text",
    status: "text",
    created_at: "timestamptz",
  },
}
