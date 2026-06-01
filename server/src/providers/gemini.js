import retry from 'async-retry';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config_index.js';

// initialize Gemini client
let genAI = null;

function getClient() {
    if (!config.gemini.apiKey) {
        throw new Error('Gemini API key id not set. Add the api key to relevant file!');
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    }
    return genAI;
}

function withTimeout(promise, ms) {

    return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            reject(new Error(`LLM request timed out after ${ms}ms`));
        }, ms);

        promise.then((result) => {
            clearTimeout(id);
            resolve(result);

        }).catch((error) => {
            clearTimeout(id);
            reject(error);
        });
    });

}

/*
 * Call the Gemini API with a prompt, with retries and optional model fallbacks.
 * Returns { text: string, tokens: number, model: string }
 */

export async function callGemini(prompt, options = {}) {
    const client = getClient();

    const modelsToTry = [
        options.model || config.gemini.model,
        ...(config.gemini.fallbackModels || [])
    ].filter(Boolean);

    const requestTimeoutMs = options.requestTimeoutMs ?? config.gemini.requestTimeoutMs ?? 20000;
    let lastErr = null;

    for (const modelName of modelsToTry) {
        try {
            const model = client.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    maxOutputTokens: options.maxOutputTokens ?? config.gemini.maxOutputTokens,
                    temperature: options.temperature ?? config.gemini.temperature
                }
            });

            const result = await retry(async (bail) => {
                const res = await withTimeout(model.generateContent(prompt), requestTimeoutMs);
                return res;
            }, {
                retries: options.retries ?? 2,
                minTimeout: options.minTimeout ?? 500,
                factor: 2,
            });

            const response = result.response;
            const text = response.text();
            const tokens = response.usageMetadata?.totalTokenCount ?? 0;

            console.log(`ℹ️ [Gemini] ${modelName} responded with ${tokens} tokens`);
            return { text: text.trim(), tokens, model: modelName };

        } catch (err) {
            lastErr = err;
            // Extract just the status code for a clean log
            const status = err.message.match(/\[(\d{3})/)?.[1] || 'ERR';
            console.warn(`⚠️ [${modelName}] failed with ${status}`);

            if (modelName === modelsToTry[modelsToTry.length - 1]) {
                throw lastErr;
            }
            await new Promise((r) => setTimeout(r, 300));
        }
    }
    throw lastErr;
}

export const callLLM = callGemini;
export default callGemini;
