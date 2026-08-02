import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import CompaniesSection from '@/components/landing/CompaniesSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import AIShowcase from '@/components/landing/AIShowcase';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';

export default function Landing() {
  return (
    <div className="flex flex-col bg-bg">
      <HeroSection />
      <CompaniesSection />
      <StatsSection />
      <FeaturesSection />
      <AIShowcase />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
