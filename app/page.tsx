import { ModernNavbar } from "@/components/modern/modern-navbar";
import { ModernHero } from "@/components/modern/modern-hero";
import { ModernUseCases } from "@/components/modern/modern-use-cases";
import { ModernFeatures } from "@/components/modern/modern-features";
import { ModernVoiceShowcase } from "@/components/modern/modern-voice-showcase";
import { ModernLogoCarousel } from "@/components/modern/modern-logo-carousel";
import { ModernIntegrations } from "@/components/modern/modern-integrations";
import { ModernTestimonials } from "@/components/modern/modern-testimonials";
import { ModernCTABanner } from "@/components/modern/modern-cta-banner";
import { ModernFooter } from "@/components/modern/modern-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <ModernNavbar />
      <ModernHero />
      <ModernLogoCarousel />
      <ModernUseCases />
      <ModernFeatures />
      <ModernVoiceShowcase />
      <ModernIntegrations />
      <ModernTestimonials />
      <ModernCTABanner />
      <ModernFooter />
    </div>
  );
}