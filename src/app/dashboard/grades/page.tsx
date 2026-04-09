
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap, TrendingUp, Search, Plus, Filter, CheckCircle2, Loader2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTranslation } from '@/hooks/use-translation';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';

export default function GradesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get('role');
  const isStaff = currentRole === 'teacher' || currentRole === 'admin';

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeType, setGradeType] = useState('Test');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('100');

  const gradesRef = useMemoFirebase(() => {
    if (!db) return null;
    let baseQuery = query(collection(db, 'grades'), orderBy('date', 'desc'));
    
    // Students can only see their own grades
    if (currentRole === 'student' && user) {
      baseQuery = query(collection(db, 'grades'), where('studentId', '==', user.uid), orderBy('date', 'desc'));
    }
    
    return baseQuery;
  }, [db, user?.uid, currentRole]);

  const { data: grades, isLoading } = useCollection(gradesRef);

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;

    const gradeData = {
      studentName,
      studentId: `STU_${Date.now()}`, // Simulated ID for demo
      subject,
      type: gradeType,
      score: Number(score),
      maxScore: Number(maxScore),
      teacherId: user.uid,
      date: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(db, 'grades'), gradeData);
    
    toast({
      title: "Grade Recorded",
      description: `Successfully added ${gradeType} result for ${studentName}.`,
    });

    setStudentName('');
    setScore('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">{t('grades')}</h1>
          <p className="text-muted-foreground">Manage and track student academic performance.</p>
        </div>
        {isStaff && (
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" /> {t('addGrade')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post Student Grade</DialogTitle>
                  <DialogDescription>Record a new assessment result in the gradebook.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddGrade} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input placeholder="Search or type name" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input placeholder="e.g. Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Assessment Type</Label>
                      <Select value={gradeType} onValueChange={setGradeType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Test">Test</SelectItem>
                          <SelectItem value="Assignment">Assignment</SelectItem>
                          <SelectItem value="Mid Exam">Mid Exam</SelectItem>
                          <SelectItem value="Final Exam">Final Exam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Score</Label>
                      <Input type="number" value={score} onChange={(e) => setScore(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Score</Label>
                      <Input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Submit Result</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm opacity-80">Class Average</p>
              <TrendingUp className="h-5 w-5 opacity-60" />
            </div>
            <div className="text-3xl font-bold">84% Average</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-accent text-accent-foreground">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm opacity-80">Top Performers</p>
              <GraduationCap className="h-5 w-5 opacity-40" />
            </div>
            <div className="text-3xl font-bold">12 Students</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-slate-100 dark:bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">Recent Submissions</p>
              <CheckCircle2 className="h-5 w-5 text-emerald-500 opacity-60" />
            </div>
            <div className="text-3xl font-bold">{grades?.length || 0} Records</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white dark:bg-slate-900 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Live Gradebook</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search records..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="font-bold">Student</TableHead>
                  <TableHead className="font-bold">Subject</TableHead>
                  <TableHead className="font-bold">Assessment</TableHead>
                  <TableHead className="font-bold">Score</TableHead>
                  <TableHead className="font-bold text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades?.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {grade.studentName}
                      </div>
                    </TableCell>
                    <TableCell>{grade.subject}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                        {grade.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{grade.score}/{grade.maxScore}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${grade.score/grade.maxScore >= 0.8 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {Math.round((grade.score / grade.maxScore) * 100)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {(!grades || grades.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No grades recorded yet. {isStaff ? 'Add grades using the button above.' : 'Check back later for updates.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
