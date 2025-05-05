"use client";
import { motion } from "framer-motion";
export default function DashboardStats() {
  const stats = [
    { title: "Нийт хэрэглэгч", value: "1,234", change: "+12%", trend: "up" },
    { title: "Идэвхтэй хэрэглэгч", value: "890", change: "+5%", trend: "up" },
    { title: "Төлбөрт хэрэглэгч", value: "456", change: "+8%", trend: "up" },
    { title: "Нийт орлого", value: "₮12,345,678", change: "+15%", trend: "up" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-4"
        >
          <div className="p-3 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}