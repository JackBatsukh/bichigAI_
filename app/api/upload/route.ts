import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (!extractedText) {
      return NextResponse.json(
        { error: "No text content extracted from file" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        content: extractedText,
        title: fileName,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      document: {
        id: document.id,
        text: document.content,
        title: document.title,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
