"use client";

import HeroSection from "@/components/sections/HeroSection";
import TrendingProducts from "@/components/sections/TrendingProducts";
import PacksSection from "@/components/sections/PacksSection";
import WhySection from "@/components/sections/WhySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import TrustSection from "@/components/sections/TrustSection";
import FAQSection from "@/components/sections/FAQSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrendingProducts />
      <PacksSection />
      <WhySection />
      <ReviewsSection />
      <TrustSection />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
