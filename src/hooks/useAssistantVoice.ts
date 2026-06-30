import { useRef, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useAssistantVoice(onResult: (text: string) => void) {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  // Accumulates transcript fragments across multiple onresult events
  // (which some browsers/devices fire more than once per spoken
  // phrase even with continuous=false), so the FULL sentence is sent
  // exactly once via onend — instead of calling onResult separately
  // for every fragment, which was producing one AI reply per word/
  // partial phrase.
  const transcriptRef = useRef("");

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    transcriptRef.current = "";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event: any) => {
      // Rebuild the full transcript from ALL results each time,
      // rather than appending — onresult's event.results array is
      // cumulative for the current recognition session, so reading
      // index 0 in isolation (as before) only ever captured the first
      // fragment. This keeps transcriptRef as the single source of
      // truth for "everything heard so far," sent exactly once below.
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript;
      }
      transcriptRef.current = combined;
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);

      const finalText = transcriptRef.current.trim();
      if (finalText) {
        onResult(finalText);
      }
      transcriptRef.current = "";
    };

    recognition.onerror = () => {
      recognitionRef.current = null;
      setListening(false);
      transcriptRef.current = "";
    };

    recognition.start();
    recognitionRef.current = recognition;
  }

  return { listening, startListening };
}