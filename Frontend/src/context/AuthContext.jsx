import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, verifyTokenRequest } from '../api/auth';
import Cookies from "js-cookie";
export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const TOKEN_EXPIRATION_DAYS = 7;

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);

            if (res.token) {
                Cookies.set("token", res.token, { expires: TOKEN_EXPIRATION_DAYS });

            }
            console.log("Response from login:", res);
            setIsAuthenticated(true);
            setUser(res);

        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message])
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    useEffect(() => {
        const checkLogin = async () => {

            const tokenFromCookie = Cookies.get("token");

            if (!tokenFromCookie) {
                setIsAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }
            try {
                const res = await verifyTokenRequest(tokenFromCookie); // Aquí pasas el token
                
                setIsAuthenticated(true);
                setUser(res);
                setLoading(false);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        };

        checkLogin();
    }, []);


    return (
        <AuthContext.Provider
            value={{
                signin,
                logout,
                loading,
                user,
                isAuthenticated,
                errors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};