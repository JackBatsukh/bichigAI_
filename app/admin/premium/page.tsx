'use client'
import { motion } from "framer-motion";
import PremiumStats from "@/components/admin/premiumCom/PremiumStats";
import SubscriptionList from "@/components/admin/premiumCom/SubscriptionList";
import PaymentHistory from "@/components/admin/premiumCom/PaymentHistory";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PremiumPage() {
  const { data: session } = useSession();
    
  
    const router = useRouter();
  
    useEffect(() => {
      if (session?.user.role == "USER") {
        router.push("/");
      }
    }, [session]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mt-10 text-black"
    >
      <PremiumStats />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow my-8 mt-10"
      >
        <h2 className="text-lg font-semibold mb-4">Захиалгууд</h2>
        <SubscriptionList />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        <h2 className="text-lg font-semibold mb-4">Төлбөрийн түүх</h2>
        <PaymentHistory />
      </motion.div>
    </motion.div>
  );
}