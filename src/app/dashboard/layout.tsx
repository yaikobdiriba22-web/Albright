"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarInset,
} from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard-nav";
import { Role } from "@/lib/mock-data";
import { GraduationCap, LogOut, User as UserIcon, Bell, Search, Settings, Loader2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTranslation } from '@/hooks/use-translation';
import { SupportChat } from '@/components/support-chat';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  
  // Initialize role from query parameter if available, otherwise default to teacher
  const roleParam = searchParams.get('role') as Role;
  const initialRole: Role = (roleParam && ['admin', 'teacher', 'student', 'parent', 'accountant'].includes(roleParam)) 
    ? roleParam 
    : 'teacher';

  const [simulatedRole, setSimulatedRole] = useState<Role>(initialRole);

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userProfile } = useDoc(userDocRef);

  useEffect(() => {
    if (user && !userProfile && !isUserLoading && db) {
      setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email || 'anonymous@albrighty.edu.et',
        role: simulatedRole,
        firstName: user.displayName?.split(' ')[0] || 'Albrighty',
        lastName: user.displayName?.split(' ')[1] || 'User',
      }, { merge: true });

      setDoc(doc(db, `roles_${simulatedRole}`, user.uid), { active: true });
    }
  }, [user, userProfile, isUserLoading, db, simulatedRole]);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };

  if (isUserLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : (user?.displayName || 'Guest User');

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background font-body relative">
        <Sidebar collapsible="icon" className="border-r shadow-xl">
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary shadow-lg border border-primary/20 relative shrink-0">
                <GraduationCap className="h-5 w-5" />
                <Star className="h-2 w-2 absolute top-0.5 right-0.5 fill-primary text-primary" />
              </div>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-sm tracking-tight text-sidebar-foreground leading-none">
                  {t('schoolName' as any)}
                </span>
                <span className="text-[7px] font-bold text-accent uppercase tracking-widest mt-1">
                  {t('slogan' as any)}
                </span>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <DashboardNav role={simulatedRole} />
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-[10px] font-bold opacity-50 uppercase mb-2">Role Simulator</p>
              <div className="flex flex-wrap gap-1">
                {(['admin', 'teacher', 'student', 'parent', 'accountant'] as Role[]).map((r) => (
                  <Button 
                    key={r} 
                    variant={simulatedRole === r ? "accent" : "outline"} 
                    size="sm" 
                    className="h-6 text-[9px] px-1.5 capitalize font-bold"
                    onClick={() => setSimulatedRole(r)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-slate-900 px-6 z-10">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="h-9 w-9" />
              <div className="relative max-w-md w-full hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('search')} 
                  className="pl-9 h-9 w-full bg-slate-50 dark:bg-slate-800 border-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hidden sm:inline-flex">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent border-2 border-white dark:border-slate-900"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-fit flex items-center gap-2 pl-2 pr-1 rounded-full border border-slate-100 hover:bg-slate-50">
                    <div className="flex flex-col items-end text-right hidden sm:flex">
                      <span className="text-xs font-bold leading-none">{displayName}</span>
                      <span className="text-[10px] font-medium opacity-60 capitalize mt-1">{simulatedRole}</span>
                    </div>
                    <Avatar className="h-8 w-8 border border-slate-200">
                      <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/100/100`} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{displayName[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'Guest Session'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center w-full">
                      <UserIcon className="mr-2 h-4 w-4" /> <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" /> <span>{t('settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </SidebarInset>

        <SupportChat role={simulatedRole} />
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
