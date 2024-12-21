import Navbar from "@/components/navbar";
import AnalyticsPage from "@/components/analytics-section";
import HeroSection from "@/components/hero-section";
import IntegrationSection from "@/components/integration-section";
import Footer from "@/components/footer";
import Banner from "@/components/banner";
import FAQ from "@/components/faq";
import TestimonialSection from "@/components/testimonials";
// import LogoCarousel from "@/components/logo-carousel";
import { FeaturesSection } from "@/components/features-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <HeroSection />
      {/* <LogoCarousel /> */}
      <FeaturesSection />
      <AnalyticsPage />
      <IntegrationSection />
      <TestimonialSection />
      <FAQ />
      <Banner />
      <Footer />
    </div>
  );
}
