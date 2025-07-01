"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createSupabaseClient } from "@/lib/supabase/client"

const navItems = [
  {
    href: "/",
    label: "Home",
    featured: false,
  },
  {
    href: "/about",
    label: "About",
    featured: false,
  },
  {
    href: "/services",
    label: "Services",
    featured: false,
    submenu: [
      { href: "/services#one-pager", label: "One-Page Sites" },
      { href: "/services#informational", label: "Business Sites" },
      { href: "/services#ecommerce", label: "E-commerce" },
      { href: "/services#custom", label: "Custom Solutions" },
    ],
  },
  {
    href: "/contact",
    label: "Contact",
    featured: false,
  },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      setIsLoadingUser(true)
      try {
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

          if (profileData) {
            setUserProfile(profileData)
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoadingUser(false)
      }
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null)
      setIsLoadingUser(true)
      if (session?.user) {
        try {
          const { data: profileData } = await supabase
            .from("users")
            .select("first_name, last_name, profile_image")
            .eq("id", session.user.id)
            .single()
          if (profileData) {
            setUserProfile(profileData)
          } else {
            setUserProfile(null)
          }
        } catch (error) {
          console.error("Error fetching user on auth change:", error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      setIsLoadingUser(false)
    })
    return () => authListener.subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById("mobile-menu")
      const menuButton = document.getElementById("mobile-menu-button")
      if (
        isMobileMenuOpen &&
        mobileMenu &&
        menuButton &&
        !mobileMenu.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
        setActiveSubmenu(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMobileMenuOpen])

  const toggleSubmenu = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveSubmenu(activeSubmenu === index ? null : index)
  }

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (isMobileMenuOpen) setActiveSubmenu(null)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100"
          : "bg-gradient-to-r from-green-50/80 to-orange-50/80 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <img src="/site-iguana-logo-new.png" alt="Site Iguana Logo" className="h-12 w-auto" />
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={item.href} className="relative group">
                {item.submenu ? (
                  <button
                    className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium rounded-md group-hover:bg-green-50 flex items-center"
                    onClick={(e) => toggleSubmenu(index, e)}
                  >
                    {item.label}
                    <ChevronDown
                      className={`ml-1 w-4 h-4 transition-transform ${activeSubmenu === index ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium rounded-md hover:bg-green-50 ${
                      item.featured ? "text-green-600" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
                {item.submenu && (
                  <AnimatePresence>
                    {activeSubmenu === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-green-100 py-2 z-50"
                      >
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                            onClick={() => setActiveSubmenu(null)}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            {!isLoadingUser && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="relative h-10 w-10 rounded-full ml-4 hover:bg-green-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfile?.profile_image || ""} alt="Profile" />
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {userProfile?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">
                            {userProfile?.first_name} {userProfile?.last_name}
                          </p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo("/user/dashboard")}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo("/user/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/auth" className="ml-4">
                    <Button className="iguana-button text-white shadow-md hover:shadow-lg transition-all">
                      Get Started
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          <button
            id="mobile-menu-button"
            className="md:hidden p-2 rounded-md hover:bg-green-100 transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden bg-white border-t border-green-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => (
                  <div key={item.href}>
                    {item.submenu ? (
                      <>
                        <button
                          className="w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md flex justify-between items-center"
                          onClick={(e) => toggleSubmenu(index, e)}
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${activeSubmenu === index ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {activeSubmenu === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-1 mt-1"
                            >
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subitem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md ${
                          item.featured ? "text-green-600 font-medium" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                {!isLoadingUser && (
                  <div className="border-t border-green-100 pt-3 mt-3">
                    {user ? (
                      <>
                        <div className="px-3 py-2 text-sm text-gray-600">
                          {userProfile?.first_name} {userProfile?.last_name}
                          <br />
                          <span className="text-xs">{user.email}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigateTo("/user/dashboard")
                            setIsMobileMenuOpen(false)
                          }}
                          className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            navigateTo("/user/profile")
                            setIsMobileMenuOpen(false)
                          }}
                          className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                          className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <div className="px-3 py-3">
                        <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full iguana-button text-white">Get Started</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
