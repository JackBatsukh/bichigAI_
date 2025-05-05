"use client";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/adminUI/table";
import { Badge } from "@/components/ui/adminUI/badge";
import Link from "next/link";

export default function SubscriptionList() {
  const subscriptions = [
    {
      id: "1",
      user: "Бат-Эрдэнэ",
      plan: "Premium",
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-04-01",
    },
    {
      id: "2",
      user: "Сараа",
      plan: "Premium",
      status: "active",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
    },
    {
      id: "3",
      user: "Төгөлдөр",
      plan: "Premium",
      status: "expired",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
    },
    {
      id: "1",
      user: "Бат-Эрдэнэ",
      plan: "Premium",
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-04-01",
    },
    {
      id: "2",
      user: "Сараа",
      plan: "Premium",
      status: "active",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
    },
    {
      id: "3",
      user: "Төгөлдөр",
      plan: "Premium",
      status: "expired",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
    },
    {
      id: "1",
      user: "Бат-Эрдэнэ",
      plan: "Premium",
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-04-01",
    },
    {
      id: "2",
      user: "Сараа",
      plan: "Premium",
      status: "active",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
    },
    {
      id: "3",
      user: "Төгөлдөр",
      plan: "Premium",
      status: "expired",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
    },
    {
      id: "1",
      user: "Бат-Эрдэнэ",
      plan: "Premium",
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-04-01",
    },
    {
      id: "2",
      user: "Сараа",
      plan: "Premium",
      status: "active",
      startDate: "2024-03-15",
      endDate: "2024-04-15",
    },
    {
      id: "3",
      user: "Төгөлдөр",
      plan: "Premium",
      status: "expired",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-md border"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Хэрэглэгч</TableHead>
            <TableHead>Төлөвлөгөө</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead>Эхлэх огноо</TableHead>
            <TableHead>Дуусах огноо</TableHead>
            <TableHead>Дэлгэрэнгүй</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <motion.tr
              key={subscription.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell>{subscription.user}</TableCell>
              <TableCell>{subscription.plan}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    subscription.status === "active" ? "default" : "secondary"
                  }
                >
                  {subscription.status === "active" ? "Идэвхтэй" : "Дууссан"}
                </Badge>
              </TableCell>
              <TableCell>{subscription.startDate}</TableCell>
              <TableCell>{subscription.endDate}</TableCell>
              <Link
                href="#paymentHistory"
                className="text-black hover:text-blue-500 flex justify-start mt-4"
              >
                Харах
              </Link>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
