import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPowerOff, faBars } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from 'react';
import IconoHomeRevive from "../resources/IconoHomeRevive.png";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

function HomePage() {
    const { logout, user, loading } = useAuth(); // Asegúrate de desestructurar 'loading' aquí
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setSidebarOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // Verifica si todavía está cargando
    if (loading) {
        return <div>Cargando...</div>;
    }

    const fullName =
        user && user.data
            ? `${user.data.name} ${user.data.surname}`
            : "Usuario desconocido";

    return (
        <div className="flex h-screen w-full bg-gray-100 ">

            {/* Botón Hamburguesa */}
            <button
                className={`md:hidden p-4 ${sidebarOpen ? 'hidden' : 'block'} bg-marron`}
                onClick={toggleSidebar}
            >
                ☰ {/* Puedes reemplazar esto con tu propio ícono de hamburguesa */}
            </button>

            {/* Panel de Navegación */}
            <div
                ref={sidebarRef}
                className={`bg-marron w-64 p-6 space-y-4 text-white 
                   ${sidebarOpen ? 'block' : 'hidden'} md:block`}
            >
               <Link to={user && user.data.cargo === "Admin" ? "/adminpage" :
                    user && user.data.cargo === "Ingeniero" ? "/ingenieropage" :
                        "/homepage"}>
                    <img src={IconoHomeRevive} alt="Icono Home Revive" className="w-28 h-auto mx-10 my-2" />
                </Link>
                <h2 className="text-center">{fullName}</h2>
                <div className="space-y-2 pt-10">
                    <p className='text-black'>CLIENTE</p>
                    <a href="/new-client" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Nuevo Cliente</a>
                    <a href="/client" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Clientes</a>
                </div>
                <div className="space-y-2 pt-10">
                    <p className='text-black'>USUARIO</p>
                    <a href="/new-personal" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Nuevo Usuario</a>
                    <a href="/personals" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Usuarios</a>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col ">
            <div className="bg-gradient-to-b from-marron to-gray-300 p-4 shadow-md flex justify-between items-center">
                <h2 className="text-xl font-semibold">Home</h2>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded hover:bg-gray-200">
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                        <button className="flex items-center space-x-2" onClick={logout}>
                            <FontAwesomeIcon icon={faPowerOff} className="text-red-500 hover:text-red-700" />
                        </button>
                    </div>
                </div>
                <div className="p-6 flex-1">
                    {/* Aquí puedes agregar el contenido principal */}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
