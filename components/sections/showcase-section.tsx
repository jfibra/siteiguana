"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const projects = [
  {
    title: "Restaurant Website",
    category: "Informational",
    image: "/modern-restaurant-website.png",
  },
  {
    title: "E-commerce Store",
    category: "E-commerce",
    image: "/modern-ecommerce-website.png",
  },
  {
    title: "SaaS Landing Page",
    category: "One-Pager",
    image: "/saas-landing-page.png",
  },
  {
    title: "Portfolio Site",
    category: "Multi-Page",
    image: "/creative-portfolio-website.png",
  },
  {
    title: "Booking Platform",
    category: "Custom",
    image: "/booking-platform-dashboard.png",
  },
  {
    title: "Corporate Website",
    category: "Multi-Page",
    image: "/corporate-business-website.png",
  },
]

export function ShowcaseSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-plus-jakarta font-extrabold text-4xl md:text-6xl mb-6">
            Our <span className="gradient-text">Work</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See examples of websites we've built across different industries and plan types.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={
                      project.image ||
                      `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(project.title)}`
                    }
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-600 font-medium mb-2">{project.category}</div>
                  <h3 className="font-plus-jakarta font-bold text-xl">{project.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
