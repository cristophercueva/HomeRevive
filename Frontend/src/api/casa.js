import axios from './axios';

export const getCasasRequest = () => axios.get(`/casas`);

export const getCasaRequest = (id) => axios.get(`/casas/${id}`);

export const createCasaRequest = (casa) => axios.post("/casas", casa);

export const updateCasaRequest = (id, casa) => axios.put(`/casas/${id}`, casa);

export const deleteCasaRequest = (id) => axios.delete(`/casas/${id}`);
