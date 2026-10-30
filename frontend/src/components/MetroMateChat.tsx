import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Wrench, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Navigation
} from 'lucide-react';
import { ChatMessage, Language, RouteResult } from '../types';
import { sendChatMessage } from '../services/api';
import { useSpeech } from '../hooks/useSpeech';

interface MetroMateChatProps {
  language: Language;
  onNavigateToRoute?: (source: string, destination: string) => void;
  isFloating?: boolean;
  onCloseFloating?: () => void;
}

export const MetroMateChat: React.FC<MetroMateChatProps> = ({
  language,
  onNavigateToRoute,
  isFloating = false,
  onCloseFloating
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'hi' 
        ? 'नमस्ते! मैं **मेट्रोमेट AI** हूँ, आपका स्मार्ट दिल्ली मेट्रो यात्रा साथी। आप मुझसे रूट, किराया, स्टेशन सुविधाएं (लिफ्ट, पार्किंग), या पर्यटन स्थलों के बारे में पूछ सकते हैं।'
        : 'Hello! I am **MetroMate AI**, your smart Delhi Metro companion. Ask me about routes, nearest stations for monuments, fares, live line status, or station facilities like lifts and parking.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, speak, stopSpeaking, isSpeaking, isRecognitionSupported } = useSpeech();

  // Scroll to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle voice transcript auto-fill
  useEffect(() => {
    if (transcript && isListening) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await sendChatMessage(userMsg.text, language);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tool_calls: res.tool_calls,
        structured_data: res.structured_data
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Speak if auto-speech is enabled
      if (autoSpeak) {
        speak(res.reply, language);
      }
    } catch (err) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Sorry, I encountered an issue connecting to the transit backend. Please verify your internet connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: language === 'hi' 
          ? 'बातचीत रीसेट कर दी गई है। आप कोई नया सवाल पूछ सकते हैं।'
          : 'Conversation cleared. How can I assist you with your Delhi Metro journey today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSpeechButton = () => {
    if (isListening) {
      stopListening();
      if (input.trim()) {
        handleSend();
      }
    } else {
      startListening(language);
    }
  };

  const quickPrompts = [
    { label: "India Gate from Rajiv Chowk", prompt: "How can I reach India Gate from Rajiv Chowk?" },
    { label: "New Delhi to Chandni Chowk (Hindi)", prompt: "Mujhe New Delhi station se Chandni Chowk jaana hai." },
    { label: "Kashmere Gate Lifts & Facilities", prompt: "Does Kashmere Gate have lifts and accessibility facilities?" },
    { label: "Fare: Rajiv Chowk to Kashmere Gate", prompt: "What is the fare from Rajiv Chowk to Kashmere Gate?" },
    { label: "Yellow Line Live Status", prompt: "What is the operational status of Yellow Line?" }
  ];

  return (
    <div className={`flex flex-col bg-white border border-slate-200 shadow-xl overflow-hidden ${
      isFloating ? 'w-full max-w-lg h-[640px] rounded-3xl' : 'w-full h-[720px] rounded-3xl'
    }`}>
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-dmrc-red to-rose-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base">MetroMate AI</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Tool Calling Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'आधिकारिक दिल्ली मेट्रो वर्चुअल सहायक' : 'Official Virtual Delhi Metro Assistant'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* TTS Audio Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setAutoSpeak(!autoSpeak);
            }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
              autoSpeak ? 'bg-dmrc-red text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={autoSpeak ? "Voice responses active" : "Enable voice responses"}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clear button */}
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {isFloating && onCloseFloating && (
            <button
              onClick={onCloseFloating}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Try:
        </span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp.prompt)}
            className="text-xs font-medium px-3 py-1 bg-white hover:bg-red-50 hover:text-dmrc-red text-slate-700 rounded-full border border-slate-200 shrink-0 transition-all shadow-2xs"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[88%]">
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-red-100 text-dmrc-red flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-r from-dmrc-red to-dmrc-darkred text-white rounded-tr-xs'
                    : 'bg-slate-100/90 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}>
                  {/* Tool Call Badges */}
                  {!isUser && msg.tool_calls && msg.tool_calls.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {msg.tool_calls.map((tc, tcIdx) => (
                        <div
                          key={tcIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-xs font-mono font-medium shadow-2xs mr-1"
                        >
                          <Wrench className="w-3 h-3 text-amber-500" />
                          <span>Tool: <strong>{tc.tool}</strong></span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Markdown-like content */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Inline 1-Click Action if Route is returned */}
                  {msg.structured_data?.route && onNavigateToRoute && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                      <button
                        onClick={() => onNavigateToRoute(
                          msg.structured_data!.route!.source.name,
                          msg.structured_data!.route!.destination.name
                        )}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-dmrc-red hover:underline bg-white px-3 py-1.5 rounded-lg border border-red-200 shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Open in Journey Planner & Metro Map</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp & Speaker option */}
              <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-400">
                <span>{msg.timestamp}</span>
                {!isUser && (
                  <button
                    onClick={() => speak(msg.text, language)}
                    className="hover:text-slate-600 transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-1">
            <Bot className="w-4 h-4 animate-bounce text-dmrc-red" />
            <span>MetroMate AI is querying transit tools...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {isRecognitionSupported && (
            <button
              type="button"
              onClick={handleSpeechButton}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-dmrc-red text-white border-dmrc-red animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-dmrc-red hover:bg-red-50'
              }`}
              title={isListening ? "Listening... click to stop" : "Voice input (English / Hindi)"}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? "Listening... speak now"
                : language === 'hi'
                ? "सवाल पूछें (उदा. कश्मीरी गेट से राजीव चौक कैसे जाएं?)..."
                : "Ask anything about Delhi Metro (routes, gates, fare, lifts)..."
            }
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dmrc-red/20 focus:border-dmrc-red transition-all"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-dmrc-red hover:bg-dmrc-darkred text-white rounded-xl shadow-xs disabled:opacity-40 transition-all"
            title="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

