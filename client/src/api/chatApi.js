import api from './axios.js'

export async function askQuestion(question, conversationId = null, includeTrace=false) {
    
    const respond = await api.post('/chat/ask', {
        question,
        conversationId,
        includeTrace,
    });

    return respond.data;
}