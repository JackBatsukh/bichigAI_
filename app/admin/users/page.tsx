'use client'
import UserTable from "@/components/admin/usersCom/UserTable";
import { motion } from "framer-motion";

export default function UsersPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mt-10"
    >
     
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        <UserTable />
      </motion.div>
    </motion.div>
  );
}
