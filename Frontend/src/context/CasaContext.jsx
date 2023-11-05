import { createContext, useContext, useState, useEffect } from "react";
import {
    getCasasRequest,
    getCasaRequest,
    createCasaRequest,
    updateCasaRequest,
    deleteCasaRequest,
} from '../api/casa.js'; // Make sure the path to your API file is correct

const CasaContext = createContext();

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

    const getCasas = async () => {
        try {
            const res = await getCasasRequest();
            setCasas(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createCasa = async (casa) => {
        try {
            const res = await createCasaRequest(casa);
            setCasas([...casas, res.data]);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const getCasa = async (id) => {
        try {
            const res = await getCasaRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const updateCasa = async (id, casa) => {
        try {
            const res = await updateCasaRequest(id, casa);
            const updatedCasas = casas.map(c => c._id === id ? res.data : c);
            setCasas(updatedCasas);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const deleteCasa = async (id) => {
        try {
            await deleteCasaRequest(id);
            setCasas(casas.filter(casa => casa._id !== id));
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
