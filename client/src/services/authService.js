import { loginUser, registerUser } from '../api/authApi';

export async function login(data) {
  const response = await loginUser(data);

  return response;
}

export async function register(data) {
  const response = await registerUser(data);

  return response;
}