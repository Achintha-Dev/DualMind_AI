import { callLLM } from '../providers/gemini.js'
import { analystPrompt } from '../prompts/prompt_index.js'

/*
 * Analyst Agent
 * Creates the initial answer to the user's question.
 *
 * @param {string} question
 * @param {Array}  history  - prior conversation messages [{ role, text }]
 * @param {object} options
 * @returns {Promise<{ text: string, tokens: number }>}
 */

export async function runAnalyst(question, history = [], options = {}) {
  // Build a context-aware prompt that includes recent history
  let contextBlock = '';
  if (history.length > 0) {
    const lines = history.map(msg => {
      const speaker = msg.role === 'model' ? 'Assistant' : 'User';
      return `${speaker}: ${msg.text}`;
    });
    contextBlock = `\nConversation History:\n${lines.join('\n')}\n`;
  }

  const prompt = `${analystPrompt.system}${contextBlock}\n${analystPrompt.createPrompt(question)}`;

  const opts = Object.assign({ maxOutputTokens: 800, temperature: 0.7 }, options);
  return callLLM(prompt, opts);
}