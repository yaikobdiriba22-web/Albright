import { config } from 'dotenv';
config();

import '@/ai/flows/generate-lesson-plan-outline.ts';
import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/support-agent-flow.ts';
