
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, Plus, Filter, MoreVertical, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from '@/hooks/use-translation';

const tasks = [
  { id: 1, title: 'Grade Midterm Exams', due: 'Today', priority: 'High', category: 'Grading' },
  { id: 2, title: 'Upload Lesson Plan for Week 5', due: 'Tomorrow', priority: 'Medium', category: 'Planning' },
  { id: 3, title: 'Submit Attendance Report', due: 'Fri, Oct 20', priority: 'High', category: 'Admin' },
  { id: 4, title: 'Prepare Quiz for Class 10B', due: 'Mon, Oct 23', priority: 'Low', category: 'Assessment' },
];

export default function TasksPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">{t('tasks')}</h1>
          <p className="text-muted-foreground">Manage your daily workflow and assignments.</p>
        </div>
        <Button className="h-10">
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {['All Tasks', 'Important', 'Completed', 'Upcoming'].map((f) => (
                <Button key={f} variant="ghost" className="w-full justify-start font-medium text-sm">
                  {f}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-bold">4 Active</Badge>
              <Badge variant="secondary" className="font-bold">2 Completed</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              <Filter className="mr-2 h-3 w-3" /> Filter
            </Button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <CardContent className="p-0 flex">
                  <div className={`w-1.5 shrink-0 ${task.priority === 'High' ? 'bg-destructive' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox id={`task-${task.id}`} className="rounded-full h-5 w-5 border-slate-300 data-[state=checked]:bg-primary" />
                      <div className="space-y-1">
                        <label htmlFor={`task-${task.id}`} className="font-bold text-sm cursor-pointer group-hover:text-primary transition-colors">
                          {task.title}
                        </label>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due {task.due}
                          </div>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border-none">
                            {task.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
