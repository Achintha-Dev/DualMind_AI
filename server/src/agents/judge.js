import { callLLM } from '../providers/gemini.js'
import { judgePrompt } from '../prompts/prompt_index.js'

/*
 * Judge Agent
 * Writes the final polished answer the user will see.
 *
 * @param {string} question
 * @param {string} analystAnswer
 * @param {string} criticFeedback
 * @returns {Promise<{ text: string, tokens: number }>}
 */

export async function runJudge(question, analystAnswer, criticFeedback, overrides = {}) {
    const prompt = `${judgePrompt.system}\n${judgePrompt.createPrompt(question, analystAnswer, criticFeedback)}`;
    const opts = Object.assign({ maxOutputTokens: 1200, temperature: 0.3 }, overrides);
    return callLLM(prompt, opts);
}