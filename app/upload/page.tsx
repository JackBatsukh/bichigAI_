"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  ChevronDown,
  LogOut,
  User,
  FileText,
  Folder,
  Mic,
  MicOff,
  StopCircle,
} from "lucide-react";
import Nav from "@/components/upload/nav";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface FileWithPreview extends File {
  preview?: string;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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

  // Microphone related states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [browserSupport, setBrowserSupport] = useState<boolean>(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");
  const isManuallyStoppedRef = useRef<boolean>(false);

  // Waveform related states
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Log when canvasRef is set
  useEffect(() => {
    console.log("Canvas ref updated:", !!canvasRef.current);
  }, [canvasRef.current]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (!SpeechRecognition) {
      setBrowserSupport(false);
      setSpeechError("Таны браузер яриа таних үйлдлийг дэмжихгүй байна.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage === "mn" ? "mn-MN" : "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscriptRef.current += text + " ";
        } else {
          interimTranscript += text;
        }
      }
      setTranscribedText(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setSpeechError(`Алдаа: ${event.error}`);
      setIsRecording(false);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (!isManuallyStoppedRef.current && isRecording) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [SpeechRecognition, selectedLanguage, isRecording]);

  // Clean up recording and waveform resources on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopRecording();
      cleanupWaveform();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Setup waveform when isRecording is true
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout | null = null;
    if (isRecording && streamRef.current) {
      const attemptSetup = (attempt = 1) => {
        console.log(`Attempt ${attempt}: Setting up waveform, canvas available:`, !!canvasRef.current);
        if (canvasRef.current) {
          setupWaveform(streamRef.current!);
        } else if (attempt < 3) {
          console.warn("Canvas not found, retrying...");
          retryTimeout = setTimeout(() => attemptSetup(attempt + 1), 100);
        } else {
          console.error("Canvas not found after retries");
        }
      };
      attemptSetup();
    }
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (isRecording) {
        cleanupWaveform();
      }
    };
  }, [isRecording]);

  // Update transcribed text to main text when switching tabs
  useEffect(() => {
    if (activeTab !== "Microphone" && transcribedText) {
      setText((prevText) => (prevText ? `${prevText}\n${transcribedText}` : transcribedText));
      setTranscribedText("");
      finalTranscriptRef.current = "";
    }
  }, [activeTab, transcribedText]);

  const downloadTextAsFile = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "analysis-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

      if (!session?.user?.id) {
        throw new Error("Please log in to upload files");
      }

      const contentToAnalyze = activeTab === "Microphone" ? transcribedText : text;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to upload file");
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
          throw new Error("No text content found in the document");
        }
      } else if (contentToAnalyze) {
        localStorage.setItem("pdfText", contentToAnalyze);
        localStorage.setItem("documentTitle", "Text Analysis");
        localStorage.setItem("selectedLanguage", selectedLanguage);
        localStorage.setItem(
          "initialMessage",
          selectedLanguage === "mn"
            ? "Энэ текстийг тайлбарлана уу."
            : "Please analyze this text."
        );

        router.push("/chat");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to process the file/text. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Waveform visualization setup
  const setupWaveform = (stream: MediaStream) => {
    console.log("Setting up waveform, canvas available:", !!canvasRef.current);
    if (!canvasRef.current) {
      console.error("Canvas not found, aborting waveform setup");
      return;
    }

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current.resume().then(() => console.log("AudioContext resumed"));

    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth * window.devicePixelRatio;
      canvas.height = window.innerWidth < 768 ? 80 : 96; // h-20 (80px) on mobile, h-24 (96px) on desktop
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${canvas.height / window.devicePixelRatio}px`;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawWaveform = () => {
      if (!canvas || !ctx || !analyserRef.current) {
        console.warn("Waveform drawing aborted: missing canvas, context, or analyser");
        return;
      }

      analyserRef.current.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width / window.devicePixelRatio, 0);
      gradient.addColorStop(0, "#3b82f6"); // blue-500
      gradient.addColorStop(1, "#9333ea"); // purple-600
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;

      ctx.beginPath();
      const sliceWidth = (canvas.width / window.devicePixelRatio) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * (canvas.height / window.devicePixelRatio)) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio / 2);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();
  };

  // Clean up waveform resources
  const cleanupWaveform = () => {
    console.log("Cleaning up waveform");
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => console.log("AudioContext closed"));
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  // Microphone functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone stream acquired");
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        console.log("MediaRecorder stopped");
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        cleanupWaveform();
      };

      mediaRecorder.start();
      setIsRecording(true);

      if (recognitionRef.current) {
        setSpeechError(null);
        isManuallyStoppedRef.current = false;
        finalTranscriptRef.current = "";
        setTranscribedText("");
        recognitionRef.current.start();
      }

      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your browser permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current) {
      isManuallyStoppedRef.current = true;
      recognitionRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex-col">
      <div className="min-h-screen w-full absolute z-1 blur-shape"></div>
      <div className="blur-shape-left"></div>
      <div className="grid-bg"></div>
      <div className="container mx-auto px-4 py-6 z-10 relative">
        <Nav />
        <div
          className="flex flex-col md:flex-row"
          style={{ boxShadow: "0 20px 40px rgba(0, 20, 50, 0.8)" }}
        >
          <div className="w-full md:w-64 bg-slate-900 bg-opacity-80 rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
            <div className="p-4 border-b border-slate-700">
              <h2 className="font-semibold">History</h2>
            </div>
            <div className="py-2 overflow-x-auto whitespace-nowrap md:whitespace-normal md:overflow-x-visible">
              <div className="px-4 py-2 text-sm bg-blue-500 bg-opacity-20">Today</div>
              <div className="px-4 py-2 text-sm hover:bg-slate-800 cursor-pointer">
                Convert pdf to word free
              </div>
              <div className="px-4 py-2 text-sm hover:bg-slate-800 cursor-pointer">
                What is a moonbow
              </div>
              <div className="px-4 py-2 text-sm hover:bg-slate-800 cursor-pointer">
                Recipes with only bread...
              </div>
            </div>
          </div>
          <div className="flex-1 bg-slate-900 bg-opacity-50 rounded-b-lg md:rounded-r-lg md:rounded-bl-none p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-6">AI analyzer</h2>
            <div className="flex mb-4 md:mb-6">
              <button
                className={`flex-1 py-2 md:py-3 text-center rounded-l-md border border-slate-700 text-sm md:text-base ${
                  activeTab === "Upload File" ? "bg-slate-800" : "bg-slate-900"
                }`}
                onClick={() => setActiveTab("Upload File")}
              >
                Upload File
              </button>
              <button
                className={`flex-1 py-2 md:py-3 text-center border-t border-b border-slate-700 text-sm md:text-base ${
                  activeTab === "Microphone" ? "bg-slate-800" : "bg-slate-900"
                }`}
                onClick={() => setActiveTab("Microphone")}
              >
                <div className="flex items-center justify-center">
                  <Mic size={16} className="mr-1" />
                  <span>Microphone</span>
                </div>
              </button>
              <button
                className={`flex-1 py-2 md:py-3 text-center rounded-r-md border border-slate-700 text-sm md:text-base ${
                  activeTab === "Enter Text" ? "bg-slate-800" : "bg-slate-900"
                }`}
                onClick={() => setActiveTab("Enter Text")}
              >
                Enter Text
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
                    }`}
                    style={{
                      boxShadow: isHovering
                        ? "0 20px 40px rgba(0, 30, 80, 0.8)"
                        : "0 10px 30px rgba(0, 20, 60, 0.7)",
                    }}
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
                          Change file
                        </button>
                      </>
                    ) : (
                      <>
                        <div
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600 bg-opacity-50 flex items-center justify-center mb-2 md:mb-4"
                          style={{
                            boxShadow: "0 0 20px rgba(0, 80, 120, 0.7)",
                          }}
                        >
                          <Upload size={20} className="text-blue-200 md:hidden" />
                          <Upload size={32} className="text-blue-200 hidden md:block" />
                        </div>
                        <p className="text-center mb-1 text-blue-100 font-medium text-sm md:text-base">
                          Choose your file to run
                        </p>
                        <p className="text-center text-blue-200 text-xs md:text-sm">analyze</p>
                        {isHovering && (
                          <button
                            className="mt-3 md:mt-4 px-4 md:px-6 py-1 md:py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors text-white font-medium text-xs md:text-base"
                            style={{
                              boxShadow: "0 5px 20px rgba(0, 30, 70, 0.8)",
                            }}
                          >
                            Select File
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    className="border-2 border-blue-500 rounded-md h-60 md:h-80 p-3 md:p-4 bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30"
                    style={{ boxShadow: "0 10px 30px rgba(0, 20, 60, 0.7)" }}
                  >
                    <div className="flex justify-between items-center mb-3 md:mb-4 pb-2 border-b border-blue-700">
                      <h3 className="font-medium text-blue-200 text-sm md:text-base">
                        Select a file
                      </h3>
                      <button
                        onClick={() => setShowFileSelector(false)}
                        className="text-blue-300 hover:text-white text-sm md:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <div
                        className="flex flex-col items-center justify-center p-2 md:p-4 border border-blue-700 rounded-md hover:bg-blue-700 hover:bg-opacity-30 cursor-pointer bg-blue-800 bg-opacity-20"
                        style={{ boxShadow: "0 5px 15px rgba(0, 30, 70, 0.8)" }}
                        onClick={selectFile}
                      >
                        <Folder
                          size={24}
                          className="mb-1 md:mb-2 text-blue-300 md:hidden"
                        />
                        <Folder
                          size={40}
                          className="mb-2 text-blue-300 hidden md:block"
                        />
                        <p className="text-blue-100 text-sm md:text-base">Computer</p>
                      </div>
                      <div
                        className="flex flex-col items-center justify-center p-2 md:p-4 border border-blue-700 rounded-md hover:bg-blue-700 hover:bg-opacity-30 cursor-pointer bg-blue-800 bg-opacity-20"
                        style={{
                          boxShadow: "0 5px 15px rgba(0, 128, 255, 1)",
                        }}
                        onClick={selectFile}
                      >
                        <Folder
                          size={24}
                          className="mb-1 md:mb-2 text-blue-300 md:hidden"
                        />
                        <Folder
                          size={40}
                          className="mb-2 text-blue-300 hidden md:block"
                        />
                        <p className="text-blue-100 text-sm md:text-base">Desktop</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : activeTab === "Microphone" ? (
              <div
                className="border-2 border-blue-500 rounded-md h-60 md:h-80 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-30"
                style={{ boxShadow: "0 10px 30px rgba(0, 20, 60, 0.7)" }}
              >
                {!browserSupport ? (
                  <div className="p-4 text-red-600 font-semibold">
                    Таны браузер яриа таних үйлдлийг дэмжихгүй байна.
                  </div>
                ) : (
                  <>
                    <canvas
                      key="waveform-canvas"
                      ref={canvasRef}
                      className={`w-full h-20 md:h-24 mb-4 bg-slate-900/50 rounded-md ${
                        isRecording ? "block" : "hidden"
                      }`}
                      style={{ maxWidth: "100%" }}
                      aria-hidden="true"
                    ></canvas>
                    {isRecording ? (
                      <div className="flex flex-col items-center w-full px-4" aria-live="polite">
                        <div className="relative mb-4">
                          <div
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-600 bg-opacity-80 flex items-center justify-center animate-pulse"
                            style={{ boxShadow: "0 0 30px rgba(255, 0, 0, 0.6)" }}
                          >
                            <Mic size={32} className="text-white" />
                          </div>
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-800 px-3 py-1 rounded-full text-xs md:text-sm text-red-400">
                            {formatTime(recordingTime)}
                          </div>
                        </div>
                        {speechError && (
                          <p className="text-red-500 text-sm text-center mb-4">{speechError}</p>
                        )}
                        <p className="text-white text-sm md:text-base mb-4">Recording in progress...</p>
                        <button
                          onClick={stopRecording}
                          className="flex items-center px-4 md:px-6 py-2 md:py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium text-sm md:text-base transition-colors"
                          style={{ boxShadow: "0 5px 15px rgba(255, 0, 0, 0.4)" }}
                        >
                          <StopCircle size={16} className="mr-2" />
                          Stop Recording
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        {audioBlob ? (
                          <div className="flex flex-col items-center w-full px-4">
                            <div
                              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-600 bg-opacity-50 flex items-center justify-center mb-4"
                              style={{ boxShadow: "0 0 20px rgba(0, 255, 128, 0.7)" }}
                            >
                              <Mic size={28} className="text-white" />
                            </div>
                            <div className="w-full bg-slate-800 rounded-md p-3 md:p-4 mb-4 max-h-28 md:max-h-36 overflow-y-auto">
                              <p className="text-blue-100 text-xs md:text-sm">
                                {transcribedText || "Processing your audio..."}
                              </p>
                            </div>
                            <div className="flex space-x-2 md:space-x-4">
                              <button
                                onClick={startRecording}
                                className="flex items-center px-3 md:px-4 py-1 md:py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-xs md:text-sm"
                              >
                                <Mic size={14} className="mr-1" />
                                Record Again
                              </button>
                              <button
                                onClick={() => {
                                  setTranscribedText("");
                                  finalTranscriptRef.current = "";
                                  setAudioBlob(null);
                                }}
                                className="flex items-center px-3 md:px-4 py-1 md:py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white text-xs md:text-sm"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div
                              className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-600 bg-opacity-50 flex items-center justify-center mb-4"
                              style={{ boxShadow: "0 0 20px rgba(0, 128, 255, 0.7)" }}
                            >
                              <Mic size={30} className="text-blue-200 md:hidden" />
                              <Mic size={40} className="text-blue-200 hidden md:block" />
                            </div>
                            <p className="text-center mb-4 text-blue-100 font-medium text-sm md:text-base">
                              Click to start voice recording
                            </p>
                            <button
                              onClick={startRecording}
                              className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors text-white font-medium text-sm md:text-base"
                              style={{ boxShadow: "0 5px 20px rgba(0, 30, 70, 0.8)" }}
                            >
                              Start Recording
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div
                className="border border-slate-700 rounded-md h-60 md:h-80 flex flex-col bg-blue-950 bg-opacity-20"
                style={{ boxShadow: "0 10px 30px rgba(0, 64, 255, 1)" }}
              >
                <textarea
                  className="w-full h-full p-3 md:p-4 bg-slate-800 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm md:text-base"
                  placeholder="Enter your text here for analysis..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                {text && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={downloadTextAsFile}
                      className="text-xs md:text-sm text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      Download as text file
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
              className="mt-4 md:mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md py-2 md:py-3 w-full hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              disabled={
                (activeTab === "Upload File" && !selectedFile) ||
                (activeTab === "Enter Text" && !text) ||
                (activeTab === "Microphone" && !transcribedText) ||
                isLoading
              }
              onClick={handleRunAnalyze}
            >
              {isLoading ? "Processing..." : "Run analyze"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}