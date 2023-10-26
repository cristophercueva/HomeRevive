import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import IconoHomeRevive from '../resources/IconoHomeRevive.png';
import { useAuth } from "../context/AuthContext"

function UsersPage() {
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
                ☰
            </button>

            {/* Panel de Navegación */}
            <div
                ref={sidebarRef}
                className={`bg-marron w-64 p-6 space-y-4 text-white 
               ${sidebarOpen ? 'block' : 'hidden'} md:block`}
            >
                <a href="/homepage"><img src={IconoHomeRevive} alt="Icono Home Revive" className="w-28 h-auto lg:mx-10 my-2 md:mx-1" /></a>
                <h2 className="text-center">{fullName}</h2>
                <div className="space-y-2 pt-10">
                    <p className='text-black'>CLIENTE</p>
                    <a href="/new-client" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Nuevo Cliente</a>
                    <a href="/client" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Clientes</a>
                </div>
                <div className="space-y-2 pt-10">
                    <p className='text-black'>USUARIO</p>
                    <a href="/new-user" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Nuevo Usuario</a>
                    <a href="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700" >Usuarios</a>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col ">
            <div className="bg-gradient-to-b from-marron to-gray-300 p-4 shadow-md flex justify-between items-center">
                <h2 className="text-xl font-semibold">Usuarios</h2>
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
                        <button className="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600 text-sm">Add user</button>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                    <tr>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Name</th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Title</th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Status</th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Role</th>
                                        <th className="text-gray-400 sm:px-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* You can replicate the following block for each user */}
                                    <tr className="border-t border-gray-700 hover:bg-gray-800">
                                        <td className="py-4 px-6 sm:px-3">
                                            <div className="flex flex-col items-start">
                                                <strong className="text-white mb-1 sm:text-sm">Andrew Alfred</strong>
                                                <span className="text-sm text-gray-500">lindsay.walton@example.com</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-white sm:px-3 sm:text-sm">
                                            Front-end Developer<br />
                                            <span className="text-sm text-gray-500">Optimization</span>
                                        </td>
                                        <td className="py-4 px-6 sm:px-3">
                                            <span className="text-green-400 sm:text-sm">Active</span>
                                        </td>
                                        <td className="py-4 px-6 text-white sm:px-3 sm:text-sm">
                                            Member
                                        </td>
                                        <td className="py-4 px-6 sm:px-3">
                                            <button className="text-blue-500 hover:underline sm:text-sm">Edit</button>
                                        </td>
                                    </tr>
                                    {/* End of the user block */}
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