
import axios from './axios';

export const loginRequest = (user) => axios.post(`/login`, user);

export const verifyTokenRequest = (token) =>
    axios.get('/verify', { headers: { Authorization: `Bearer ${token}` } });
