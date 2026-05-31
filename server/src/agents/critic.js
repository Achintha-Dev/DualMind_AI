import { callLLM } from '../providers/gemini.js'
import { criticPrompt } from '../prompts/prompt_index.js'

/*
 * Critic Agent
 * Reviews the Analyst's answer and produces an improved version.
 *
 * @param {string} question
 * @param {string} analystAnswer
 * @returns {Promise<{ text: string, tokens: number }>}
 */

export async function runCritic(question, analystAnswer, overrides = {}) {
    const prompt = `${criticPrompt.system}\n${criticPrompt.createPrompt(question, analystAnswer)}`;
    const opts = Object.assign({ maxOutputTokens: 700, temperature: 0.3 }, overrides);
    return callLLM(prompt, opts);
}