import Navbar from "@/components/navbar";
import AnalyticsPage from "@/components/analytics-section";
import HeroSection from "@/components/hero-section";
import IntegrationSection from "@/components/integration-section";
import Footer from "@/components/footer";
import Banner from "@/components/banner";
import FAQ from "@/components/faq";
import TestimonialSection from "@/components/testimonials";
import LogoCarousel from "@/components/logo-carousel";
import TestVoicesSection from '../components/voice-section/TestVoicesSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <HeroSection />
      <LogoCarousel />
      <AnalyticsPage />
      <IntegrationSection />
      <TestVoicesSection />
      <TestimonialSection />
      <FAQ />
      <Banner />
      <Footer />
    </div>
  );
}
