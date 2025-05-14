"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

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

interface SpeechToTextProps {
  onTranscriptChange: (transcript: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptChange }) => {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [browserSupport, setBrowserSupport] = useState<boolean>(true);
  const [volumeLevels, setVolumeLevels] = useState<number[]>([0, 0, 0, 0, 0]);

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");
  const isManuallyStoppedRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const startAudioProcessing = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
      sourceRef.current.connect(analyserRef.current);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(dataArray);

        // Calculate RMS (root mean square) for volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const sample = (dataArray[i] / 128) - 1; // Normalize to -1 to 1
          sum += sample * sample;
        }
        const rms = Math.sqrt(sum / dataArray.length);

        // Map RMS to bar heights (scale to 0-1 range, amplify for visibility)
        const volume = Math.min(rms * 10, 1); // Amplify and clamp
        const newLevels = Array(5).fill(0).map((_, i) => {
          // Create a staggered effect by shifting volume for each bar
          const offset = Math.sin((i / 4) * Math.PI * 2 + Date.now() / 200) * 0.2;
          return Math.max(0, Math.min(1, volume + offset));
        });

        setVolumeLevels(newLevels);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.error("Audio processing error:", err);
      setError("Микрофоны хандалт амжилтгүй боллоо.");
      setIsListening(false);
    }
  };

  const stopAudioProcessing = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setVolumeLevels([0, 0, 0, 0, 0]);
  };

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
      const newTranscript = finalTranscriptRef.current + interimTranscript;
      setTranscript(newTranscript);
      onTranscriptChange(newTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setError(`Алдаа: ${event.error}`);
      setIsListening(false);
      stopAudioProcessing();
    };

    recognition.onend = () => {
      if (!isManuallyStoppedRef.current && isListening) {
        recognition.start();
      } else {
        stopAudioProcessing();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      stopAudioProcessing();
    };
  }, [SpeechRecognition, onTranscriptChange, isListening]);

  const toggleListening = async () => {
    setError(null);
    if (recognitionRef.current) {
      if (!isListening) {
        isManuallyStoppedRef.current = false;
        finalTranscriptRef.current = "";
        setTranscript("");
        onTranscriptChange("");
        await startAudioProcessing();
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        isManuallyStoppedRef.current = true;
        recognitionRef.current.stop();
        setIsListening(false);
        stopAudioProcessing();
      }
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
    <div className="border border-slate-700 rounded-md h-60 md:h-80 flex flex-col">
      <div className="p-4 flex flex-col flex-grow">
        <h1 className="text-lg md:text-xl font-bold mb-2 text-center text-white">
          Монгол Хэлээр Яриаг Текст Болгох
        </h1>
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full ${
              isListening
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          {isListening && (
            <div className="flex items-center gap-1 sound-wave">
              {volumeLevels.map((level, index) => (
                <div
                  key={index}
                  className="w-2 bg-blue-400 sound-wave-bar"
                  style={{
                    height: `${4 + level * 16}px`, // Base height 4px, max 20px
                    transition: "height 0.1s ease",
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
        <div className="text-center mb-2">
          Микрофон:{" "}
          <span className={isListening ? "text-green-600" : "text-gray-600"}>
            {isListening ? "Асаалттай" : "Унтарсан"}
          </span>
        </div>
        {error && <p className="text-red-500

 text-sm text-center">{error}</p>}
        <div className="flex-grow mt-2">
          <div
            className="w-full h-full p-3 md:p-4 bg-slate-800 rounded-md text-sm md:text-base text-white whitespace-pre-wrap overflow-auto font-inter"
            style={{
              minHeight: "100px",
              boxShadow: "0 4px 12px rgba(0, 64, 255, 0.3)",
            }}
          >
            <strong className="font-inter">Хөрвүүлсэн текст:</strong>
            <p className="mt-2">{transcript || "..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;