'use server';
/**
 * @fileOverview A Genkit flow for teachers to generate a basic lesson plan outline.
 *
 * - generateLessonPlanOutline - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanOutlineInput - The input type for the generateLessonPlanOutline function.
 * - GenerateLessonPlanOutlineOutput - The return type for the generateLessonPlanOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanOutlineInputSchema = z.object({
  topic: z.string().describe('The specific topic for the lesson plan.'),
  subject: z.string().describe('The subject area for the lesson plan, e.g., Mathematics, History.'),
});
export type GenerateLessonPlanOutlineInput = z.infer<typeof GenerateLessonPlanOutlineInputSchema>;

const GenerateLessonPlanOutlineOutputSchema = z.object({
  title: z.string().describe('The title of the lesson plan.'),
  durationEstimates: z.string().describe('An estimate of the lesson duration, e.g., "60 minutes", "2 hours".'),
  learningObjectives: z.array(z.string()).describe('A list of clear and measurable learning objectives for the lesson.'),
  materials: z.array(z.string()).describe('A list of materials and resources needed for the lesson.'),
  activities: z.array(z.string()).describe('A list of key activities or steps for the lesson.'),
  assessment: z.string().describe('Description of how student learning will be assessed.'),
});
export type GenerateLessonPlanOutlineOutput = z.infer<typeof GenerateLessonPlanOutlineOutputSchema>;

export async function generateLessonPlanOutline(input: GenerateLessonPlanOutlineInput): Promise<GenerateLessonPlanOutlineOutput> {
  return generateLessonPlanOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanOutlinePrompt',
  input: {schema: GenerateLessonPlanOutlineInputSchema},
  output: {schema: GenerateLessonPlanOutlineOutputSchema},
  prompt: `You are an AI assistant specialized in creating educational content. Your task is to generate a basic lesson plan outline.

Generate a detailed lesson plan outline for the following:

Subject: {{{subject}}}
Topic: {{{topic}}}

Ensure the output is structured clearly with a title, estimated duration, specific learning objectives, required materials, detailed activities, and a method of assessment. Each section should be concise yet informative.`,
});

const generateLessonPlanOutlineFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanOutlineFlow',
    inputSchema: GenerateLessonPlanOutlineInputSchema,
    outputSchema: GenerateLessonPlanOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
