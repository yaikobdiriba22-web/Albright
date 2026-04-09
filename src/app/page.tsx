'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, CheckCircle, Sparkles, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="px-6 lg:px-12 h-20 flex items-center border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="bg-primary p-2 rounded-xl">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-headline font-bold text-primary tracking-tight leading-none">{t('schoolName' as any)}</span>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{t('slogan' as any)}</span>
          </div>
        </Link>
        <nav className="ml-auto flex items-center gap-2 md:gap-4">
          <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors hidden md:block px-4" href="#">Features</Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-lg shadow-primary/20">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 px-6 lg:px-12 bg-gradient-to-b from-background to-secondary/20">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-primary px-4 py-2 rounded-full font-bold text-sm border border-accent/20">
                <Star className="h-4 w-4 text-accent fill-accent" />
                {t('slogan' as any)}
              </div>
              <h1 className="text-5xl lg:text-7xl font-headline font-bold leading-[1.1]">
                {t('schoolName' as any)} <span className="text-accent">{t('schoolLevels' as any)}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Nurturing young minds in the heart of Shegar City. Our comprehensive platform ensures parents, teachers, and administrators work together for every child's success.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20">
                    Portal Login <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground ml-2 mb-1 uppercase tracking-widest">{t('location' as any)}</span>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-border">
                    School Info
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-accent" /> KG 1 - Grade 8
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-accent" /> Localized Tools
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-accent" /> Modern Curriculum
                </div>
              </div>
            </div>
            <div className="flex-1 relative w-full max-w-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-3xl opacity-10 -z-10 animate-pulse"></div>
              <div className="relative p-2 bg-card rounded-3xl shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 border">
                <img 
                  src="https://picsum.photos/seed/albrighty/800/600" 
                  alt="Albrighty Academy Campus" 
                  className="rounded-2xl w-full h-auto object-cover"
                  data-ai-hint="elementary school"
                />
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-accent/20">
                   <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-xl hidden md:block border max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quality Education</p>
                    <p className="text-sm font-bold leading-tight">{t('slogan' as any)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 lg:px-12 bg-card border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Link className="flex items-center gap-2" href="/">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-headline font-bold text-primary tracking-tight leading-none">{t('schoolName' as any)}</span>
              <span className="text-[8px] font-bold text-accent uppercase tracking-wider">{t('slogan' as any)}</span>
            </div>
          </Link>
          <div className="text-center md:text-left">
             <p className="text-sm text-muted-foreground font-medium">© 2024 {t('schoolName' as any)}</p>
             <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{t('location' as any)}</p>
          </div>
          <div className="flex gap-6">
            <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Privacy</Link>
            <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Terms</Link>
            <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors" href="#">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}