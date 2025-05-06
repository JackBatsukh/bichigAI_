"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message || "Upload complete");

    if (data.document?.text) {
      localStorage.setItem("pdfText", data.document.text);
      router.push("/chat");
    }
  };

  return (
    <div className="p-4 border rounded w-full max-w-md mx-auto">
      <input
        type="file"
        accept="application/pdf, .docx, .doc"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2 border border-black"
      />
      <button
        onClick={handleUpload}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Upload PDF
      </button>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </div>
  );
}