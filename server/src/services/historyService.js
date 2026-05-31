import Conversation from '../models/conversation.js';
import { isDBConnected } from '../config/db.js';

function makeTitle(question) {
    const clean = question.trim().replace(/\n+/g, ' ');

    return clean.length > 60
        ? clean.slice(0, 60).trimEnd() + '…'
        : clean;
}

function requireDB(label) {
    if (!isDBConnected()) {
        console.warn(`⚠️ [${label}] MongoDB not connected.`);
        return false;
    }

    return true;
}

const conversationListFields = {
    title: 1,
    createdAt: 1,
    updatedAt: 1,
    tokensUsed: 1,
};

/** Save conversation */
export async function saveConversation(
    userId,
    conversationId,
    question,
    answer,
    tokensUsed = 0
) {
    if (!requireDB('saveConversation')) return null;

    if (!userId) {
        throw new Error('User ID is required.');
    }

    // Existing conversation
    if (conversationId) {

        const conversation =
            await Conversation.findOne({
                _id: conversationId,
                userId,
            });

        if (conversation) {

            conversation.messages.push(
                {
                    role: 'user',
                    text: question,
                },
                {
                    role: 'assistant',
                    text: answer,
                }
            );

            conversation.tokensUsed += tokensUsed;

            await conversation.save();

            console.log(
                `💾 Conversation updated: ${conversation._id}`
            );

            return conversation._id.toString();
        }
    }

    // New conversation
    const conversation =
        await Conversation.create({
            userId,
            title: makeTitle(question),
            messages: [
                {
                    role: 'user',
                    text: question,
                },
                {
                    role: 'assistant',
                    text: answer,
                },
            ],
            tokensUsed,
        });

    console.log(
        `💾 Conversation created: ${conversation._id}`
    );

    return conversation._id.toString();
}

/** Get conversation list */
export async function getConversations(userId, limit = 50) {
    if (!requireDB('getConversations')) return [];

    return Conversation.find(
        { userId },
        conversationListFields
    )
    .sort({ updatedAt: -1 })
    .limit(Math.min(limit, 100))
    .lean();
}

/** Get single conversation */
export async function getConversationById(id, userId) {
    if (!requireDB('getConversationById')) return null;

    return Conversation.findOne({
        _id: id,
        userId,
    }).lean();
}

/** Delete conversation */
export async function deleteConversation(id, userId) {
    if (!requireDB('deleteConversation')) return false;

    const result = await Conversation.findOneAndDelete({
        _id: id,
        userId,
    });

    return !!result;
}

/** Delete all conversations */
export async function clearAllConversations(userId) {
    if (!requireDB('clearAllConversations')) return 0;

    const result = await Conversation.deleteMany({
        userId,
    });

    return result.deletedCount;
}

/* continue existing conversation with its previous memory*/
export async function updateConversation(
    conversationId,
    userId,
    question,
    answer,
    tokensUsed = 0
) {
    const conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
    });

    if (!conversation) {
        throw new Error('Conversation not found');
    }

    conversation.messages.push(
        {
            role: 'user',
            text: question,
        },
        {
            role: 'assistant',
            text: answer,
        }
    );

    conversation.tokensUsed += tokensUsed;

    await conversation.save();

    return conversation._id.toString();
}

export async function getConversationMessages(
  conversationId,
  userId
) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  }).lean();

  return conversation?.messages || [];
}