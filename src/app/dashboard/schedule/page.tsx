
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useTranslation } from '@/hooks/use-translation';

const scheduleItems = [
  { time: '08:30 AM', subject: 'Advanced Mathematics', room: 'B102', type: 'Lecture' },
  { time: '10:00 AM', subject: 'World History', room: 'A204', type: 'Seminar' },
  { time: '11:30 AM', subject: 'Faculty Meeting', room: 'Conf Room 1', type: 'Meeting' },
  { time: '01:30 PM', subject: 'Introduction to Physics', room: 'Lab 3', type: 'Lab' },
  { time: '03:00 PM', subject: 'Student Counseling', room: 'Office 402', type: 'Office' },
];

export default function SchedulePage() {
  const { t } = useTranslation();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">{t('schedule')}</h1>
          <p className="text-muted-foreground">Daily agenda and class timings.</p>
        </div>
        <Button className="h-10">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4 border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-8 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Schedule for {date?.toLocaleDateString()}</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduleItems.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                <div className="w-20 shrink-0 text-sm font-bold text-primary">
                  {item.time}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm">{item.subject}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.room}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      60 mins
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
