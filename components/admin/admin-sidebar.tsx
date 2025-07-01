"use client"

import Link from "next/link"
import {
  Home,
  Users,
  Globe,
  MessageSquare,
  BarChart3,
  FileText,
  CreditCard,
  Settings,
  Activity,
  Star,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/logout-button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/websites", label: "Website Management", icon: Globe },
  { href: "/admin/support-tickets", label: "Support Tickets", icon: MessageSquare },
  { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
  { href: "/admin/activity-logs", label: "Activity Logs", icon: Activity },
  { href: "/admin/feature-requests", label: "Feature Requests", icon: Star },
  { href: "/admin/plans", label: "Plans Management", icon: FileText },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="font-plus-jakarta font-bold text-lg gradient-text">
          Admin Panel
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="grid items-start px-4 text-sm font-medium gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted
                ${isActive(item.href) ? "bg-muted text-primary font-medium" : ""}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="mt-auto p-4 border-t">
        <LogoutButton variant="ghost" className="w-full justify-start" />
      </div>
    </aside>
  )
}
