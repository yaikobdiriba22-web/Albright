'use server';
/**
 * @fileOverview A GenAI tool for teachers to generate dynamic lesson plan outlines and varied quiz questions.
 *
 * - generateQuizQuestions - A function that handles the quiz question generation process.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate quiz questions.'),
  content: z
    .string()
    .optional()
    .describe(
      'Optional: Specific text content from which to generate questions. If not provided, the AI will use its general knowledge about the topic.'
    ),
  numberOfQuestions:
    z.number().int().min(1).max(10).default(5).describe('The number of quiz questions to generate (between 1 and 10).'),
});
export type GenerateQuizQuestionsInput = z.infer<
  typeof GenerateQuizQuestionsInputSchema
>;

const GenerateQuizQuestionsOutputSchema = z
  .array(
    z.object({
      question: z.string().describe('The multiple-choice question.'),
      options:
        z.array(z.string()).min(2).max(4).describe('An array of possible answer options for the question.'),
      correctAnswer: z.string().describe('The correct answer among the options.'),
    })
  )
  .describe('An array of multiple-choice quiz questions.');
export type GenerateQuizQuestionsOutput = z.infer<
  typeof GenerateQuizQuestionsOutputSchema
>;

export async function generateQuizQuestions(
  input: GenerateQuizQuestionsInput
): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an expert educator and quiz question generator. Your task is to create multiple-choice quiz questions for teachers.\n\nGenerate {{numberOfQuestions}} multiple-choice quiz questions about the topic: "{{topic}}".\n\n{{#if content}}\nUse the following content as the primary source for generating the questions:\nContent: {{{content}}}\n{{else}}\nIf no specific content is provided, use your general knowledge about the topic.\n{{/if}}\n\nEach question must have at least 2 and at most 4 options, and clearly indicate the correct answer.\n\nThe output must be a JSON array of objects, each with 'question', 'options' (an array of strings), and 'correctAnswer' (one of the options).`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
