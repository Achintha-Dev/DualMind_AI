import config from '../config/config_index.js'
import { runAnalyst } from '../agents/analyst.js'
import { runCritic } from '../agents/critic.js'
import { runJudge } from '../agents/judge.js'

export async function orchestrate(question, options = {}) {
    try {
        const { includeTrace = false } = options;
        const { tokenBudget } = config.orchestration;

        const steps = [];
        let totalTokens = 0;

        const agentDefaults = {
            Analyst: { maxOutputTokens: 400 },
            Critic: { maxOutputTokens: 350 },
            Judge: { maxOutputTokens: 600 },
        };

        function getAgentCap(agentName, remainingAgents) {
            const remainingBudget = tokenBudget - totalTokens;
            const defaultCap = agentDefaults[agentName]?.maxOutputTokens ?? config.gemini.maxOutputTokens;
            const budgetCap = Math.max(50, Math.floor(remainingBudget / remainingAgents));
            return Math.min(defaultCap, budgetCap);
        }

        async function runAgent(name, fn, args = [], overrides = {}) {
            const start = Date.now();
            const result = await fn(...args, overrides);
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

        // Stage 1: Analyst
        const analystOutput = await runAgent(
            'Analyst',
            runAnalyst,
            [question],
            { maxOutputTokens: getAgentCap('Analyst', 3) }
        );

        // Stage 2: Critic
        const criticOutput = await runAgent(
            'Critic',
            runCritic,
            [question, analystOutput],
            { maxOutputTokens: getAgentCap('Critic', 2) }
        );

        // Stage 3: Judge (final output)
        const finalAnswer = await runAgent(
            'Judge',
            runJudge,
            [question, criticOutput],
            { maxOutputTokens: getAgentCap('Judge', 1) }
        );

        return {
            finalAnswer,
            steps: includeTrace ? steps : [],
            totalTokens,
        };
    } catch (error) {
        console.error('❌ Orchestration failed:', error.message);
        throw error;
    }
}
