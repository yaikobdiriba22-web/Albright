
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Send, 
  MessageSquare, 
  User as UserIcon, 
  Loader2,
  Clock,
  Megaphone
} from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, serverTimestamp, query, orderBy, limit, where, or } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  const { t } = useTranslation();
  const { user } = useUser();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get('role') || 'student';
  const isAdmin = currentRole === 'admin';
  
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState<string>('all');

  // Fetch all users to populate the recipient list
  const usersRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'users');
  }, [db]);
  const { data: allUsers } = useCollection(usersRef);

  const messagesRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    // Admins see everything. Others see public messages or messages they sent/received.
    if (isAdmin) {
      return query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    }
    return query(
      collection(db, 'messages'), 
      where('recipientId', 'in', ['all', user.uid, '']), 
      orderBy('createdAt', 'desc'), 
      limit(50)
    );
  }, [db, user?.uid, isAdmin]);

  const { data: messages, isLoading } = useCollection(messagesRef);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !message.trim()) return;

    const isPublic = recipientId === 'all';
    
    // Only admins can send public announcements
    if (isPublic && !isAdmin) {
      alert("Only admins can send public announcements.");
      return;
    }

    const messageData = {
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous User',
      senderRole: currentRole,
      recipientId: isPublic ? 'all' : recipientId,
      isPublic: isPublic,
      content: message,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(db, 'messages'), messageData);
    setMessage('');
  };

  return (
    <div className="space-y-6 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">{t('messages')}</h1>
          <p className="text-muted-foreground">Private and community-wide communication.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <UserIcon className="h-4 w-4" /> Message Board
            </CardTitle>
            <CardDescription>Select a recipient to start a conversation.</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            messages?.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[80%] ${msg.senderId === user?.uid ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8 border border-slate-100 shrink-0">
                  <AvatarImage src={`https://picsum.photos/seed/${msg.senderId}/100/100`} />
                  <AvatarFallback className="bg-primary/5 text-[10px] font-bold">{msg.senderName[0]}</AvatarFallback>
                </Avatar>
                <div className={`space-y-1 ${msg.senderId === user?.uid ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-1 ${msg.senderId === user?.uid ? 'justify-end' : ''}`}>
                    <span className="text-xs font-bold text-slate-900">{msg.senderName}</span>
                    <Badge variant="secondary" className="text-[9px] uppercase font-bold py-0 h-4">
                      {msg.senderRole}
                    </Badge>
                    {msg.isPublic && (
                      <Badge variant="outline" className="text-[9px] uppercase font-bold py-0 h-4 border-accent text-accent">
                        <Megaphone className="h-2 w-2 mr-1" /> Public
                      </Badge>
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.senderId === user?.uid 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : msg.isPublic ? 'bg-accent/10 border border-accent/20 text-slate-800 rounded-tl-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground opacity-60">
                    <Clock className="h-2.5 w-2.5" />
                    {msg.createdAt?.toDate ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>

        <CardFooter className="p-4 border-t bg-slate-50 flex flex-col gap-3">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">To:</Label>
              <Select value={recipientId} onValueChange={setRecipientId}>
                <SelectTrigger className="h-9 bg-white">
                  <SelectValue placeholder="Select Recipient" />
                </SelectTrigger>
                <SelectContent>
                  {isAdmin && <SelectItem value="all">Everyone (Public Announcement)</SelectItem>}
                  {allUsers?.filter(u => u.id !== user?.uid).map(u => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-[2] space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Message:</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder={t('writeMessage' as any)} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white border-slate-200 h-9"
                />
                <Button onClick={handleSendMessage} className="shrink-0 font-bold h-9" disabled={!message.trim()}>
                  <Send className="mr-2 h-4 w-4" /> {t('sendMessage' as any)}
                </Button>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
