"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Folder,
  Mic,
  StopCircle,
  Clock,
  File,
} from "lucide-react";
import Nav from "@/components/upload/nav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FileWithPreview extends File {
  preview?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface HistoryItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// SpeechToText Component
const SpeechToText: React.FC<{ onTranscriptChange: (transcript: string) => void; selectedLanguage: string }> = ({
  onTranscriptChange,
  selectedLanguage,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const SpeechRecognitionAPI =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (SpeechRecognitionAPI) {
      try {
        recognitionRef.current = new SpeechRecognitionAPI() as SpeechRecognition;
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = selectedLanguage === "mn" ? "mn-MN" : "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          const combinedTranscript = finalTranscript + interimTranscript;
          setTranscript(combinedTranscript);
          onTranscriptChange(combinedTranscript);
          console.log("Transcript updated:", combinedTranscript);
        };

        recognitionRef.current.onerror = (event: Event) => {
          console.error("Speech recognition error:", event);
          setError(
            selectedLanguage === "mn"
              ? "Хэл яриаг танихад алдаа гарлаа. Микрофоны зөвшөөрлийг шалгана уу."
              : "Speech recognition error. Please check microphone permissions."
          );
          stopRecording();
        };

        recognitionRef.current.onend = () => {
          if (isRecording && recognitionRef.current) {
            console.log("Recognition ended, restarting...");
            try {
              recognitionRef.current.start();
            } catch (err) {
              console.error("Failed to restart recognition:", err);
              setIsRecording(false);
            }
          }
        };
      } catch (err) {
        console.error("Failed to initialize SpeechRecognition:", err);
        setError(
          selectedLanguage === "mn"
            ? "Хэл яриаг танихыг эхлүүлж чадсангүй."
            : "Failed to initialize speech recognition."
        );
      }
    } else {
      setError(
        selectedLanguage === "mn"
          ? "Энд хөтөч дээр хэл яриаг танихыг дэмждэггүй. Chrome эсвэл Edge ашиглана уу."
          : "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      console.error("SpeechRecognition API not supported.");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Error stopping recognition:", err);
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onTranscriptChange, selectedLanguage]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        setIsRecording(true);
        setTimer(0);
        setTranscript("");
        setError(null);
        recognitionRef.current.start();
        console.log("Recording started");
      } catch (err) {
        console.error("Error starting recording:", err);
        setError(
          selectedLanguage === "mn"
            ? "Бичлэг эхлүүлэхэд алдаа гарлаа."
            : "Failed to start recording."
        );
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
        console.log("Recording stopped");
      } catch (err) {
        console.error("Error stopping recording:", err);
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-between h-60 md:h-80 bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30 rounded-md border-2 border-blue-500 p-4 shadow-lg"
    >
      {error ? (
        <div className="flex-1 flex items-center justify-center text-red-400 text-sm md:text-base text-center">
          {error}
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 md:p-4 rounded-full bg-gradient-to-r ${
                isRecording ? "from-red-600 to-red-700" : "from-blue-600 to-purple-600"
              } hover:from-blue-700 hover:to-purple-700 transition-colors shadow-md`}
            >
              {isRecording ? <StopCircle size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
            </button>
            <div className="text-blue-200 text-lg md:text-xl font-semibold">
              {isRecording
                ? `${selectedLanguage === "mn" ? "Бичлэг хийж байна" : "Recording"}: ${formatTime(timer)}`
                : selectedLanguage === "mn"
                ? "Бичлэг эхлүүлэх"
                : "Start Recording"}
            </div>
          </div>
          <div className="w-full flex-1 mt-4">
            <h3 className="text-blue-100 text-sm md:text-base font-medium mb-2">
              {selectedLanguage === "mn" ? "Хөрвүүлсэн Текст" : "Transcribed Text"}
            </h3>
            <div
              className="w-full h-32 md:h-48 bg-slate-800 rounded-md p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 text-blue-300 text-sm md:text-base shadow-md"
            >
              {transcript ? (
                transcript
              ) : (
                <p className="text-center text-blue-300 text-xs md:text-sm">
                  {isRecording
                    ? selectedLanguage === "mn"
                      ? "Микрофон руу тодорхой ярь"
                      : "Speak clearly into your microphone"
                    : selectedLanguage === "mn"
                    ? "Одоогоор хөрвүүлэг байхгүй"
                    : "No transcription yet"}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// UploadPage Component
export default function UploadPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"Upload File" | "Microphone" | "Enter Text">("Upload File");
  const [text, setText] = useState<string>("");
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [showFileSelector, setShowFileSelector] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const analyzerRef = useRef<HTMLDivElement>(null);

  // Match history section height to AI Analyzer section
  useEffect(() => {
    const matchHeights = () => {
      if (historyRef.current && analyzerRef.current) {
        const analyzerHeight = analyzerRef.current.offsetHeight;
        historyRef.current.style.height = `${analyzerHeight}px`;
      }
    };

    matchHeights(); // Initial match
    window.addEventListener("resize", matchHeights);

    return () => {
      window.removeEventListener("resize", matchHeights);
    };
  }, [activeTab]); // Re-run when tab changes (affects analyzer height)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/user/history");
        if (!res.ok) {
          throw new Error(`Failed to fetch history: ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data.history)) {
          setHistory(data.history);
          setHistoryError(null);
        } else {
          throw new Error("Invalid history data");
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        setHistoryError(
          selectedLanguage === "mn"
            ? "Түүхийг ачаалахад алдаа гарлаа. Дахин оролдоно уу."
            : "Failed to load history. Please try again."
        );
      }
    };

    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session, selectedLanguage]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const downloadTextAsFile = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([text], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "analysis-text.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error("Error downloading text:", err);
      setError(
        selectedLanguage === "mn"
          ? "Текстийг татахад алдаа гарлаа."
          : "Failed to download text."
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0] as FileWithPreview;
      setSelectedFile(file);
      setShowFileSelector(false);
    }
  };

  const openFileSelector = () => {
    setShowFileSelector(true);
  };

  const selectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRunAnalyze = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!session?.user?.id) {
        throw new Error(
          selectedLanguage === "mn"
            ? "Файл байршуулахын тулд нэвтэрнэ үү"
            : "Please log in to upload files"
        );
      }

      const contentToAnalyze = activeTab === "Microphone" ? transcribedText : text;

      if (activeTab === "Upload File" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error ||
              (selectedLanguage === "mn"
                ? "Файл байршуулахад алдаа гарлаа"
                : "Failed to upload file")
          );
        }

        const data = await res.json();

        if (data.document?.text) {
          localStorage.setItem("pdfText", data.document.text);
          localStorage.setItem("documentTitle", data.document.title);
          localStorage.setItem("selectedLanguage", selectedLanguage);
          localStorage.setItem(
            "initialMessage",
            selectedLanguage === "mn"
              ? `${data.document.title} баримт бичгийг тайлбарлана уу.`
              : `Please analyze this document: ${data.document.title}`
          );

          router.push("/chat");
        } else {
          throw new Error(
            selectedLanguage === "mn"
              ? "Баримт бичигт текстын агуулга олдсонгүй"
              : "No text content found in the document"
          );
        }
      } else if (contentToAnalyze) {
        localStorage.setItem("pdfText", contentToAnalyze);
        localStorage.setItem("documentTitle", selectedLanguage === "mn" ? "Текстийн Шинжилгээ" : "Text Analysis");
        localStorage.setItem("selectedLanguage", selectedLanguage);
        localStorage.setItem(
          "initialMessage",
          selectedLanguage === "mn"
            ? "Энэ текстийг тайлбарлана уу."
            : "Please analyze this text."
        );

        router.push("/chat");
      } else {
        throw new Error(
          selectedLanguage === "mn"
            ? "Шинжилгээнд зориулж агуулга өгөөгүй байна"
            : "No content provided for analysis"
        );
      }
    } catch (err) {
      console.error("Error in handleRunAnalyze:", err);
      setError(
        err instanceof Error
          ? err.message
          : selectedLanguage === "mn"
          ? "Файл/текстийг боловсруулахад алдаа гарлаа."
          : "Failed to process the file/text."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative">
      <div className="min-h-screen w-full absolute z-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      <div className="container mx-auto px-4 py-6 z-10 relative">
        <Nav />
        <div className="flex flex-col md:flex-row gap-4">
          {/* History Section - Left Sidebar, Matches AI Analyzer Height */}
          <div
            ref={historyRef}
            className="w-full md:w-72 h-auto bg-gradient-to-b from-slate-900 to-slate-800 bg-opacity-95 rounded-lg border border-slate-700 border-opacity-50 shadow-lg"
          >
            <div className="p-4 border-b border-slate-600 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-blue-400" />
                <h2 className="font-semibold text-blue-100">
                  {selectedLanguage === "mn" ? "Сүүлийн Түүх" : "Recent History"}
                </h2>
              </div>
            </div>
            <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 h-[calc(100%-4rem)]">
              {historyError ? (
                <div className="p-6 text-center">
                  <p className="text-red-400 text-sm">{historyError}</p>
                  <button
                    onClick={() => {
                      setHistoryError(null);
                      if (session?.user?.id) {
                        fetch("/api/user/history")
                          .then((res) => res.json())
                          .then((data) => setHistory(data.history || []))
                          .catch(() =>
                            setHistoryError(
                              selectedLanguage === "mn"
                                ? "Түүхийг ачаалахад алдаа гарлаа."
                                : "Failed to load history."
                            )
                          );
                      }
                    }}
                    className="mt-2 text-blue-300 text-xs hover:underline"
                  >
                    {selectedLanguage === "mn" ? "Дахин оролдох" : "Retry"}
                  </button>
                </div>
              ) : history.length > 0 ? (
                history.map((item: HistoryItem) => (
                  <div
                    key={item.id}
                    className="mx-2 mb-2 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/70 cursor-pointer transition-all border border-slate-700/30 hover:border-blue-500/30"
                    onClick={() => {
                      console.log("History item clicked:", item);
                      localStorage.setItem("pdfText", item.content || "");
                      localStorage.setItem(
                        "documentTitle",
                        item.title || (selectedLanguage === "mn" ? "Гарчиггүй" : "Untitled")
                      );
                      localStorage.setItem("selectedLanguage", selectedLanguage);
                      localStorage.setItem(
                        "initialMessage",
                        selectedLanguage === "mn"
                          ? `${item.title || "Гарчиггүй"} баримт бичгийг тайлбарлана уу.`
                          : `Please analyze this document: ${item.title || "Untitled"}`
                      );
                      router.push("/chat");
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <File size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">
                          {item.title || (selectedLanguage === "mn" ? "Гарчиггүй" : "Untitled")}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {(item.content?.substring(0, 80) ||
                            (selectedLanguage === "mn" ? "Агуулга байхгүй" : "No content")) + "..."}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-slate-500">
                          <Clock size={12} className="mr-1" />
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  selectedLanguage === "mn" ? "mn-MN" : "en-US"
                                )
                              : selectedLanguage === "mn"
                              ? "Тодорхойгүй огноо"
                              : "Unknown date"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText size={20} className="text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-sm">
                    {selectedLanguage === "mn" ? "Одоогоор түүх байхгүй" : "No history yet"}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {selectedLanguage === "mn"
                      ? "Таны шинжилсэн баримт бичгүүд энд харагдана"
                      : "Your analyzed documents will appear here"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content (AI Analyzer) */}
          <div ref={analyzerRef} className="flex-1 bg-slate-900/95 rounded-lg p-4 md:p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 md:mb-6">
              {selectedLanguage === "mn" ? "Хиймэл Оюуны Шинжээч" : "AI Analyzer"}
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 rounded-md text-red-300 text-sm">
                {error}
              </div>
            )}
            <div className="flex mb-4 md:mb-6">
              <button
                className={`flex-1 py-2 md:py-3 text-center rounded-l-md border border-slate-700 text-sm md:text-base ${
                  activeTab === "Upload File" ? "bg-slate-800" : "bg-slate-900"
                }`}
                onClick={() => setActiveTab("Upload File")}
              >
                {selectedLanguage === "mn" ? "Файл байршуулах" : "Upload File"}
              </button>
              <button
                className={`flex-1 py-2 md:py-3 text-center border-t border-b border-slate-700 text-sm md:text-base ${
                  activeTab === "Microphone" ? "bg-slate-800" : "bg-slate-900"
                }`}
                onClick={() => setActiveTab("Microphone")}
              >
                <div className="flex items-center justify-center">
                  <Mic size={16} className="mr-1" />
                  <span>{selectedLanguage === "mn" ? "Микрофон" : "Microphone"}</span>
                </div>
              </button>
              <button
                className={`flex-1 py-2 md:py-3 text-center rounded-r-md border border-slate-700 text-sm md:text-base ${
                  activeTab === "Enter Text" ? "bg-slate-800" : "bg-slate-900"
                }`}
                onClick={() => setActiveTab("Enter Text")}
              >
                {selectedLanguage === "mn" ? "Текст оруулах" : "Enter Text"}
              </button>
            </div>
            {activeTab === "Upload File" ? (
              <>
                <input
                  type="file"
                  accept="application/pdf, .docx, .doc"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {!showFileSelector ? (
                  <div
                    className={`border-2 border-dashed rounded-md h-60 md:h-80 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isHovering
                        ? "bg-gradient-to-br from-blue-600 to-purple-600 bg-opacity-40 border-blue-400"
                        : "bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30 border-blue-500"
                    } shadow-lg`}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={selectedFile ? openFileSelector : selectFile}
                  >
                    {selectedFile ? (
                      <>
                        <FileText size={24} className="mb-2 md:mb-4 text-blue-300" />
                        <p className="text-center mb-1 text-blue-100 text-sm md:text-base">
                          {selectedFile.name}
                        </p>
                        <p className="text-center text-xs md:text-sm text-blue-200">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <button className="mt-2 md:mt-4 text-blue-300 text-xs md:text-sm hover:underline">
                          {selectedLanguage === "mn" ? "Файлыг солих" : "Change file"}
                        </button>
                      </>
                    ) : (
                      <>
                        <div
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600 bg-opacity-50 flex items-center justify-center mb-2 md:mb-4 shadow-md"
                        >
                          <Upload size={20} className="text-blue-200 md:hidden" />
                          <Upload size={32} className="text-blue-200 hidden md:block" />
                        </div>
                        <p className="text-center mb-1 text-blue-100 font-medium text-sm md:text-base">
                          {selectedLanguage === "mn"
                            ? "Шинжилгээнд зориулж файлаа сонго"
                            : "Choose your file to run"}
                        </p>
                        <p className="text-center text-blue-200 text-xs md:text-sm">
                          {selectedLanguage === "mn" ? "шинжилгээ" : "analyze"}
                        </p>
                        {isHovering && (
                          <button
                            className="mt-3 md:mt-4 px-4 md:px-6 py-1 md:py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors text-white font-medium text-xs md:text-base shadow-md"
                          >
                            {selectedLanguage === "mn" ? "Файл сонгох" : "Select File"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    className="border-2 border-blue-500 rounded-md h-60 md:h-80 p-3 md:p-4 bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30 shadow-lg"
                  >
                    <div className="flex justify-between items-center mb-3 md:mb-4 pb-2 border-b border-blue-700">
                      <h3 className="font-medium text-blue-200 text-sm md:text-base">
                        {selectedLanguage === "mn" ? "Файл сонгох" : "Select a file"}
                      </h3>
                      <button
                        onClick={() => setShowFileSelector(false)}
                        className="text-blue-300 hover:text-white text-sm md:text-base"
                      >
                        {selectedLanguage === "mn" ? "Цуцлах" : "Cancel"}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <div
                        className="flex flex-col items-center justify-center p-2 md:p-4 border border-blue-700 rounded-md hover:bg-blue-700 hover:bg-opacity-30 cursor-pointer bg-blue-800 bg-opacity-20 shadow-md"
                        onClick={selectFile}
                      >
                        <Folder size={24} className="mb-1 md:mb-2 text-blue-300 md:hidden" />
                        <Folder size={40} className="mb-2 text-blue-300 hidden md:block" />
                        <p className="text-blue-100 text-sm md:text-base">
                          {selectedLanguage === "mn" ? "Компьютер" : "Computer"}
                        </p>
                      </div>
                      <div
                        className="flex flex-col items-center justify-center p-2 md:p-4 border border-blue-700 rounded-md hover:bg-blue-700 hover:bg-opacity-30 cursor-pointer bg-blue-800 bg-opacity-20 shadow-md"
                        onClick={selectFile}
                      >
                        <Folder size={24} className="mb-1 md:mb-2 text-blue-300 md:hidden" />
                        <Folder size={40} className="mb-2 text-blue-300 hidden md:block" />
                        <p className="text-blue-100 text-sm md:text-base">
                          {selectedLanguage === "mn" ? "Ширээний компьютер" : "Desktop"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : activeTab === "Microphone" ? (
              <SpeechToText onTranscriptChange={setTranscribedText} selectedLanguage={selectedLanguage} />
            ) : (
              <div
                className="border border-slate-700 rounded-md h-60 md:h-80 flex flex-col bg-blue-950 bg-opacity-20 shadow-lg"
              >
                <textarea
                  className="w-full h-full p-3 md:p-4 bg-slate-800 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm md:text-base"
                  placeholder={
                    selectedLanguage === "mn"
                      ? "Шинжилгээнд зориулж текстээ энд оруулна уу..."
                      : "Enter your text here for analysis..."
                  }
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {text && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={downloadTextAsFile}
                      className="text-xs md:text-sm text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      {selectedLanguage === "mn"
                        ? "Текстын файл болгон татах"
                        : "Download as text file"}
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 md:mt-6">
              <select
                className="bg-slate-900 border border-slate-700 rounded-md px-3 md:px-4 py-1 md:py-2 w-24 md:w-32 text-sm md:text-base"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="mn">Монгол</option>
              </select>
            </div>
            <button
              className="mt-4 md:mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md py-2 md:py-3 w-full hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-md"
              disabled={
                (activeTab === "Upload File" && !selectedFile) ||
                (activeTab === "Enter Text" && !text) ||
                (activeTab === "Microphone" && !transcribedText) ||
                isLoading
              }
              onClick={handleRunAnalyze}
            >
              {isLoading
                ? selectedLanguage === "mn"
                  ? "Боловсруулж байна..."
                  : "Processing..."
                : selectedLanguage === "mn"
                ? "Шинжилгээ хийх"
                : "Run analyze"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}