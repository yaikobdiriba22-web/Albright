
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Search, Filter, Plus, Users, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/use-translation';
import { MOCK_COURSES } from '@/lib/mock-data';

export default function CoursesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">{t('courses')}</h1>
          <p className="text-muted-foreground">Browse and manage school curriculum.</p>
        </div>
        <Button className="h-10 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9 h-10" />
        </div>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_COURSES.map((course) => (
          <Card key={course.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Room {course.room}
                </div>
              </div>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{course.title}</CardTitle>
              <CardDescription className="text-xs">Instructor: Prof. James Wilson</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolled}/{course.capacity} Students</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden mr-4">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                  ></div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
