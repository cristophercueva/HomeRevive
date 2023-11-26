import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPowerOff, faCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import IconoHomeRevive from '../resources/IconoHomeRevive.png';
import { useAuth } from "../context/AuthContext";
import { useClientes } from "../context/ClienteContext";
import { useCasas } from "../context/CasaContext";
import { useTrabajadores } from "../context/TrabajadorContext";
import { Link } from 'react-router-dom';

function HomePage() {
    const { logout, user, loading } = useAuth(); // Asegúrate de desestructurar 'loading' aquí
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [customFieldsToShow, setCustomFieldsToShow] = useState({});
    const [iconState, setIconState] = useState({});
    const { getTrabajadores, trabajadores } = useTrabajadores();
    const { getClientes, clientes } = useClientes();
    const { getCasas, casas } = useCasas();



    useEffect(() => {
        getClientes()
    }, [])

    useEffect(() => {
        getCasas()
    }, [])

    useEffect(() => {
        getTrabajadores()
    }, [])

    const toggleCustomFields = (id) => {
        setCustomFieldsToShow(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        setIconState(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };


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

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredClientes = searchTerm
        ? clientes.filter(cliente =>
            cliente.name.toLowerCase().includes(searchTerm) ||
            cliente.surname.toLowerCase().includes(searchTerm) ||
            cliente.dni.toLowerCase().includes(searchTerm)
        )
        : clientes;


    const fullName =
        user && user.data
            ? `${user.data.name} ${user.data.surname}`
            : "Usuario desconocido";

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options).replace(/\//g, '-');
    }

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

            </div>

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col ">
                <div className="bg-gradient-to-b from-marron to-gray-300 p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Casas</h2>
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
                    <div className="m-10 ">
                        <div className="flex justify-between items-center mb-10">
                            {/* Input de búsqueda */}
                            <input
                                type="text"
                                placeholder="Buscar por Nombre o DNI"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="px-4 py-2 rounded w-full max-w-md"
                            />

                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                {casas.map((casa) => {

                                    
                                    
                                    const clienteId = casa.clienteId;
                                    const clientito = clientes.filter(cliente => cliente._id === clienteId);
                                    const trabajadorId = user.data.id;



                                    if (casa.trabajador2Id === trabajadorId && (casa.estado !== "Inicio" && casa.estado !== "Sin Estado")) {
                                        return (
                                            <div key={casa._id} className="bg-marron_oscuro hover:bg-gray-700 text-white rounded-lg p-4 shadow-lg transition duration-300 ease-in-out relative">
                                                {/* Si la casa tiene trabajador2Id, mostrar el ícono de verificación */}
                                                {casa.trabajador2Id && casa.estado === "Terminado" && (
                                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 absolute top-0 right-0 m-2" />
                                                )}

                                                {clientito.map((cliente) => {
                                                    // Solo renderizar información del trabajador si casa.trabajadorId es igual a user._id
                                                    const uniqueKey = `${casa._id}-${cliente._id}`;

                                                    
                                                    return (
                                                        <div key={uniqueKey} className="flex justify-between items-center mt-2">
                                                            <div>
                                                                <p className='text-blue-400'>DATOS CLIENTE</p>
                                                                <p className="text-gray-400">{cliente.name} {cliente.surname}</p>
                                                                <p className="text-gray-400">{cliente.email}</p>
                                                                <p className='text-gray-400'>{cliente.phone}</p>

                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                    // No renderizar nada si no se cumple la condición
                                                )}
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className='text-blue-400'>DATOS CASA</p>
                                                        <p className="text-gray-400">{casa.estado}</p>
                                                        <p className="text-gray-400">{formatDate(casa.visita)}</p>

                                                    </div>

                                                </div>
                                                <Link to={`/casa-arquitecto/${casa._id}`}>
                                                    <button className="text-red-500 hover:underline sm:text-sm">Edit</button>
                                                </Link>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>


                    </div>
                </div>


            </div>
        </div>
    );
}

export default HomePage;
