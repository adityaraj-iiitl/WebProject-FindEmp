import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MessageCircle, X, Send, HelpCircle, User } from "lucide-react"

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi there! I can help you find jobs, prepare for interviews, or improve your resume. What would you like help with today?',
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:scale-105 hover:shadow-lg ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <div
        className={`fixed bottom-5 right-5 z-50 w-full max-w-sm transition-all duration-200 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <Card className="overflow-hidden border border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between bg-primary p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <HelpCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">FindEmp Assistant</h3>
                <p className="text-[11px] text-white/70">Always here to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 text-white hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-72 overflow-y-auto p-3.5">
              <div className="flex flex-col gap-3">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {message.role === "user" ? <User className="h-3.5 w-3.5" /> : <HelpCircle className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div
                        className={`rounded-xl px-3.5 py-2 text-[13px] leading-relaxed ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                      
                      {message.jobs && message.jobs.length > 0 && (
                        <div className="flex flex-col gap-1.5 mt-1">
                          {message.jobs.map((job, j) => (
                            <div key={j} className="rounded-lg border border-border bg-card p-2.5 text-xs">
                              <p className="font-semibold text-foreground">{job.title}</p>
                              <p className="text-muted-foreground">{job.company} -- {job.location}</p>
                              <Button variant="link" className="p-0 h-auto mt-1 text-xs text-primary" onClick={() => window.location.href = `/job/${job.id}`}>View Details</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <HelpCircle className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-secondary rounded-xl px-3.5 py-2 text-sm animate-pulse text-muted-foreground">
                      ...
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border px-3.5 py-2.5 bg-card">
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {messages[messages.length-1]?.suggestions?.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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
                  placeholder="Type your question..."
                  className="flex-1 text-sm h-9"
                  disabled={isLoading}
                />
                <Button onClick={() => handleSend()} size="icon" className="shrink-0 h-9 w-9" disabled={isLoading || !input.trim()}>
                  <Send className="h-3.5 w-3.5" />
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
