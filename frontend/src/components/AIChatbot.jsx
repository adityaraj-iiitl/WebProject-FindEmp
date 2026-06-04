import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { chatService } from '../services/chatService';
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react"

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m your AI career assistant. I can help you find jobs, prepare for interviews, or optimize your resume. What would you like help with today?',
      suggestions: ['Find remote jobs', 'Improve my resume', 'Interview tips']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const data = await chatService.sendChatMessage(messageText, user?.email || '');
      
      const assistantMessage = { 
        role: 'assistant', 
        content: data.answer,
        jobs: data.recommendedJobs,
        suggestions: data.followUpSuggestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting to my Gemini brain. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-12 px-4 items-center justify-center rounded bg-blue-600 hover:bg-blue-700 text-white shadow-sm border-0 cursor-pointer ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <span className="mr-2">💬</span> Assistant
      </button>

      <div
        className={`fixed bottom-6 right-6 z-50 w-full max-w-sm transition-all duration-300 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <Card className="overflow-hidden border border-gray-300 bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between bg-blue-600 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-700 text-white font-bold">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Career AI</h3>
                <p className="text-[10px] text-blue-200">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white bg-transparent border-0 cursor-pointer text-xl hover:text-gray-200"
            >
              ×
            </button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 bg-white">
              <div className="flex flex-col gap-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {message.role === "user" ? '👤' : '🤖'}
                    </div>
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div
                        className={`rounded px-3 py-2 text-sm ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 border border-gray-300"
                        }`}
                      >
                        {message.content}
                      </div>
                      
                      {message.jobs && message.jobs.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          {message.jobs.map((job, j) => (
                            <div key={j} className="rounded border border-gray-300 bg-white p-3 text-xs">
                              <p className="font-bold">{job.title}</p>
                              <p className="text-gray-500">{job.company} • {job.location}</p>
                              <button className="p-0 h-auto mt-1 text-xs text-blue-600 hover:underline bg-transparent border-0 cursor-pointer text-left" onClick={() => window.location.href = `/job/${job.id}`}>View Details</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-200 text-gray-700">
                      🤖
                    </div>
                    <div className="bg-gray-100 rounded px-3 py-2 text-sm border border-gray-300 animate-pulse">
                      typing...
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-300 px-4 py-3 bg-gray-50">
              <div className="mb-3 flex flex-wrap gap-2">
                {messages[messages.length-1]?.suggestions?.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="rounded border border-gray-300 bg-white px-3 py-1 text-xs text-gray-600 hover:border-blue-600 hover:text-blue-600 cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleSend()} 
                  className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 cursor-pointer border-0 disabled:opacity-50" 
                  disabled={isLoading || !input.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default AIChatbot;
