import { callLLM } from '../providers/gemini.js'
import { judgePrompt } from '../prompts/prompt_index.js'

/*
 * Judge Agent
 * Writes the final polished answer the user will see.
 *
 * @param {string} question
 * @param {string} criticAnswer
 * @returns {Promise<{ text: string, tokens: number }>}
 */

export async function runJudge(question, criticAnswer, overrides = {}) {
    const prompt = judgePrompt.createPrompt(question, criticAnswer );
    const opts = { maxOutputTokens: 600, temperature: 0.3 };
    return callLLM(prompt, opts);
}