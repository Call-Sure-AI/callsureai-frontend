import Navbar from "@/components/navbar";
import AnalyticsPage from "@/components/analytics-section";
import HeroSection from "@/components/hero-section";
import IntegrationSection from "@/components/integration-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <HeroSection />
      <AnalyticsPage />
      <IntegrationSection />
    </div>
  );
}
