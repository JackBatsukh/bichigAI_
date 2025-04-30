import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = await pdf(buffer);

  const document = await prisma.document.create({
    data: { text: parsed.text },
  });

  return NextResponse.json({ document });
}
