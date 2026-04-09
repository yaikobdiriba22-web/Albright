"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, Sparkles, User, Bot } from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { useUser } from '@/firebase';
import { supportAgent } from '@/ai/flows/support-agent-flow';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function SupportChat({ role }: { role: string }) {
  const { t, lang } = useTranslation();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await supportAgent({
        message: userMessage,
        language: lang as 'en' | 'am' | 'om',
        userRole: role,
        userName: user?.displayName || undefined
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-primary text-white p-4 flex flex-row items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">Albrighty Support</CardTitle>
                <p className="text-[10px] text-white/70">AI Agent • {lang.toUpperCase()}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-4">
                <Bot className="h-12 w-12 text-primary/20 mx-auto" />
                <p className="text-xs text-muted-foreground px-6">
                  {t('welcome')}! I'm the Albrighty AI agent. How can I help you today in {lang === 'en' ? 'English' : lang === 'am' ? 'Amharic' : 'Afan Oromo'}?
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2 max-w-[85%]", m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center shrink-0", m.role === 'user' ? "bg-primary text-white" : "bg-accent text-primary")}>
                  {m.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>
                <div className={cn("p-3 rounded-2xl text-xs shadow-sm", m.role === 'user' ? "bg-primary text-white rounded-tr-none" : "bg-white border border-slate-100 rounded-tl-none")}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 mr-auto">
                <div className="h-6 w-6 rounded-full bg-accent text-primary flex items-center justify-center">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 border-t bg-white rounded-b-lg">
            <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              <Input 
                placeholder="Type your question..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-9 text-xs focus-visible:ring-primary border-slate-200"
              />
              <Button type="submit" size="icon" className="h-9 w-9 shrink-0 bg-primary shadow-md" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white animate-bounce"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
