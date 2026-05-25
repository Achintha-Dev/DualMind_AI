import { Router } from 'express';
import { ask } from '../controllers/chatController.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

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
router.post('/ask', optionalAuth, ask);

export default router;