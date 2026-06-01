import config from '../config/config_index.js'
import { runAnalyst } from '../agents/analyst.js'
import { runCritic } from '../agents/critic.js'
import { runJudge } from '../agents/judge.js'

export async function orchestrate(question, options = {}) {
    try {
        const { includeTrace = false, history = [] } = options;
        const { tokenBudget } = config.orchestration;

        const steps = [];
        let totalTokens = 0;

        const agentDefaults = {
            Analyst: { maxOutputTokens: 800 },
            Critic:  { maxOutputTokens: 700 },
            Judge:   { maxOutputTokens: 1200 },
        };

        function getAgentCap(agentName, remainingAgents) {
            const remainingBudget = tokenBudget - totalTokens;
            const defaultCap = agentDefaults[agentName]?.maxOutputTokens ?? config.gemini.maxOutputTokens;
            const budgetCap = Math.max(50, Math.floor(remainingBudget / remainingAgents));
            return Math.min(defaultCap, budgetCap);
        }

        async function runAgent(name, fn, args = []) {
            const start = Date.now();
            const result = await fn(...args);
            const duration = Date.now() - start;
            totalTokens += result.tokens;

            steps.push({
                agent: name,
                output: result.text,
                tokens: result.tokens,
                duration,
            });

            if (totalTokens > tokenBudget) {
                throw new Error(
                    `Token budget of ${tokenBudget} exceeded after ${name} agent. ` +
                    `Try a shorter or more specific question.`
                );
            }

            console.log(`✅ [${name}] completed — ${result.tokens} tokens (total: ${totalTokens})`);
            return result.text;
        }

        // Stage 1: Analyst — receives question + conversation history
        const analystOutput = await runAgent(
            'Analyst',
            runAnalyst,
            [question, history, { maxOutputTokens: getAgentCap('Analyst', 3) }]
        );

        // Stage 2: Critic — reviews analyst draft
        const criticOutput = await runAgent(
            'Critic',
            runCritic,
            [question, analystOutput, { maxOutputTokens: getAgentCap('Critic', 2) }]
        );

        // Stage 3: Judge — merges analyst + critic into final answer
        const finalAnswer = await runAgent(
            'Judge',
            runJudge,
            [question, analystOutput, criticOutput, { maxOutputTokens: getAgentCap('Judge', 1) }]
        );

        return {
            finalAnswer,
            steps: includeTrace ? steps : [],
            totalTokens,
        };
    } catch (error) {
        const short = error.message.substring(0, 80);
        console.error(`❌ Orchestration failed: ${short}`);
        throw error;
    }
}