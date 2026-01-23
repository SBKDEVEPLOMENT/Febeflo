"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2, Headset } from "lucide-react";

type Message = {
  role: "user" | "model";
  text: string;
};

export default function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 h-96 flex flex-col mb-4 border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Headset className="h-5 w-5" />
              <h3 className="font-bold">Asistente Febeflo</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Headset className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>¡Hola! Soy tu asistente virtual.</p>
                <p className="text-sm">¿En qué puedo ayudarte hoy?</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all transform hover:scale-110 flex items-center justify-center group"
        aria-label="Abrir chat de asistencia"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <Headset size={28} className="animate-pulse group-hover:animate-none" />
        )}
      </button>
    </div>
  );
}
