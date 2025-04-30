import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  const latestDoc = await prisma.document.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(latestDoc);
}
