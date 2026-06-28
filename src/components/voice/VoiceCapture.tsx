import { useState } from "react";
import { Mic } from "lucide-react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function VoiceCapture() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.start();
  };

  return (
    <div className="mb-6 rounded-3xl border border-neutral-700 bg-neutral-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">
        🎤 Voice Assistant
      </h2>

      <button
        onClick={startListening}
        className={`flex items-center gap-3 rounded-2xl px-5 py-3 font-semibold text-white transition ${
          listening
            ? "bg-red-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <Mic size={22} />

        {listening ? "Listening..." : "Start Voice Input"}
      </button>

      {transcript && (
        <div className="mt-5 rounded-2xl bg-neutral-900 p-4">
          <p className="text-sm text-neutral-400">
            You said:
          </p>

          <p className="mt-2 text-white">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}