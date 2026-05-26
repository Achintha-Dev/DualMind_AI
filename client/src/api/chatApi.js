import api from './axios.js'

export async function askQuestion(question, includeTrace=false) {
    
    const respond = await api.post('/chat/ask', {
        question,
        includeTrace,
    });

    return respond.data;
}