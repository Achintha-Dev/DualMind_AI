import mongoose from 'mongoose';

import {
    getConversations,
    getConversationById,
    deleteConversation,
    clearAllConversations,
} from '../services/historyService.js';

/** GET /api/history */
export async function listConversations(req, res, next) {
    try {
        const limit = Math.min(
            parseInt(req.query.limit, 10) || 50,
            100
        );

        const conversations = await getConversations(
            req.userId,
            limit
        );

        return res.json({ conversations });

    } catch (err) {
        next(err);
    }
}

/** GET /api/history/:id */
export async function getConversation(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'Invalid conversation ID.',
            });
        }

        const conversation = await getConversationById(
            id,
            req.userId
        );

        if (!conversation) {
            return res.status(404).json({
                error: 'Conversation not found.',
            });
        }

        return res.json({ conversation });

    } catch (err) {
        next(err);
    }
}

/** DELETE /api/history/:id */
export async function removeConversation(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'Invalid conversation ID.',
            });
        }

        const deleted = await deleteConversation(
            id,
            req.userId
        );

        if (!deleted) {
            return res.status(404).json({
                error: 'Conversation not found.',
            });
        }

        return res.json({
            success: true,
        });

    } catch (err) {
        next(err);
    }
}

/** DELETE /api/history */
export async function clearHistory(req, res, next) {
    try {
        const count = await clearAllConversations(req.userId);

        return res.json({
            success: true,
            deleted: count,
        });

    } catch (err) {
        next(err);
    }
}