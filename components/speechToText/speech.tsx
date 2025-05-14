"use client";

import React, { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

const SpeechToText: React.FC = () => {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [browserSupport, setBrowserSupport] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");
  const isManuallyStoppedRef = useRef<boolean>(false);

  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!SpeechRecognition) {
      setBrowserSupport(false);
      setError("Таны браузер яриа таних үйлдлийг дэмжихгүй байна.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "mn-MN";
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
      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setError(`Алдаа: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (!isManuallyStoppedRef.current) {
        recognition.start(); 
      }
    };

    recognitionRef.current = recognition;
  }, [SpeechRecognition]);

  const startListening = () => {
    setError(null);
    if (recognitionRef.current && !isListening) {
      isManuallyStoppedRef.current = false;
      finalTranscriptRef.current = "";
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      isManuallyStoppedRef.current = true;
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!browserSupport) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        Таны браузер яриа таних үйлдлийг дэмжихгүй байна.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded text-black shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Монгол Хэлээр Яриаг Текст Болгох
      </h1>

      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={startListening}
          disabled={isListening}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Эхлэх
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-gray-400"
        >
          Зогсоох
        </button>
      </div>

      <div className="text-center mb-2">
        Микрофон:{" "}
        <span className={isListening ? "text-green-600" : "text-gray-600"}>
          {isListening ? "Асаалттай" : "Унтарсан"}
        </span>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="mt-4 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
        <strong>Хөрвүүлсэн текст:</strong>
        <p className="mt-2">{transcript || "..."}</p>
      </div>
    </div>
  );
};

export default SpeechToText;
