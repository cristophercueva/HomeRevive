import axios from './axios';

export const getClientesRequest = () => axios.get(`/clientes`);

export const getClienteRequest = (id) => axios.get(`/clientes/${id}`);

export const createClienteRequest = (trabajador) => axios.post("/clientes", trabajador);

export const updateClienteRequest = (id, trabajador) => axios.put(`/clientes/${id}`, trabajador);
