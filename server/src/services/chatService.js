import { orchestrate } from '../orchestration/orchestrator.js';
import config from '../config/config_index.js';

import { saveConversation } from './historyService.js';

export async function runDiscussion(question, options = {}) {
  let timeoutId;

  const startTime = Date.now();

  try {
    // Timeout guard
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        const err = new Error(
          'Request timed out. Please try again later.'
        );

        err.status = 504;

        reject(err);

      }, config.orchestration.timeoutMs);
    });

    // Main orchestration pipeline
    const orchestrationPromise = orchestrate(question, {
      includeTrace: options.includeTrace ?? false,
    });

    // Race timeout vs orchestration
    const result = await Promise.race([
      orchestrationPromise,
      timeoutPromise,
    ]);

    if (!result?.finalAnswer) {
      throw new Error('Invalid orchestration response.');
    }

    // Save history asynchronously
    if (options.userId) {
      saveConversation(
        options.userId,
        question,
        result.finalAnswer,
        result.totalTokens
      ).catch((err) => {
        console.error(
          '⚠️ History save error:',
          err.message
        );
      });
    }

    const duration = Date.now() - startTime;

    return {
      answer: result.finalAnswer,

      trace: result.steps ?? [],

      metadata: {
        tokensUsed: result.totalTokens ?? 0,
        duration,

        agentsRun:
          result.steps?.map((step) => step.agent) ?? [],
      },
    };

  } catch (error) {
    console.error(
      '❌ Chat service error:',
      error.message
    );

    throw error;

  } finally {
    clearTimeout(timeoutId);
  }
}