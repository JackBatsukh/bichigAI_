"use client";
import {motion} from "framer-motion";

export default function RecentActivity() {
  const activities = [
    { id: 1, user: "Болд Баатар", action: "шинэ хэрэглэгч бүртгүүлсэн", time: "5 минут өмнө" },
    { id: 2, user: "Сараа Ганбаатар", action: "төлбөрт гишүүн болсон", time: "30 минут өмнө" },
    { id: 3, user: "Бат-Эрдэнэ", action: "PDF файл татав", time: "1 цаг өмнө" },
    { id: 4, user: "Тэмүүжин", action: "системээс гарсан", time: "2 цаг өмнө" },
  ];

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <motion.li
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <span className="text-white font-semibold">{activity.user.charAt(0)}</span>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {activity.user}{" "}
                      <span className="font-medium text-gray-900">{activity.action}</span>
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
