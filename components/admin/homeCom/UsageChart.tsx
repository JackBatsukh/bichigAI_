"use client";
import {motion} from "framer-motion";
export default function UsageChart() {
const data = [
    { month: "1-р сар", users: 400, premium: 100 },
    { month: "2-р сар", users: 600, premium: 150 },
    { month: "3-р сар", users: 800, premium: 200 },
    { month: "4-р сар", users: 1000, premium: 300 },
    { month: "5-р сар", users: 1200, premium: 400 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-64"
    >
      <div className="flex items-end space-x-2 h-full">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex-1 flex flex-col items-center"
          >
            <div className="w-full flex justify-center space-x-1">
              <div
                className="w-1/2 bg-blue-500 rounded-t"
                style={{ height: `${(item.users / 1200) * 100}%` }}
              />
              <div
                className="w-1/2 bg-green-500 rounded-t"
                style={{ height: `${(item.premium / 400) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">{item.month}</div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <span className="text-xs text-gray-500">Нийт хэрэглэгч</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
          <span className="text-xs text-gray-500">Төлбөрт хэрэглэгч</span>
        </div>
      </div>
    </motion.div>
  );
}
