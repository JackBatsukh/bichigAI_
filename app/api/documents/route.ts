import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const latestDoc = await prisma.document.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(latestDoc);
}
