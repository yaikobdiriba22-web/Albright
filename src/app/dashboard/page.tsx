
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  Calendar as CalendarIcon, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Wallet,
  MapPin,
  ClipboardList,
  MessageSquare,
  Star,
  BellRing,
  Megaphone
} from "lucide-react";
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/use-translation';
import { useSearchParams } from 'next/navigation';
import { Role } from '@/lib/mock-data';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

const performanceData = [
  { name: 'Mon', students: 4000, revenue: 2400 },
  { name: 'Tue', students: 3000, revenue: 1398 },
  { name: 'Wed', students: 2000, revenue: 9800 },
  { name: 'Thu', students: 2780, revenue: 3908 },
  { name: 'Fri', students: 1890, revenue: 4800 },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const db = useFirestore();
  const searchParams = useSearchParams();
  const currentRole = (searchParams.get('role') as Role) || 'student';

  const isAdmin = currentRole === 'admin';
  const isTeacher = currentRole === 'teacher';
  const isAccountant = currentRole === 'accountant';
  const isParent = currentRole === 'parent';
  const isStudent = currentRole === 'student';

  // Fetch only public announcements for the dashboard feed
  const announcementsRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'messages'), 
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'), 
      limit(5)
    );
  }, [db]);

  const { data: announcements, isLoading: loadingAnnouncements } = useCollection(announcementsRef);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
           <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
             <Star className="h-6 w-6" />
           </div>
           <h1 className="text-3xl font-bold">{t('welcome')}</h1>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground ml-1">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{t('location' as any)} | {t('schoolLevels' as any)}</span>
        </div>
      </div>

      {/* Stats Grid - Role Specific */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(isAdmin || isTeacher) && (
          <>
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalStudents')}</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">428</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center font-bold">
                  <TrendingUp className="h-3 w-3 mr-1" /> +2%
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('activeCourses')}</CardTitle>
                <BookOpen className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground mt-1">KG to Grade 8</p>
              </CardContent>
            </Card>
          </>
        )}

        {(isAdmin || isAccountant) && (
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalRevenue')}</CardTitle>
              <Wallet className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,600 {t('currency')}</div>
              <p className="text-xs text-muted-foreground mt-1">Current Term</p>
            </CardContent>
          </Card>
        )}

        {(isStudent || isParent) && (
          <>
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{isStudent ? 'My GPA' : "Student's GPA"}</CardTitle>
                <GraduationCap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.85</div>
                <p className="text-xs text-muted-foreground mt-1">Top 10% of class</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{isStudent ? 'Term Attendance' : "Student's Attendance"}</CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '98.2%' }}></div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {(isAdmin || isTeacher || isAccountant) && (
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('avgAttendance')}</CardTitle>
              <CalendarIcon className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96.8%</div>
              <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '96.8%' }}></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className={`${isParent ? 'md:col-span-7' : 'md:col-span-4'} border-none shadow-sm overflow-hidden`}>
          <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-accent" /> {t('messages')} (Public Announcements)
            </CardTitle>
            {isAdmin && (
              <Button size="sm" variant="ghost" className="h-8 font-bold text-xs" onClick={() => window.location.href=`/dashboard/messages?role=${currentRole}`}>
                Create Announcement
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              {announcements?.map((msg) => (
                <div key={msg.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{msg.senderName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {msg.createdAt?.toDate ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{msg.content}</p>
                </div>
              ))}
              {(!announcements || announcements.length === 0) && !loadingAnnouncements && (
                <div className="py-12 text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto opacity-10 mb-2" />
                  <p>No active school announcements.</p>
                </div>
              )}
              <Button variant="link" className="p-0 h-auto font-bold text-xs" onClick={() => window.location.href=`/dashboard/messages?role=${currentRole}`}>
                View all messages <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {!isParent && (
          <Card className="md:col-span-3 border-none shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Only show relevant quick-access buttons */}
              {(isAccountant || isAdmin) && (
                <Button variant="outline" className="w-full justify-between h-12" onClick={() => window.location.href=`/dashboard/billing?role=${currentRole}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <span>Tuition Invoices</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              {(isTeacher || isAdmin) && (
                <Button variant="outline" className="w-full justify-between h-12" onClick={() => window.location.href=`/dashboard/students?role=${currentRole}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <Users className="h-4 w-4" />
                    </div>
                    <span>Student Directory</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              {(isStudent) && (
                <>
                  <Button variant="outline" className="w-full justify-between h-12" onClick={() => window.location.href=`/dashboard/grades?role=${currentRole}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10 text-primary">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <span>My Results</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between h-12" onClick={() => window.location.href=`/dashboard/assignments?role=${currentRole}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                        <ClipboardList className="h-4 w-4" />
                      </div>
                      <span>Assignments</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
