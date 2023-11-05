import { createContext, useContext, useState, useEffect } from "react";
import {
    getClientesRequest
    , getClienteRequest
    , createClienteRequest
    , updateClienteRequest
}
    from '../api/cliente.js';
const ClienteContext = createContext();

export const useClientes = () => {
    const context = useContext(ClienteContext);

    if (!context) {
        throw new Error("use Trabajadores must be used within a TrabajadorProvider");
    }

    return context;
};
export function ClienteProvider({ children }) {
    const [clientes, setClientes] = useState([]);
    const [errors, setErrors] = useState([]);

    const getClientes = async () => {
        try {
            const res = await getClientesRequest();
            setClientes(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createCliente = async (cliente) => {
        try {
            const res = await createClienteRequest(cliente);
            const newClienteList = [...clientes, res.data];
            setClientes(newClienteList);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const getCliente= async (id) => {
        try {
            const res = await getClienteRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const updateCliente = async (id, cliente) => {
        try {
            const res = await updateClienteRequest(id, cliente);
            const updatedClienteList = [...clientes];
            const index = updatedClienteList.findIndex(worker => worker._id === id);
            if (index !== -1) {
                updatedClienteList[index] = res.data;
                setClientes(updatedClienteList);
            }
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <ClienteContext.Provider
            value={{
                clientes,
                createCliente,
                updateCliente,
                getCliente,
                getClientes,
                errors,
            }}
        >
            {children}
        </ClienteContext.Provider>
    );
}
