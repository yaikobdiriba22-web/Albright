
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ClipboardList, 
  Plus, 
  Clock, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Search,
  Filter,
  Loader2,
  Calendar
} from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSearchParams } from 'next/navigation';

export default function AssignmentsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get('role');
  const isStaff = currentRole === 'teacher' || currentRole === 'admin';
  const isStudent = currentRole === 'student';

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Teacher Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const assignmentsRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'assignments'), orderBy('dueDate', 'asc'));
  }, [db]);

  const { data: assignments, isLoading } = useCollection(assignmentsRef);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;

    const assignmentData = {
      title,
      subject,
      description,
      dueDate,
      teacherId: user.uid,
      teacherName: user.displayName || 'Faculty',
      createdAt: serverTimestamp(),
      fileUrl: "https://example.com/template.pdf"
    };

    addDocumentNonBlocking(collection(db, 'assignments'), assignmentData);
    
    toast({
      title: "Assignment Created",
      description: `"${title}" has been published to students.`,
    });

    setTitle('');
    setIsAddDialogOpen(false);
  };

  const handleSubmitWork = (assignmentId: string) => {
    if (!db || !user) return;

    const submissionData = {
      assignmentId,
      studentId: user.uid,
      studentName: user.displayName || 'Student',
      submittedAt: serverTimestamp(),
      fileUrl: "https://example.com/submission.pdf"
    };

    addDocumentNonBlocking(collection(db, 'submissions'), submissionData);

    toast({
      title: "Work Submitted",
      description: "Your PDF has been successfully uploaded for grading.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">{t('assignments')}</h1>
          <p className="text-muted-foreground">
            {isStaff ? 'Create tasks and track student submissions.' : 'Complete your tasks and submit your work.'}
          </p>
        </div>
        {isStaff && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Class Assignment</DialogTitle>
                <DialogDescription>Set a task for your students to complete.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAssignment} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="e.g. History Essay" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input placeholder="Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Textarea placeholder="Explain the assignment..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">Publish to Students</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assignments..." className="pl-9 h-10" />
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments?.map((item) => (
            <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="bg-primary/5 p-4 border-b border-primary/10 flex justify-between items-start">
                <Badge variant="outline" className="text-[10px] font-bold border-primary/20 bg-white">
                  {item.subject}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Due {item.dueDate}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Worksheet attached
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900 pt-4 border-t">
                {isStudent ? (
                  <Button 
                    onClick={() => handleSubmitWork(item.id)} 
                    variant="outline" 
                    className="w-full h-9 font-bold hover:bg-primary hover:text-white"
                  >
                    <Upload className="mr-2 h-4 w-4" /> {t('submitAssignment')} (PDF)
                  </Button>
                ) : (
                  <Button variant="ghost" className="w-full text-xs opacity-50 cursor-not-allowed">
                    {isStaff ? 'Viewing as Faculty' : 'ReadOnly Access'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          {(!assignments || assignments.length === 0) && (
            <div className="col-span-full h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl text-muted-foreground">
              <ClipboardList className="h-12 w-12 mb-4 opacity-20" />
              <p>No active assignments. {isStaff ? 'Create them above.' : 'Check back later.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
