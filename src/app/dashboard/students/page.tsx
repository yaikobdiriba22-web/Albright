
"use client"

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  MoreVertical, 
  Plus, 
  Filter, 
  Download, 
  UserCheck, 
  UserPlus, 
  Mail,
  Loader2
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';

export default function StudentsPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get('role');
  const isStaff = currentRole === 'teacher' || currentRole === 'admin';
  const isAccountant = currentRole === 'accountant';
  const canModify = isStaff || isAccountant;

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('10th Grade');

  const studentsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'studentProfiles');
  }, [db]);

  const { data: studentProfiles, isLoading } = useCollection(studentsRef);

  const filteredStudents = (studentProfiles || []).filter(student => 
    (student.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newStudentName || !newStudentEmail) return;

    const studentData = {
      name: newStudentName,
      email: newStudentEmail,
      gradeLevel: newStudentGrade,
      attendance: 100,
      gpa: 4.0,
      status: 'Active',
      createdAt: serverTimestamp(),
      avatar: `https://picsum.photos/seed/${newStudentEmail}/100/100`,
      userId: `stu_${Date.now()}`, 
    };

    addDocumentNonBlocking(collection(db, 'studentProfiles'), studentData);
    
    toast({
      title: "Student Added",
      description: `${newStudentName} has been enrolled successfully.`,
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage student profiles and academic records.</p>
        </div>
        {canModify && (
          <div className="flex gap-2">
            <Button variant="outline" className="h-10">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enroll New Student</DialogTitle>
                  <DialogDescription>
                    Enter the student details to create a new profile.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input id="email" type="email" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="grade" className="text-right">Grade</Label>
                      <Input id="grade" value={newStudentGrade} onChange={(e) => setNewStudentGrade(e.target.value)} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Profile</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary border-none text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-primary-foreground/80 text-sm font-medium">Total Enrollment</p>
              <UserPlus className="h-5 w-5 text-primary-foreground/60" />
            </div>
            <div className="text-3xl font-bold">{studentProfiles?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-accent border-none text-accent-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-accent-foreground/60 text-sm font-medium">Avg. Attendance</p>
              <UserCheck className="h-5 w-5 text-accent-foreground/40" />
            </div>
            <div className="text-3xl font-bold">94.2%</div>
            <div className="mt-4 h-1.5 w-full bg-black/10 rounded-full">
              <div className="h-full bg-white rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-slate-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm font-medium">Flagged Students</p>
              <Filter className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Student Directory</CardTitle>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-9 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p>Loading records...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[300px] font-bold text-xs uppercase tracking-wider text-slate-500 py-4">Student</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 py-4">Grade Level</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 py-4">Attendance</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 py-4">GPA</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 py-4">Status</TableHead>
                  {canModify && <TableHead className="text-right py-4"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                              {student.name?.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground text-sm">{student.name}</span>
                            <span className="text-xs text-muted-foreground">{student.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-medium px-2 py-0.5">
                          {student.gradeLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`text-sm font-bold ${student.attendance < 90 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {student.attendance}%
                        </span>
                      </TableCell>
                      <TableCell className="py-4 font-bold text-sm text-slate-700">{Number(student.gpa).toFixed(2)}</TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[10px] uppercase px-2 py-0.5">
                          {student.status || 'Active'}
                        </Badge>
                      </TableCell>
                      {canModify && (
                        <TableCell className="text-right py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem className="text-sm font-medium">View Profile</DropdownMenuItem>
                              <DropdownMenuItem className="text-sm font-medium">Contact Parent</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No records found.
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
