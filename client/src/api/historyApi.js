import api from './axios.js'

export async function getHistory() {
    const respond = await api.get('/history/');

    return respond.data;
}

export async function getConversation(id) {
    const respond = await api.get(`/history/${id}`);

    return respond.data;
}

export async function deleteConversation(id) {
    const respond = await api.delete(`/history/${id}`);

    return respond.data;
}

export async function clearHistory() {
    const respond = await api.delete('/history/');

    return respond.data;
}