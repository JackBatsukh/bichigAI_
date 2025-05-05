// "use client";
// import FileUpload from "@/components/FileUpload";
// import LatestDocument from "@/components/LatestDocument";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="max-w-md w-full">
//         <FileUpload />
//         <LatestDocument />
//       </div>
//     </div>
//   );
// }

import HeroSection from '@/components/land/HeroSection';
import FeaturesGrid from '@/components/land/FeaturesGrid';
import HowItWorks from '@/components/land/HowItWorks';
import PricingSection from '@/components/land/PricingSection';
import Footer from '@/components/land/footer';
export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 h-screen">
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <PricingSection />
      <Footer/>
    </main>
  );
}
