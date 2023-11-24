import { createContext, useContext, useState, useEffect } from "react";
import {
    getCasasRequest,
    getCasaRequest,
    createCasaRequest,
    updateCasaRequest,
    deleteCasaRequest,
} from '../api/casa.js'; // Make sure the path to your API file is correct

export const CasaContext = createContext();

export const useCasas = () => {
    const context = useContext(CasaContext);

    if (!context) {
        throw new Error("useCasas must be used within a CasaProvider");
    }

    return context;
};

export function CasaProvider({ children }) {
    const [casas, setCasas] = useState([]);
    const [errors, setErrors] = useState([]);

    const handleErrorResponse = (error) => {
        console.log("Veo el error",error.response);
        const errorMessages = error.response && error.response.data
            ? Array.isArray(error.response.data) ? error.response.data : [error.response.data.message]
            : ['Ha ocurrido un error inesperado'];
        setErrors(errorMessages);
    }

    const getCasas = async () => {
        try {
            const res = await getCasasRequest();
            setCasas(res.data);
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const createCasa = async (casa) => {
        try {
            const res = await createCasaRequest(casa);
            setCasas(prevCasas => [...prevCasas, res.data]);
            return res.data;
        } catch (error) {
            handleErrorResponse(error);
            return Promise.reject(error);
        }
    };

    const getCasa = async (id) => {
        try {
            const res = await getCasaRequest(id);
            return res.data;
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const updateCasa = async (id, casa) => {
        try {
            const res = await updateCasaRequest(id, casa);
            setCasas(prevCasas => prevCasas.map(item => (item._id === id ? res.data : item)));
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    const deleteCasa = async (id) => {
        try {
            await deleteCasaRequest(id);
            setCasas(casas.filter(casa => casa._id !== id));
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
        <CasaContext.Provider
            value={{
                casas,
                createCasa,
                updateCasa,
                getCasa,
                getCasas,
                deleteCasa,
                errors,
            }}
        >
            {children}
        </CasaContext.Provider>
    );
}
