import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";

import { PrismaClient } from "@/app/generated/prisma";
import { DefaultSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Extend the session type to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

// Extend the JWT type to include our custom fields
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

const prisma = new PrismaClient();

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
