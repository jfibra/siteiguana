"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    content:
      "WebFlow Pro transformed our online presence. Their subscription model is perfect for our small business - we get a professional website without the hefty upfront costs.",
    author: "Sarah Johnson",
    position: "Owner, Bloom Café",
    avatar: "/professional-woman-headshot.png",
    rating: 5,
  },
  {
    id: 2,
    content:
      "I was skeptical about the monthly model at first, but it's been amazing. They're responsive with updates and the site looks better than what I got quoted $10K for elsewhere.",
    author: "Michael Chen",
    position: "Founder, TechStart Solutions",
    avatar: "/asian-man-professional-headshot.png",
    rating: 5,
  },
  {
    id: 3,
    content:
      "As a non-tech person, I love that I can request changes whenever needed without worrying about breaking something. The team is responsive and professional.",
    author: "Jessica Williams",
    position: "Director, Williams Legal",
    avatar: "/professional-black-woman-headshot.png",
    rating: 5,
  },
  {
    id: 4,
    content:
      "The monthly subscription is perfect for our growing business. As we expand, our website evolves with us without additional large investments.",
    author: "Robert Martinez",
    position: "CEO, Elevation Fitness",
    avatar: "/hispanic-man-professional-headshot.png",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const handlePrev = () => {
    setAutoplay(false)
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setAutoplay(false)
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 noise-bg z-0"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl z-0"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-100/50 blur-3xl z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4">
            Client Success Stories
          </span>
          <h2 className="font-plus-jakarta font-extrabold text-4xl md:text-6xl mb-6">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what businesses like yours have to say about our service.
          </p>
        </motion.div>

        <div className="relative">
          {/* Large Quote Icon */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-blue-100 z-0">
            <Quote size={120} />
          </div>

          <div className="relative z-10">
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-all duration-500 ease-in-out"
                animate={{ x: `-${activeIndex * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 glass-effect">
                        <div className="flex justify-center mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-6 h-6 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>

                        <p className="text-xl md:text-2xl text-gray-700 mb-8 text-center italic">
                          "{testimonial.content}"
                        </p>

                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-blue-100">
                            <Image
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.author}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <h4 className="font-plus-jakarta font-bold text-lg">{testimonial.author}</h4>
                            <p className="text-gray-600">{testimonial.position}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2 items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setAutoplay(false)
                      setActiveIndex(index)
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeIndex === index ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
