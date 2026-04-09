
"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, ArrowRight, Loader2, Mail, Lock, MapPin, Star, UserCircle } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { Role } from "@/lib/mock-data";

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    try {
      initiateEmailSignIn(auth, email, password);
      // We pass the role as a query parameter so the dashboard can initialize with it
      setTimeout(() => {
        router.push(`/dashboard?role=${role}`);
      }, 1000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    if (!auth) return;
    setIsLoading(true);
    initiateAnonymousSignIn(auth);
    setTimeout(() => {
      router.push(`/dashboard?role=${role}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex flex-col items-center space-y-4">
            <div className="bg-primary p-4 rounded-full text-white shadow-xl border-4 border-accent/20 relative">
              <GraduationCap className="h-12 w-12" />
              <div className="absolute -top-1 -right-1 bg-accent p-1.5 rounded-full shadow-md">
                 <Star className="h-4 w-4 text-primary fill-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-headline font-bold text-primary tracking-tight block leading-none">{t('schoolName' as any)}</span>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">{t('slogan' as any)}</span>
            </div>
          </Link>
          <div className="flex flex-col items-center gap-2 mt-4">
            <h1 className="text-2xl font-bold tracking-tight">Portal Sign In</h1>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-4 py-1 rounded-full uppercase font-bold tracking-wider">
              <MapPin className="h-3 w-3" />
              {t('location' as any)}
            </div>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your school email and password</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Login As</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                    <SelectTrigger className="pl-9 h-11 bg-white border-slate-200">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@albrighty.edu.et" 
                    className="pl-9 h-11 bg-white border-slate-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs text-primary font-bold">Forgot?</Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-9 h-11 bg-white border-slate-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
              <div className="relative w-full text-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-2 text-[10px] text-muted-foreground uppercase font-bold">Or access for demonstration</span>
              </div>
              <Button type="button" variant="outline" className="w-full h-11 border-primary/20 text-primary font-bold hover:bg-slate-50" onClick={handleGuestLogin} disabled={isLoading}>
                Explore as {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          © 2024 {t('schoolName' as any)} | {t('schoolLevels' as any)}
        </p>
      </div>
    </div>
  );
}
