import { Router } from 'express';
import { ask } from '../controllers/chatController.js';

const router = Router();

/**
 POST /api/ask

 Body:
 {
   question: string,
   includeTrace?: boolean
 }
 
  Returns:
  {
    answer: string,
    trace: AgentStep[],
    metadata: {
    tokensUsed: number,
    duration: number,
    agentsRun: string[]
   }
 }
 */
router.post('/ask', ask);

export default router;