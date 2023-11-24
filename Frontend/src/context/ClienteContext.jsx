import { createContext, useContext, useState, useEffect } from "react";
import {
    getClientesRequest,
    getClienteRequest,
    createClienteRequest,
    updateClienteRequest,
    getLastClientRequest
} from '../api/cliente.js';


export const ClienteContext = createContext();

export const useClientes = () => {
    const context = useContext(ClienteContext);
    if (!context) {
        throw new Error("useClientes must be used within a ClienteProvider");
    }
    return context;
};

export function ClienteProvider({ children }) {
    const [clientes, setClientes] = useState([]);
    const [errors, setErrors] = useState([]);

    const handleErrorResponse = (error) => {
        console.log("Veo el error",error.response);
        const errorMessages = error.response && error.response.data
            ? Array.isArray(error.response.data) ? error.response.data : [error.response.data.message]
            : ['Ha ocurrido un error inesperado'];
        setErrors(errorMessages);
    }

    const getClientes = async () => {
        try {
            const res = await getClientesRequest();
            setClientes(res.data);
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const getLastCliente = async () => {
        try {
            const res = await getLastClientRequest();
            setClientes(prevClientes => [...prevClientes, res.data]);
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const createCliente = async (cliente) => {
        try {
            const res = await createClienteRequest(cliente);
            setClientes(prevClientes => [...prevClientes, res.data]);
            return res.data; // resuelve la promesa con los datos
        } catch (error) {
            handleErrorResponse(error);
            return Promise.reject(error); // rechaza la promesa con el error
        }
    };
    

    const getCliente = async (id) => {
        try {
            const res = await getClienteRequest(id);
            return res.data;
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const updateCliente = async (id, cliente) => {
        try {
            const res = await updateClienteRequest(id, cliente);
            setClientes(prevClientes => prevClientes.map(item => (item._id === id ? res.data : item)));
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 3000);
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
                getLastCliente,
                errors,
                setErrors,
            }}
        >
            {children}
        </ClienteContext.Provider>
    );
}
