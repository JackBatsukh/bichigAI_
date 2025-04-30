"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); // ✅ match backend

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const { document } = await res.json();

    // Teleport to chat page with extracted text as a query param
    router.push(`/chat?text=${encodeURIComponent(document.text)}`);
  };

  return (
    <div className="p-4 border rounded w-full max-w-md mx-auto">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2 border border-black"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded">
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}
