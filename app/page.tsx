"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import HeroSection from "@/components/land/HeroSection";
import FeaturesGrid from "@/components/land/FeaturesGrid";
import HowItWorks from "@/components/land/HowItWorks";
import PricingSection from "@/components/land/PricingSection";
import Footer from "@/components/land/footer";
import Header from "@/components/land/Header";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      console.log(session);
      if (session.user.role == "ADMIN") {
        router.push("/admin/home");
      } else {
        router.push("/upload");
      }
    }
  }, [session, router]);

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 h-screen flex flex-col gap-[200px]">
        <HeroSection />
        <FeaturesGrid />
        <HowItWorks />
        {/* <PricingSection /> */}
        <Footer />
      </main>
    </div>
  );
}
