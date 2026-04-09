
"use client"

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Sparkles, 
  Settings,
  ClipboardList,
  Receipt,
  Library,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/mock-data";
import { useTranslation } from "@/hooks/use-translation";

interface NavItem {
  titleKey: string;
  href: string;
  icon: any;
  roles: Role[];
}

const navItems: NavItem[] = [
  { titleKey: "dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ['admin', 'teacher', 'student', 'parent', 'accountant'] },
  { titleKey: "messages", href: "/dashboard/messages", icon: MessageSquare, roles: ['admin', 'teacher', 'student', 'parent', 'accountant'] },
  { titleKey: "students", href: "/dashboard/students", icon: Users, roles: ['admin', 'teacher', 'accountant'] },
  { titleKey: "billing", href: "/dashboard/billing", icon: Receipt, roles: ['admin', 'accountant', 'parent', 'student'] },
  { titleKey: "courses", href: "/dashboard/courses", icon: BookOpen, roles: ['admin', 'teacher', 'student', 'parent'] },
  { titleKey: "schedule", href: "/dashboard/schedule", icon: Calendar, roles: ['admin', 'teacher', 'student', 'parent'] },
  { titleKey: "grades", href: "/dashboard/grades", icon: GraduationCap, roles: ['admin', 'teacher', 'student', 'parent'] },
  { titleKey: "assignments", href: "/dashboard/assignments", icon: ClipboardList, roles: ['admin', 'teacher', 'student', 'parent'] },
  { titleKey: "library", href: "/dashboard/library", icon: Library, roles: ['admin', 'teacher', 'student', 'parent'] },
  { titleKey: "aiTools", href: "/dashboard/ai-tools", icon: Sparkles, roles: ['teacher', 'admin'] },
  { titleKey: "tasks", href: "/dashboard/tasks", icon: ClipboardList, roles: ['admin', 'teacher', 'accountant'] },
  { titleKey: "settings", href: "/dashboard/settings", icon: Settings, roles: ['admin', 'teacher', 'student', 'parent', 'accountant'] },
];

export function DashboardNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.filter(item => item.roles.includes(role)).map((item, index) => {
        // Construct the link with existing search params to maintain role state
        const roleParam = searchParams.get('role');
        const href = roleParam ? `${item.href}?role=${roleParam}` : item.href;
        
        return (
          <Link
            key={index}
            href={href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-primary",
              pathname === item.href ? "bg-slate-100 text-primary font-bold" : "text-muted-foreground"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{t(item.titleKey as any) || item.titleKey}</span>
          </Link>
        );
      })}
    </nav>
  );
}
