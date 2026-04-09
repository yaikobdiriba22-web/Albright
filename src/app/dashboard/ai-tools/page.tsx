
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Loader2, 
  Copy, 
  Download, 
  BrainCircuit,
  FileText,
  Clock,
  CheckCircle2,
  Save
} from "lucide-react";
import { generateLessonPlanOutline, type GenerateLessonPlanOutlineOutput } from "@/ai/flows/generate-lesson-plan-outline";
import { generateQuizQuestions, type GenerateQuizQuestionsOutput } from "@/ai/flows/generate-quiz-questions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function AIToolsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<GenerateLessonPlanOutlineOutput | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<GenerateQuizQuestionsOutput | null>(null);

  // Lesson Plan Form State
  const [lessonTopic, setLessonTopic] = useState('');
  const [lessonSubject, setLessonSubject] = useState('');

  // Quiz Form State
  const [quizTopic, setQuizTopic] = useState('');
  const [quizContent, setQuizContent] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTopic || !lessonSubject) return;
    
    setLoading(true);
    try {
      const result = await generateLessonPlanOutline({
        topic: lessonTopic,
        subject: lessonSubject
      });
      setLessonPlan(result);
      toast({
        title: "Lesson Plan Generated",
        description: "Your AI-powered lesson outline is ready.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLessonPlan = () => {
    if (!db || !user || !lessonPlan) return;
    
    const docData = {
      teacherId: user.uid,
      courseId: lessonSubject, // Using subject as a proxy for courseId in this demo
      title: lessonPlan.title,
      outlineContent: JSON.stringify(lessonPlan),
      generatedDate: serverTimestamp(),
      sourceTopic: lessonTopic
    };

    addDocumentNonBlocking(collection(db, 'users', user.uid, 'lessonPlans'), docData);
    
    toast({
      title: "Saved to Library",
      description: "Lesson plan has been saved to your workspace.",
    });
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic) return;
    
    setLoading(true);
    try {
      const result = await generateQuizQuestions({
        topic: quizTopic,
        content: quizContent,
        numberOfQuestions: numQuestions
      });
      setQuizQuestions(result);
      toast({
        title: "Quiz Generated",
        description: `Successfully created ${result.length} questions.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate quiz questions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = () => {
    if (!db || !user || !quizQuestions) return;

    const docData = {
      creatorTeacherId: user.uid,
      title: `${quizTopic} Quiz`,
      questions: quizQuestions,
      generatedDate: serverTimestamp(),
    };

    addDocumentNonBlocking(collection(db, 'quizzes'), docData);

    toast({
      title: "Quiz Saved",
      description: "Questions have been added to your question bank.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <BrainCircuit className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-foreground">AI Educator Toolkit</h1>
        </div>
        <p className="text-muted-foreground">Leverage generative AI to create high-quality educational materials in seconds.</p>
      </div>

      <Tabs defaultValue="lesson-plan" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 w-full max-w-md h-12">
          <TabsTrigger value="lesson-plan" className="flex-1 h-10 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <BookOpen className="mr-2 h-4 w-4" />
            Lesson Plan
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex-1 h-10 font-bold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Quiz Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lesson-plan" className="grid gap-6 md:grid-cols-5 animate-in slide-in-from-left-4 duration-500">
          <Card className="md:col-span-2 border-none shadow-sm h-fit sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Lesson Plan Configuration</CardTitle>
              <CardDescription>Define the subject and specific topic for your lesson outline.</CardDescription>
            </CardHeader>
            <form onSubmit={handleGenerateLessonPlan}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-bold">Subject Area</Label>
                  <Input 
                    id="subject" 
                    placeholder="e.g. Mathematics, History, Art" 
                    value={lessonSubject}
                    onChange={(e) => setLessonSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-bold">Specific Topic</Label>
                  <Input 
                    id="topic" 
                    placeholder="e.g. Quadratic Equations, The Roman Empire" 
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Outline
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="md:col-span-3 space-y-4">
            {lessonPlan ? (
              <Card className="border-none shadow-sm overflow-hidden animate-in fade-in duration-500">
                <div className="bg-primary p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-[10px] text-white/80 border-white/20 uppercase font-bold px-2 py-0.5">
                      AI Generated
                    </Badge>
                    <div className="flex gap-2">
                      <Button onClick={() => copyToClipboard(JSON.stringify(lessonPlan, null, 2))} variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleSaveLessonPlan} variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{lessonPlan.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {lessonPlan.durationEstimates}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {lessonPlan.activities.length} Key Activities
                    </div>
                  </div>
                </div>
                <CardContent className="p-8 space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {lessonPlan.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Materials Needed</h3>
                    <div className="flex flex-wrap gap-2">
                      {lessonPlan.materials.map((item, i) => (
                        <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 font-medium px-3 py-1 border-none">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Activities & Procedure</h3>
                    <div className="space-y-4">
                      {lessonPlan.activities.map((act, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-all">
                          <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-xs font-bold text-primary shadow-sm border border-slate-200 shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{act}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Assessment Strategy</h3>
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                      <p className="text-sm text-slate-700 italic">{lessonPlan.assessment}</p>
                    </div>
                  </section>
                </CardContent>
              </Card>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-white">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No lesson plan generated yet</h3>
                <p className="text-sm text-slate-500 max-w-sm">Fill in the details on the left and click "Generate Outline" to see the magic happen.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="grid gap-6 md:grid-cols-5 animate-in slide-in-from-right-4 duration-500">
          <Card className="md:col-span-2 border-none shadow-sm h-fit sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Quiz Setup</CardTitle>
              <CardDescription>Generate multiple choice questions from a topic or specific text.</CardDescription>
            </CardHeader>
            <form onSubmit={handleGenerateQuiz}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-topic" className="text-sm font-bold">Quiz Topic</Label>
                  <Input 
                    id="quiz-topic" 
                    placeholder="e.g. Photosynthesis, Ancient Egypt" 
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num-questions" className="text-sm font-bold">Number of Questions (1-10)</Label>
                  <Input 
                    id="num-questions" 
                    type="number"
                    min="1"
                    max="10"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-bold">Content Source (Optional)</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Paste specific text you want the AI to base questions on..." 
                    className="min-h-[150px] resize-none"
                    value={quizContent}
                    onChange={(e) => setQuizContent(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="md:col-span-3 space-y-4">
            {quizQuestions ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div>
                    <h2 className="text-xl font-bold">{quizTopic} Quiz</h2>
                    <p className="text-xs text-muted-foreground">{quizQuestions.length} AI-Generated Questions</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveQuiz} variant="outline" size="sm" className="h-9 px-4 font-bold border-slate-200">
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button onClick={() => copyToClipboard(JSON.stringify(quizQuestions, null, 2))} variant="outline" size="sm" className="h-9 px-4 font-bold border-slate-200">
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {quizQuestions.map((q, i) => (
                    <Card key={i} className="border-none shadow-sm overflow-hidden group">
                      <CardHeader className="bg-slate-50/50 pb-4">
                        <div className="flex gap-3">
                          <span className="h-6 w-6 rounded-md bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center shrink-0">
                            Q{i + 1}
                          </span>
                          <CardTitle className="text-sm font-bold leading-relaxed">{q.question}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 grid gap-2">
                        {q.options.map((opt, optIndex) => (
                          <div 
                            key={optIndex} 
                            className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
                              opt === q.correctAnswer 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-white border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              opt === q.correctAnswer ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </div>
                            <span className="flex-1 font-medium">{opt}</span>
                            {opt === q.correctAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center bg-white">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  <HelpCircle className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No questions generated yet</h3>
                <p className="text-sm text-slate-500 max-w-sm">Select a topic and text source to generate multiple choice quiz questions instantly.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
