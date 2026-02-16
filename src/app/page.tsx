import AgencyHeroSection from '@/components/sections/AgencyHeroSection'
import TrustProofStrip from '@/components/sections/TrustProofStrip'
import PainSolutionCards from '@/components/sections/PainSolutionCards'
import ServiceFeatureGrid from '@/components/sections/ServiceFeatureGrid'
import ProcessTimeline from '@/components/sections/ProcessTimeline'
import PricingTeaserCards from '@/components/sections/PricingTeaserCards'
import FaqAccordion from '@/components/sections/FaqAccordion'
import FinalCtaBanner from '@/components/sections/FinalCtaBanner'
import LegalFooter from '@/components/sections/LegalFooter'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <AgencyHeroSection />
      <TrustProofStrip />
      <PainSolutionCards />
      <ServiceFeatureGrid />
      <ProcessTimeline />
      <PricingTeaserCards />
      <FaqAccordion />
      <FinalCtaBanner />
      <LegalFooter />
    </main>
  )
}
