import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Users, Target, Award, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/professional-woman-headshot.png",
      bio: "With over 10 years in web development, Sarah founded Site Iguana to make professional websites accessible to everyone.",
    },
    {
      name: "Marcus Chen",
      role: "Lead Developer",
      image: "/asian-man-professional-headshot.png",
      bio: "Marcus brings technical excellence and innovation to every project, ensuring our websites are fast, secure, and scalable.",
    },
    {
      name: "Aisha Williams",
      role: "Design Director",
      image: "/professional-black-woman-headshot.png",
      bio: "Aisha's creative vision and user-centered design approach helps businesses tell their story through beautiful websites.",
    },
    {
      name: "Carlos Rodriguez",
      role: "Customer Success Manager",
      image: "/hispanic-man-professional-headshot.png",
      bio: "Carlos ensures every client receives exceptional support and guidance throughout their website journey.",
    },
  ]

  const values = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Client-Centered",
      description: "Every decision we make puts our clients' success first. Your goals become our mission.",
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Results-Driven",
      description: "We measure our success by the growth and achievements of the businesses we serve.",
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: "Quality Excellence",
      description: "We never compromise on quality, delivering websites that exceed expectations every time.",
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: "Passionate",
      description: "We love what we do, and that passion shows in every website we create.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">
              Site Iguana
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're on a mission to help small businesses and entrepreneurs establish a powerful online presence without
            the complexity and cost of traditional web development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="iguana-button text-white px-8 py-3 text-lg">Get In Touch</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="mb-6">
                  Site Iguana was born from a simple observation: too many great businesses were being held back by
                  outdated, expensive, or non-existent websites. We saw talented entrepreneurs with amazing products and
                  services struggling to reach their audience online.
                </p>
                <p className="mb-6">
                  Founded in 2023, we set out to change that. Our team combines years of experience in web development,
                  design, and digital marketing to create a streamlined process that delivers professional websites
                  quickly and affordably.
                </p>
                <p>
                  Today, we've helped hundreds of businesses establish their online presence, from local restaurants and
                  retail stores to consultants and creative professionals. Every website we create is a step toward our
                  vision of a more connected, accessible digital world.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind Site Iguana</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Work Together?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's create something amazing for your business. Get started with your new website today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/user/websites/wizard/start">
              <Button className="iguana-button text-white px-8 py-3 text-lg">Start Your Website</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
