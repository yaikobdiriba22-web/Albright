
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Library, 
  Plus, 
  Download, 
  FileText, 
  FileBox, 
  BookOpen, 
  Search,
  Filter,
  Loader2,
  Share2
} from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSearchParams } from 'next/navigation';

export default function LibraryPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get('role');
  const isStaff = currentRole === 'teacher' || currentRole === 'admin';

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [materialType, setMaterialType] = useState('Worksheet');

  const materialsRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'materials'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: materials, isLoading } = useCollection(materialsRef);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;

    const materialData = {
      title,
      subject,
      type: materialType,
      teacherId: user.uid,
      teacherName: user.displayName || 'Faculty',
      createdAt: serverTimestamp(),
      fileUrl: "https://example.com/document.pdf"
    };

    addDocumentNonBlocking(collection(db, 'materials'), materialData);
    
    toast({
      title: "Document Uploaded",
      description: `"${title}" is now available in the school library.`,
    });

    setTitle('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">{t('library')}</h1>
          <p className="text-muted-foreground">Access school worksheets, question banks, and documents.</p>
        </div>
        {isStaff && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> {t('uploadMaterial')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Study Material</DialogTitle>
                <DialogDescription>Upload a worksheet or document for students to access.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Document Title</Label>
                  <Input placeholder="e.g. Unit 2 Physics Problems" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="e.g. Physics" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Material Category</Label>
                  <Input value={materialType} onChange={(e) => setMaterialType(e.target.value)} placeholder="Worksheet, Question Bank, etc." required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">Upload PDF Document</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1 border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full justify-start font-bold">
              <FileBox className="mr-2 h-4 w-4" /> All Materials
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <FileText className="mr-2 h-4 w-4" /> Worksheets
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <BookOpen className="mr-2 h-4 w-4" /> Textbooks
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search document library..." className="pl-9 h-11 bg-white" />
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {materials?.map((item) => (
                <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <FileText className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                        {item.type}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{item.subject} • Shared by {item.teacherName || 'Faculty'}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 font-bold h-9">
                        <Download className="mr-2 h-3.5 w-3.5" /> Download
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!materials || materials.length === 0) && (
                <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-muted-foreground bg-white/50">
                  <Library className="h-12 w-12 mb-4 opacity-10" />
                  <p>Library is empty. {isStaff ? 'Teachers can add materials above.' : 'Check back later for documents.'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
