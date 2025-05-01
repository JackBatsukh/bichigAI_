import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = (file as File).name;

  let extractedText = "";

  if (fileName.endsWith(".pdf")) {
    try {
      const parsed = await pdf(buffer);
      extractedText = parsed.text;
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to parse PDF" },
        { status: 500 }
      );
    }
  } else if (fileName.endsWith(".docx")) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to parse DOCX" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  }

  const document = await prisma.document.create({
    data: { text: extractedText },
  });

  return NextResponse.json({ document });
}
