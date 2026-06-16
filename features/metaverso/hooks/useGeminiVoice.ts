'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? '';
const geminiClient = new GoogleGenerativeAI(geminiApiKey);

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

export function useGeminiVoice(contextoProyecto: string) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    window.speechSynthesis.speak(utterance);
  }, []);

  const askGemini = useCallback(
    async (question: string) => {
      if (!geminiApiKey) {
        const message =
          'La clave NEXT_PUBLIC_GEMINI_API_KEY no esta configurada. Agregala para activar las respuestas de ARI.';
        setAiResponse(message);
        speak(message);
        return;
      }

      try {
        const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const systemPrompt = `Actuas como ARI, un asistente inteligente de la feria tecnologica virtual.
Estas en el stand del proyecto: "${contextoProyecto}".
Responde de forma muy concisa, amigable, interactiva y al grano en maximo 2 o 3 oraciones, porque tu respuesta sera leida en voz alta.`;

        const result = await model.generateContent([systemPrompt, question]);
        const responseText = result.response.text();

        setAiResponse(responseText);
        speak(responseText);
      } catch (error) {
        const message = 'No pude conectar con Gemini en este momento. Intentalo de nuevo en unos segundos.';
        console.error('Error con Gemini API:', error);
        setAiResponse(message);
        speak(message);
      }
    },
    [contextoProyecto, speak]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const speechWindow = window as SpeechRecognitionWindow;
    const SpeechRecognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('El navegador no soporta Web Speech API.');
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-DO';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const text = event.results[event.resultIndex]?.[0]?.transcript.trim();

      if (!text) return;

      setTranscript(text);
      void askGemini(text);
    };
    recognition.onerror = (error) => {
      console.error('Error en reconocimiento de voz:', error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
      window.speechSynthesis?.cancel();
    };
  }, [askGemini]);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setAiResponse('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    if (isListening) {
      recognition.stop();
      return;
    }

    try {
      recognition.start();
    } catch (error) {
      console.error('Error al iniciar el reconocimiento de voz:', error);
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, aiResponse, toggleListening, speak };
}
