import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPowerOff, faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
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
                const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' };
                const date = new Date(dateString);
                return date.toLocaleDateString('es-ES', options).replace(/\//g, '-');
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
                                {filteredClientes.map((cliente) => {
                                    const clienteId = cliente._id;
                                    const filteredHouses = casas.filter(casa => casa.clienteId === clienteId);

                                    return (
                                        <div key={cliente._id} className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg p-4 shadow-lg transition duration-300 ease-in-out">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className='text-blue-400'>DATOS CLIENTE</p>
                                                    <p className="text-gray-400">{cliente.name} {cliente.surname}</p>
                                                    <p className="text-gray-400">{cliente.email}</p>
                                                    <p className='text-gray-400'>{cliente.phone}</p>
                                                </div>
                                            </div>
                                            {filteredHouses.map((casa) => {
                                                // La declaración se mueve aquí, antes del bloque JSX de retorno.
                                                const casaId = casa.trabajadorId;
                                                const filteredTrabajadores = trabajadores.filter(trabajador => trabajador._id === casaId);
                                                return (
                                                    <div key={casa._id} className="flex justify-between items-center mt-2">
                                                        <div>
                                                            <p className='text-blue-400'>DATOS CASA</p>
                                                            <p className="text-gray-400">{casa.estado}</p>
                                                            <p className="text-gray-400">{formatDate(casa.visita)}</p>
                                                            <p className='text-gray-400'>{cliente.phone}</p>
                                                            {/* Aquí puedes usar filteredTrabajadores como necesites. */}
                                                            {filteredTrabajadores.map((trabajador) => {
                                                            // La declaración se mueve aquí, antes del bloque JSX de r
                                                            return (
                                                                <div key={casa._id} className="flex justify-between items-center mt-2">
                                                                    <div>
                                                                        <p className='text-blue-400'>DATOS TRABAJADOR</p>
                                                                        <p className="text-gray-400">{trabajador.name}</p>
                                                                        <p className="text-gray-400">{trabajador.phone}</p>
                                                                        <p className='text-gray-400'>{trabajador.email}</p>
                                                                        {/* Aquí puedes usar filteredTrabajadores como necesites. */}
                                                                        
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        </div>
                                                        
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
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
