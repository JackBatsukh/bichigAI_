import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import next from "next";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const history = await prisma.document.findMany({
      where: {
        userId: session?.user?.id,
      },
    });
    return NextResponse.json({ history });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
