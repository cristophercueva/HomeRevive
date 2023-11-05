import axios from './axios';

export const getTrabajadoresRequest = () => axios.get(`/trabajadores`);

export const getTrabajadorRequest = (id) => axios.get(`/trabajadores/${id}`);

export const createTrabajadorRequest = (trabajador) => axios.post("/trabajadores", trabajador);

export const updateTrabajadorRequest = (id, trabajador) => axios.put(`/trabajadores/${id}`, trabajador);
