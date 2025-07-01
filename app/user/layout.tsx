"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createSupabaseClient } from "@/lib/supabase/client"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { LogoutButton } from "@/components/logout-button"

function UserDashboardHeader() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUser(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("users")
          .select("first_name, last_name, profile_image")
          .eq("id", session.user.id)
          .single()
        setUserProfile(profileData)
      }
      setIsLoadingUser(false)
    }
    fetchUserData()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase
          .from("users")
          .select("first_name, last_name, profile_image")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setUserProfile(data))
      } else {
        setUserProfile(null)
      }
      if (_event === "SIGNED_OUT") {
        window.location.href = "/auth/login"
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const displayName =
    userProfile?.first_name && userProfile?.last_name
      ? `${userProfile.first_name} ${userProfile.last_name}`
      : user?.email

  const getInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`
    }
    if (userProfile?.first_name) {
      return userProfile.first_name.substring(0, 2)
    }
    if (user?.email) {
      return user.email.substring(0, 2)
    }
    return "U"
  }

  if (isLoadingUser) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <div className="text-lg font-semibold font-plus-jakarta">My Dashboard</div>
        <LoadingSpinner />
      </header>
    )
  }

  if (!user) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold font-plus-jakarta">
          WebFlow Pro
        </Link>
        <Link href="/auth/login">
          <LogoutButton variant="outline" size="sm" showText={false} />
        </Link>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
      <Link href="/user/dashboard" className="text-lg font-semibold font-plus-jakarta">
        My Dashboard
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">{displayName}</span>
        <Avatar className="h-9 w-9">
          <AvatarImage src={userProfile?.profile_image || undefined} alt="User avatar" />
          <AvatarFallback>{getInitials().toUpperCase()}</AvatarFallback>
        </Avatar>
        <LogoutButton variant="outline" size="sm" className="flex items-center" />
      </div>
    </header>
  )
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <UserDashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:p-8 bg-muted/40">{children}</main>
    </div>
  )
}
