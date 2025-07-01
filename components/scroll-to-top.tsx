"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Scroll-to-top FAB.
 *
 * • Appears once the user has scrolled 300 px.
 * • Smooth-scrolls to the top of the page when clicked.
 * • Works only on the client, so the file is explicitly marked
 *   with `"use client"` to satisfy Next.js’ rules-as-hooks linting.
 */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* Provide a default export so the component can be imported either way:
 *    import ScrollToTop from "@/components/scroll-to-top"
 * or import { ScrollToTop } from "@/components/scroll-to-top"
 */
export default ScrollToTop
