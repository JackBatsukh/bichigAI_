'use client';

import { useEffect, useState } from 'react';

type Document = {
  id: string;
  text: string;
  createdAt: string;
};

export default function LatestDocument() {
  const [doc, setDoc] = useState<Document | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDoc(data);
    };

    fetchDoc();
  }, []);

  if (!doc) return <p className="text-black text-sm">No document found.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto mt-4 border rounded bg-gray-50">
      <h2 className="text-lg font-medium mb-2">Latest Uploaded PDF Text</h2>
      <p className="text-sm text-black mb-2">
        Uploaded: {new Date(doc.createdAt).toLocaleString()}
      </p>
      <pre className="whitespace-pre-wrap text-black text-sm">{doc.text}</pre>
    </div>
  );
}
