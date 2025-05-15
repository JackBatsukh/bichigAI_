'use client';

import { useState, useEffect } from "react";
import Nav from "@/components/upload/nav";
import { useRouter } from "next/navigation";

interface RoadmapItem {
  title: string;
  content: string;
  subgroups: RoadmapItem[];
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AnalyzedData {
  documentTitle: string;
  wordCount: number;
  keyPhrases: string[];
  summary: string;
}

export default function Roadmap() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to transform AI response into roadmap items
  const transformToRoadmapItems = (data: any): RoadmapItem[] => {
    try {
      const content = data.choices[0].message.content;
      
      // Try to extract JSON from the response if it's not pure JSON
      let jsonContent = content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      const parsedData = JSON.parse(jsonContent);
      console.log('Parsed JSON:', parsedData);
      
      if (!parsedData.groups || !Array.isArray(parsedData.groups)) {
        throw new Error('Invalid response format: missing groups array');
      }

      return parsedData.groups.map((group: any) => ({
        title: group.title || 'Untitled Group',
        content: group.content || '',
        subgroups: Array.isArray(group.subgroups) 
          ? group.subgroups.map((subgroup: any) => ({
              title: subgroup.title || 'Untitled Subgroup',
              content: subgroup.content || '',
              subgroups: []
            }))
          : []
      }));
    } catch (error) {
      console.error('Error transforming AI response:', error);
      console.log('Failed to parse content:', data.choices[0].message.content);
      return [];
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const savedLanguage = localStorage.getItem("selectedLanguage");
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }

        const pdfText = localStorage.getItem("pdfText");
        const documentTitle = localStorage.getItem("documentTitle");

        if (pdfText && documentTitle) {
          setIsLoading(true);
          const systemMessage = selectedLanguage === "mn"
            ? `Та "${documentTitle}" баримт бичгийг шинжилж байна. Энэ бол агуулга:\n\n${pdfText}\n\nТА ЗӨВХӨН JSON ФОРМАТААР ХАРИУЛАХ ШААРДЛАГАТАЙ. JSON өгөгдлийн бүтэц дараах шаардлагуудыг хангасан байх ёстой: Бүлэг, Дэд бүлэг, болон тэдгээртэй холбоотой мэдээлэл агуулсан байх. Бүлэг болон дэд бүлгүүд нь хоорондын логик хамаарлаар зохион байгуулагдсан, шаталсан (hierarchical) бүтэцтэй байна. Хариу нь зөвхөн JSON объект байх ёстой бөгөөд дараах бүтэцтэй байх ёстой: { "groups": [{ "title": "string", "content": "string", "subgroups": [{ "title": "string", "content": "string" }] }] }`
            : `You are analyzing a document titled "${documentTitle}". Here is the content:\n\n${pdfText}\n\nYOU MUST RESPOND WITH ONLY JSON FORMAT. The JSON data structure should organize content into groups and subgroups, where each group and subgroup has a title and related content. The structure should reflect the logical hierarchy between groups and subgroups. The response must be a valid JSON object with the following structure: { "groups": [{ "title": "string", "content": "string", "subgroups": [{ "title": "string", "content": "string" }] }] }`;

          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer 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`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "meta-llama/llama-4-maverick:free",
              messages: [
                {
                  role: "system",
                  content: systemMessage
                }
              ]
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to analyze document');
          }

          const data = await response.json();
          const aiResponse = data.choices[0].message.content;
          console.log('Raw AI Response:', aiResponse);
          
          // Transform and save the roadmap items
          const transformedItems = transformToRoadmapItems(data);
          console.log('Transformed Roadmap Items:', transformedItems);
          setRoadmapItems(transformedItems);

          setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

          // Basic analysis
          const words = pdfText.split(/\s+/).filter(word => word.length > 0);
          const wordCount = words.length;

          // Extract key phrases
          const stopWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of"];
          const wordFreq: { [key: string]: number } = {};
          words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
            if (!stopWords.includes(cleanWord) && cleanWord.length > 3) {
              wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
            }
          });
          const keyPhrases = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word]) => word);

          // Generate summary
          const summary = words.slice(0, 200).join(" ") + (words.length > 200 ? "..." : "");

          setAnalyzedData({
            documentTitle,
            wordCount,
            keyPhrases,
            summary,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error analyzing document:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      initializeData();
    }
  }, [selectedLanguage, mounted]);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 text-white relative bg-gradient-to-b from-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col">
        <Nav />

        <div className="mt-8">
          

          {/* Analyzed Data Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              Analyzed Document Data
            </h2>
            {isLoading ? (
              <div className="bg-gray-900/80 rounded-lg p-6 shadow-xl backdrop-blur-sm border border-blue-800/30 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">Analyzing document...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/80 rounded-lg p-6 shadow-xl backdrop-blur-sm border border-red-800/30 text-center text-red-200">
                {error}
              </div>
            ) : analyzedData ? (
              <div className="bg-gray-900/80 rounded-lg p-6 shadow-xl backdrop-blur-sm border border-blue-800/30 hover:shadow-blue-900/20 transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {analyzedData.documentTitle}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-bold">Word Count:</span> {analyzedData.wordCount}
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-bold">Key Phrases:</span>{" "}
                  {analyzedData.keyPhrases.join(", ")}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="font-bold">Summary:</span> {analyzedData.summary}
                </p>
              </div>
            ) : (
              <div className="bg-gray-900/80 rounded-lg p-6 shadow-xl backdrop-blur-sm border border-blue-800/30 text-center text-gray-400">
                No document data available. Upload a document in the chat interface to see analysis here.
              </div>
            )}
          </div>

          {/* Roadmap Section */}
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Development Roadmap
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-700 h-full opacity-50"></div>

            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Timeline Content */}
                <div
                  className={`w-1/2 p-4 ${
                    index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                  }`}
                >
                  <div 
                    className="bg-gray-900/80 rounded-lg p-5 shadow-xl backdrop-blur-sm border border-blue-800/30 hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                  >
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm mt-2">
                      {item.content}
                    </p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="w-8 h-8 relative">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 shadow-glow">
                    <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"></div>
                  </div>
                </div>

                {/* Spacer */}
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h3 className="text-2xl font-semibold text-white mb-4">
                {selectedItem.title}
              </h3>
              
              <div className="text-gray-300 mb-6">
                {selectedItem.content}
              </div>

              {selectedItem.subgroups && selectedItem.subgroups.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-blue-400 mb-3">
                    Дэд шаардлагууд
                  </h4>
                  {selectedItem.subgroups.map((subgroup, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                      <h5 className="text-lg font-medium text-blue-300 mb-2">
                        {subgroup.title}
                      </h5>
                      <p className="text-gray-300">
                        {subgroup.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back to Chat Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/chat")}
            className="bg-gradient-custom animate-gradient p-3 rounded-lg text-white shadow-blue hover:bg-gradient-to-br hover:from-pink-500/80 hover:to-purple-600/80 transition"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
}