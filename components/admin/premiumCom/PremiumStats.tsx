"use client";

import { Card } from "@/components/ui/adminUI/card";
import {motion} from "framer-motion";

export default function PremiumStats() {
const stats = [
    { title: "Нийт төлбөрт гишүүд", value: "1,234", change: "+12%", changeType: "positive" },
    { title: "Идэвхтэй захиалгууд", value: "890", change: "+5%", changeType: "positive" },
    { title: "Сарын орлого", value: "$12,345", change: "+8%", changeType: "positive" },
    { title: "Дундаж захиалгын үнэ", value: "$29.99", change: "-2%", changeType: "negative" },
  ];

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 bg-[#01081d]/35 border-none hover:bg-[#01081d]/10 hover:shadow-lg transition-shadow ">
            <h3 className="text-xl font-medium text-gray-200">{stat.title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-green-400"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}