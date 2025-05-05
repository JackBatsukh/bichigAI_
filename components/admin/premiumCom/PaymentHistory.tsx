"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/adminUI/table";
import { Badge } from "@/components/ui/adminUI/badge";
import {motion} from "framer-motion";

export default function PaymentHistory() {
   const payments = [
    { id: "1", user: "Баяржавхлан", amount: "10000₮", date: "2024-03-01", status: "success", method: "Card" },
    { id: "2", user: "Бэлгүдэй", amount: "10000₮", date: "2024-03-15", status: "success", method: "QPay" },
    { id: "3", user: "Билгүүн", amount: "10000₮", date: "2024-02-01", status: "failed", method: "Card" },
    { id: "4", user: "Жавхаа", amount: "10000₮", date: "2024-02-01", status: "failed", method: "Card" },

  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-md border"
      id="paymentHistory"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Хэрэглэгч</TableHead>
            <TableHead>Үнийн дүн</TableHead>
            <TableHead>Огноо</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead>Төлбөрийн арга</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <motion.tr
              key={payment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell>{payment.user}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>
                <Badge
                  variant={payment.status === "success" ? "default" : "destructive"}
                >
                  {payment.status === "success" ? "Амжилттай" : "Амжилтгүй"}
                </Badge>
              </TableCell>
              <TableCell>{payment.method}</TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}