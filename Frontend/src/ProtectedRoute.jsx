import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ roles }) {
    const { loading, isAuthenticated, user } = useAuth();

    if (loading) return <h1>Loading...</h1>;
    if (!loading && !isAuthenticated) return <Navigate to='/' replace />;

    // Check if roles are provided and user role doesn't match any of the provided roles
    if (roles && user && user.data && !roles.includes(user.data.cargo)) {
        // Redirect to a default page or show an unauthorized message
        switch (user.data.cargo) {
            case "Ingeniero":
                return <Navigate to='/ingenieropage' replace />;
            case "Admin":
                return <Navigate to='/adminpage' replace />;
            default:
                // Si el usuario no tiene un rol definido o reconocido, redirige a la página por defecto
                return <Navigate to='/homepage' replace />;
        }
    }
    
    // If user has the correct role or no roles are provided, render the content
    return <Outlet />;
}
