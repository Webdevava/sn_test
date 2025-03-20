import HeroSection from "@/components/landing/hero";
import AboutSection from "@/components/landing/about";
import WhoIsItForSection from "@/components/landing/WhoIsItForSection";
import FeaturesSection from "@/components/landing/features";
import HowItWorksSection from "@/components/landing/how-it-works";
import Footer from "@/components/landing/footer";
import FAQSection from "@/components/landing/faq";
import CTASection from "@/components/landing/cta";
import PricingSection from "@/components/landing/pricing";
import TestimonialsSection from "@/components/landing/testimonials";
import NotificationsVerificationSection from "@/components/landing/verification";
import SecurityPrivacySection from "@/components/landing/security";
import Navbar from "@/components/landing/navbar";
import WhyChooseUsSection from "@/components/landing/why-choose-us";

export default function Home() {
  return (
    <main>
      <div className="bg-primary">

      <Navbar/>
      </div>
      <HeroSection />
      <AboutSection />
      <WhoIsItForSection/>
      <FeaturesSection/>
      <WhyChooseUsSection/>
      <HowItWorksSection/>
      <PricingSection/>
      <NotificationsVerificationSection/>
      <SecurityPrivacySection/>
      <FAQSection/>
      <TestimonialsSection/>
      <CTASection/>
      <Footer/>
    </main>
  );
}