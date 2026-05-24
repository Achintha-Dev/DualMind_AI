import { orchestrate } from '../orchestration/orchestrator.js'
import config from '../config/config_index.js';

export async function runDiscussion(question, options = {}) {

    let timeoutId;
    try {
        const startTime = Date.now();

        // wrap in timeout guard in config
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error('Request timed out. Please try again later.'));
            }, config.orchestration.timeoutMs);
        });
    
        const orchestrationPromise = orchestrate(question, {
            includeTrace: options.includeTrace ?? false,
        });
    
        // Race: whichever finishes (or fails) first wins
        const result = await Promise.race([
            orchestrationPromise, 
            timeoutPromise
        ]);
        
        clearTimeout(timeoutId);

        if (!result?.finalAnswer) {
            throw new Error('Invalid orchestration response.');
        }
        return {
            answer: result.finalAnswer,
            trace: result.steps,
            metadata: {
                tokensUsed: result.totalTokens,
                duration: Date.now() - startTime,
                agentsRun: result.steps?.map(step => step.agent) ?? [],
            }
        };
        
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Chat service error:', error.message);
        throw error;
    }

}