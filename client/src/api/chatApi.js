import api from './axios.js'

export async function askQuestion(question, conversationId = null, includeTrace=false) {
    
    const payload = {
        question,
        includeTrace,
    };

    // Only include conversationId when it's a non-null string
    if (conversationId !== null && conversationId !== undefined) {
        payload.conversationId = conversationId;
    }

    try {
        const respond = await api.post('/chat/ask', payload);

        return respond.data;
    } catch (err) {
        console.error('askQuestion error response:', err.response?.status, err.response?.data);
        throw err;
    }
}