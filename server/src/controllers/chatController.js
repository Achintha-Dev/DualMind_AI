import { z } from 'zod'
import { runDiscussion } from '../services/chatService.js'

// Input validation schema
const askSchema = z.object({
  question: z
    .string({ required_error: 'question is required' })
    .min(2,    { message: 'Question must be at least 2 characters.' })
    .max(2000, { message: 'Question must be under 2000 characters.' })
    .trim(),
  includeTrace: z.boolean().optional().default(false),
});

/*
 * POST /api/ask
 * Main endpoint — runs the 3-agent pipeline and returns the final answer.
 */
export async function ask(req, res, next) {
  try {
    // Validate & sanitize input
    const parsed = askSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.errors[0]?.message || 'Invalid request body.',
      });
    }
 
    const { question, includeTrace } = parsed.data;
 
    console.log(`📥 [ask] question="${question.slice(0, 80)}..." trace=${includeTrace}`);
 
    const result = await runDiscussion(question, { includeTrace });
 
    console.log(`📤 [ask] done in ${result.metadata.duration}ms — ${result.metadata.tokensUsed} tokens`);
 
    return res.status(200).json({
      answer:     result.answer,
      trace:      result.trace,       // [] unless includeTrace=true
      tokensUsed: result.metadata.tokensUsed,
      duration:   result.metadata.duration,
    });
 
  } catch (err) {
    next(err); // pass to global error handler
  }
}