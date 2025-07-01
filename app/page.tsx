"use client"
import { HeroSection } from "@/components/sections/hero-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { BenefitsSection } from "@/components/sections/benefits-section"
import { ShowcaseSection } from "@/components/sections/showcase-section"
import { CTASection } from "@/components/sections/cta-section"
import { OfferingComparisonSection } from "@/components/sections/offering-comparison-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <OfferingComparisonSection />
      <PricingSection />
      <TestimonialsSection />
      <BenefitsSection />
      <ShowcaseSection />
      <CTASection />
    </div>
  )
}
