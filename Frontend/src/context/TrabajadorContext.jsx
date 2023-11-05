import { createContext, useContext, useState, useEffect } from "react";
import {
    getTrabajadoresRequest,
    getTrabajadorRequest,
    createTrabajadorRequest,
    updateTrabajadorRequest
} from '../api/trabajador';

const TrabajadorContext = createContext();

export const useTrabajadores = () => {
    const context = useContext(TrabajadorContext);
    
    if (!context) {
        throw new Error("use Trabajadores must be used within a TrabajadorProvider");
    }

    return context;
};

export function TrabajadorProvider({ children }) {
    const [trabajadores, setTrabajadores] = useState([]);
    const [errors, setErrors] = useState([]);

    const getTrabajadores = async () => {
        try {
            const res = await getTrabajadoresRequest();
            setTrabajadores(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createTrabajador = async (trabajador) => {
        try {
            const res = await createTrabajadorRequest(trabajador);
            const newTrabajadorList = [...trabajadores, res.data];
            setTrabajadores(newTrabajadorList);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const getTrabajador = async (id) => {
        try {
            const res = await getTrabajadorRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const updateTrabajador = async (id, trabajador) => {
        try {
            const res = await updateTrabajadorRequest(id, trabajador);
            const updatedTrabajadorList = [...trabajadores];
            const index = updatedTrabajadorList.findIndex(worker => worker._id === id);
            if (index !== -1) {
                updatedTrabajadorList[index] = res.data;
                setTrabajadores(updatedTrabajadorList);
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
        <TrabajadorContext.Provider
            value={{
                trabajadores,
                createTrabajador,
                updateTrabajador,
                getTrabajador,
                getTrabajadores,
                errors,
            }}
        >
            {children}
        </TrabajadorContext.Provider>
    );
}
