import { z } from 'zod';
import { runDiscussion } from '../services/chatService.js';

// Input validation
const askSchema = z.object({
  question: z
    .string({ required_error: 'Question is required.' })
    .min(2, { message: 'Question must be at least 2 characters.',})
    .max(2000, { message: 'Question must be under 2000 characters.',})
    .trim(),

  conversationId: z
    .string()
    .optional(),

  includeTrace: z
    .boolean()
    .optional()
    .default(false),
});

/**
 * POST /api/ask
 * Runs the DualMind multi-agent pipeline.
 */
export async function ask(req, res, next) {
  try {
    // Validate request body
    const parsed = askSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error:
          parsed.error.issues[0]?.message ||
          'Invalid request body.',
      });
    }

    const { question, conversationId, includeTrace } = parsed.data;

    console.log(
      `📥 [ask] user=${req.userId} trace=${includeTrace}`
    );

    const result = await runDiscussion(question, {
      includeTrace,
      conversationId,
      userId: req.userId,
    });

    console.log(
      `📤 [ask] done in ${result.metadata.duration}ms — ${result.metadata.tokensUsed} tokens`
    );

    return res.status(200).json({
      answer: result.answer,
      conversationId: result.conversationId,
      trace: result.trace,
      metadata: result.metadata,
    });

  } catch (err) {
    next(err);
  }
}