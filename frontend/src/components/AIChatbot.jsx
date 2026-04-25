import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
      const response = await fetch('https://webproject-findemp-production.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          userEmail: user?.email || null 
        }),
      });

      const data = await response.json();
      
      const assistantMessage = { 
        role: 'assistant', 
        content: data.answer,
        jobs: data.recommendedJobs,
        suggestions: data.followUpSuggestions
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting to my Gemini brain. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <div
        className={`fixed bottom-6 right-6 z-50 w-full max-w-md transition-all duration-300 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <Card className="overflow-hidden border-primary/20 shadow-2xl shadow-primary/10">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary to-accent p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Career AI</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4">
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
                          ? "bg-primary text-primary-foreground"
                          : "bg-gradient-to-br from-primary/20 to-accent/20 text-primary"
                      }`}
                    >
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                      
                      {message.jobs && message.jobs.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          {message.jobs.map((job, j) => (
                            <div key={j} className="rounded-lg border border-border bg-card p-3 text-xs">
                              <p className="font-bold">{job.title}</p>
                              <p className="text-muted-foreground">{job.company} • {job.location}</p>
                              <Button variant="link" className="p-0 h-auto mt-1 text-xs" onClick={() => window.location.href = `/job/${job.id}`}>View Details</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-2.5 text-sm animate-pulse">
                      ...
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border px-4 py-3 bg-card">
              <div className="mb-3 flex flex-wrap gap-2">
                {messages[messages.length-1]?.suggestions?.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button onClick={() => handleSend()} size="icon" className="shrink-0" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default AIChatbot;
