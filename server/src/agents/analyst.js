import { callLLM } from '../providers/gemini.js'
import { analystPrompt } from '../prompts/prompt_index.js'

/*
 * Analyst Agent
 * Generates an initial structured answer to the user's question.
 *
 * @param {string} question
 * @returns {Promise<{ text: string, tokens: number }>}
 */

export async function runAnalyst(question, overrides = {}) {
    const prompt = analystPrompt.createPrompt(question);
    const opts = Object.assign({ maxOutputTokens: 400, temperature: 0.4 }, overrides);
    return callLLM(prompt, opts);
}