import { Router } from 'express';

import {
  listConversations,
  getConversation,
  removeConversation,
  clearHistory,
} from '../controllers/historyController.js';

const router = Router();

// GET all conversations
router.get('/', listConversations);

// GET single conversation
router.get('/:id', getConversation);

// DELETE single conversation
router.delete('/:id', removeConversation);

// DELETE all history
router.delete('/', clearHistory);

export default router;