"use client";
import { motion } from "framer-motion";
import DashboardStats from "@/components/admin/homeCom/DashboardStats";
import RecentActivity from "@/components/admin/homeCom/RecentActivity";
import UsageChart from "@/components/admin/homeCom/UsageChart";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
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
      className="space-y-6 mt-10">
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Хэрэглээний график</h2>
          <UsageChart />
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Сүүлийн үйл ажиллагаа</h2>
          <RecentActivity />
        </motion.div>
      </div>
    </motion.div>
  );
}
