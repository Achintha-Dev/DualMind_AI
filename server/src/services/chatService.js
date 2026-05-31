import { orchestrate } from '../orchestration/orchestrator.js';
import config from '../config/config_index.js';
import { saveConversation, getConversationMessages } from './historyService.js';

export async function runDiscussion(question, options = {}) {
  let timeoutId;
  let history = [];

  const startTime = Date.now();

  try {
    // Fetch prior messages and format for agents
    if (options.conversationId && options.userId) {
      const fullHistory = await getConversationMessages(
        options.conversationId,
        options.userId
      ).catch((err) => {
        console.error('⚠ Fetch history error:', err.message);
        return [];
      });

      // Format: role must be 'user' or 'model' for Gemini compatibility
      history = fullHistory.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        text: msg.content || msg.text || '',
      }));

      console.log(`📚 Loaded ${history.length} history messages for conversation ${options.conversationId}`);
    }

    // Timeout guard
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        const err = new Error('Request timed out. Please try again later.');
        err.status = 504;
        reject(err);
      }, config.orchestration.timeoutMs);
    });

    // Main orchestration pipeline
    const orchestrationPromise = orchestrate(question, {
      includeTrace: options.includeTrace ?? false,
      history,
    });

    // Race timeout vs orchestration
    const result = await Promise.race([orchestrationPromise, timeoutPromise]);

    if (!result?.finalAnswer) {
      throw new Error('Invalid orchestration response.');
    }

    // Save / update conversation history
    // saveConversation handles both new and existing conversations
    const conversationId = await saveConversation(
      options.userId,
      options.conversationId || null,   // pass existing ID so it appends, or null for new
      question,
      result.finalAnswer,
      result.totalTokens,
    ).catch((err) => {
      console.error('⚠ History save error:', err.message);
      return options.conversationId || null;
    });

    const duration = Date.now() - startTime;

    return {
      answer: result.finalAnswer,
      conversationId: conversationId || options.conversationId,
      trace: result.steps ?? [],
      metadata: {
        tokensUsed: result.totalTokens ?? 0,
        duration,
        agentsRun: result.steps?.map((step) => step.agent) ?? [],
      },
    };

  } catch (error) {
    console.error('❌ Chat service error:', error.message);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}