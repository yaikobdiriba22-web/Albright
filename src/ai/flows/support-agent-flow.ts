'use server';
/**
 * @fileOverview A multi-lingual AI support agent for Albrighty Academy.
 *
 * - supportAgent - A function that handles the chat support process.
 * - SupportAgentInput - The input type for the supportAgent function.
 * - SupportAgentOutput - The return type for the supportAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportAgentInputSchema = z.object({
  message: z.string().describe('The user\'s message or question.'),
  language: z.enum(['en', 'am', 'om']).describe('The current user interface language.'),
  userRole: z.string().describe('The role of the user asking the question.'),
  userName: z.string().optional().describe('The name of the user.'),
});
export type SupportAgentInput = z.infer<typeof SupportAgentInputSchema>;

const SupportAgentOutputSchema = z.object({
  response: z.string().describe('The AI generated response in the requested language.'),
});
export type SupportAgentOutput = z.infer<typeof SupportAgentOutputSchema>;

export async function supportAgent(input: SupportAgentInput): Promise<SupportAgentOutput> {
  return supportAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportAgentPrompt',
  input: {schema: SupportAgentInputSchema},
  output: {schema: SupportAgentOutputSchema},
  prompt: `You are the official AI Support Agent for Albrighty Academy, a primary school (KG 1 - Grade 8) located in Shegar City, Guje Gafarsa Kella.
Your slogan is "Center of Excellence and Innovation".

CONTEXT:
- User Name: {{{userName}}}
- User Role: {{{userRole}}}
- Language Requested: {{{language}}} (en: English, am: Amharic, om: Afan Oromo)

GUIDELINES:
1. ALWAYS respond in the requested language ({{{language}}}). 
2. Be professional, encouraging, and helpful.
3. If the user asks about school features (Grades, Assignments, Billing), explain how they work within the portal.
4. For technical issues, advise them to contact the school IT department at info@albrighty.edu.et.
5. Emphasize that the portal ensures strict data privacy: students only see their own grades, and parents only see their children's data.

User Message: {{{message}}}`,
});

const supportAgentFlow = ai.defineFlow(
  {
    name: 'supportAgentFlow',
    inputSchema: SupportAgentInputSchema,
    outputSchema: SupportAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
