import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);

  const isRecognitionSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  const isSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (isRecognitionSupported) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setRecognitionError(`Voice recognition: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isRecognitionSupported]);

  const startListening = useCallback((lang: Language = 'en') => {
    if (!recognitionRef.current) {
      setRecognitionError('Speech recognition is not supported in this browser.');
      return;
    }
    try {
      setRecognitionError(null);
      setTranscript('');
      recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.warn('Speech start error:', err);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const speak = useCallback((text: string, lang: Language = 'en') => {
    if (!isSynthesisSupported) return;
    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const cleanText = text.replace(/[*#_`]/g, ''); // strip markdown formatting
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Find suitable voice if available
      const voices = window.speechSynthesis.getVoices();
      const targetLang = lang === 'hi' ? 'hi' : 'en';
      const matchedVoice = voices.find(v => v.lang.startsWith(targetLang));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS error:', err);
      setIsSpeaking(false);
    }
  }, [isSynthesisSupported]);

  const stopSpeaking = useCallback(() => {
    if (isSynthesisSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSynthesisSupported]);

  return {
    isRecognitionSupported,
    isSynthesisSupported,
    isListening,
    transcript,
    setTranscript,
    recognitionError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSpeaking
  };
}

