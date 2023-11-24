import { useAuth } from "../context/AuthContext";
import { useTrabajadores } from "../context/TrabajadorContext";
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import IconoHomeRevive from '../resources/IconoHomeRevive.png';


function UsersPage() {
    const { logout, user, loading } = useAuth(); // Asegúrate de desestructurar 'loading' aquí
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const { getTrabajadores, trabajadores } = useTrabajadores();
    useEffect(() => {
        getTrabajadores()
    }, [])
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
                ☰
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
                    <p className='text-black'>Personal</p>
                    <a href="/new-personal" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Nuevo Personal</a>
                    <a href="/personals" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Personal</a>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col ">
                <div className="bg-gradient-to-b from-marron to-gray-300 p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Personal</h2>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded hover:bg-gray-200">
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                        <button className="flex items-center space-x-2" onClick={logout}>
                            <FontAwesomeIcon icon={faPowerOff} className="text-red-500 hover:text-red-700" />
                        </button>
                    </div>
                </div>

                <div className="p-6 flex-1 bg-gray-700 overflow-y-auto">
                    <div className="m-10">
                        <div className="mt-6 text-right mb-10">
                            <Link to={'/new-personal'}>
                            <button className="bg-marron text-white px-4 py-1 rounded shadow hover:bg-marron_oscuro text-sm">Agregar Usuario</button>
                            </Link>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Nombre</th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Celular</th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Estado</th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Rol</th>
                                        <th className="text-gray-400 sm:px-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trabajadores.map((trabajador, index) => {
                                        const isLast = index === trabajador.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                        return (

                                            <tr key={trabajador._id} className="border-t border-gray-700 hover:bg-gray-800">
                                                <td className="py-4 px-6 sm:px-3">
                                                    <div className="flex flex-col items-start">
                                                        <strong className="text-white mb-1 sm:text-sm">{trabajador.name} {trabajador.surname}</strong>
                                                        <span className="text-sm text-gray-500">{trabajador.email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-white sm:px-3 sm:text-sm">
                                                    {trabajador.phone}
                                                </td>
                                                <td className="py-4 px-6 sm:px-3">
                                                    <span className={trabajador.estado === 'Activo' ? 'text-green-400 sm:text-sm' : 'text-red-400 sm:text-sm'}>
                                                        {trabajador.estado}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-white sm:px-3 sm:text-sm">
                                                    {trabajador.cargo}
                                                </td>
                                                <td className="py-4 px-6 sm:px-3">
                                                    <Link to={`/personals/${trabajador._id}`}>
                                                        <button className="text-blue-500 hover:underline sm:text-sm">Edit</button>
                                                    </Link>
                                                </td>
                                            </tr>

                                        );
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default UsersPage