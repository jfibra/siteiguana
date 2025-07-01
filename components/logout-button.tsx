"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { handleLogout } from "@/lib/auth-utils"
import { useState } from "react"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ variant = "ghost", size = "default", className = "" }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const onLogout = async () => {
    setIsLoggingOut(true)
    try {
      await handleLogout()
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={onLogout} disabled={isLoggingOut}>
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </Button>
  )
}
