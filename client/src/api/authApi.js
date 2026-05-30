import api from './axios.js'

export async function registerUser(data) {
    const respond = await api.post('/auth/register', data);

    return respond.data;
}

export async function loginUser(data) {
    const respond = await api.post('/auth/login', data);

    return respond.data;
}

export async function getCurrentUser(data) {
    const respond = await api.get('/auth/me', data);

    return respond.data;
}

export async function logoutUser(data){
    const respond = await api.get('/auth/logout', data);

    return respond.data;
}