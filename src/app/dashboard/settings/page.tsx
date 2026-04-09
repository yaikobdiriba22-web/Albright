
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Save, 
  Camera,
  Trash2
} from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { useUser } from '@/firebase';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold text-foreground">{t('settings')}</h1>
        <p className="text-muted-foreground">Manage your account preferences and school profile.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="profile" className="font-bold">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-bold">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="font-bold">
            <Shield className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />
            <CardContent className="pt-0 -mt-12">
              <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200/200`} />
                    <AvatarFallback className="text-2xl bg-primary/10">JD</AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-white shadow-lg">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="text-2xl font-bold">{user?.displayName || 'School Administrator'}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-bold">First Name</Label>
                  <Input id="firstName" defaultValue="School" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-bold">Last Name</Label>
                  <Input id="lastName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">Work Email</Label>
                  <Input id="email" defaultValue={user?.email || 'admin@school.edu'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                  <Input id="phone" defaultValue="+251 911 000 000" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t justify-end py-4">
              <Button className="font-bold">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Email Notifications</CardTitle>
              <CardDescription>Configure which automated emails you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'New Student Enrollment', desc: 'Get notified when a new student is added.' },
                { title: 'Payment Alerts', desc: 'Receive updates on successful tuition payments.' },
                { title: 'Attendance Reports', desc: 'Weekly summary of school attendance.' },
                { title: 'System Updates', desc: 'Alerts about maintenance and new features.' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Account Security</CardTitle>
              <CardDescription>Update your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label className="font-bold">Current Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">New Password</Label>
                  <Input type="password" />
                </div>
                <Button className="font-bold">Update Password</Button>
              </div>
              
              <div className="pt-6 border-t">
                <h3 className="text-sm font-bold text-destructive uppercase tracking-wider mb-4">Danger Zone</h3>
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently remove your account and all school data.</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
