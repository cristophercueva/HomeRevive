import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPowerOff, faArrowRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import IconoHomeRevive from '../resources/IconoHomeRevive.png';
import { useAuth } from "../context/AuthContext";
import { useClientes } from "../context/ClienteContext";
import { useCasas } from "../context/CasaContext";
import { Link } from 'react-router-dom';



function ClientesPage() {
    const { logout, user, loading } = useAuth(); // Asegúrate de desestructurar 'loading' aquí
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [customFieldsToShow, setCustomFieldsToShow] = useState({});
    const [iconState, setIconState] = useState({});

    const { getClientes, clientes } = useClientes();
    const { getCasas, casas, getCasa } = useCasas();


    useEffect(() => {
        getClientes()
    }, [])

    useEffect(() => {
        getCasas()
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
                    <h2 className="text-xl font-semibold">Clientes</h2>
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
                            {/* Botón Agregar Cliente */}
                            <Link to={'/new-client'}>
                                <button className="bg-marron text-white px-4 py-1 rounded shadow hover:bg-marron_oscuro text-sm ml-11">Agregar Cliente</button>
                            </Link>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm"></th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Nombre</th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Dni</th>
                                        <th className="text-left py-4 px-6 text-gray-400 sm:px-3 sm:text-sm">Celular</th>
                                        <th className="text-gray-400 sm:px-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClientes.map((cliente, index) => {

                                        const isLast = index === cliente.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                        const clienteId = cliente._id;

                                        const filteredHouses = casas.filter(casa => casa.clienteId === clienteId);
                                        return (
                                            <React.Fragment key={cliente._id}>
                                                <tr key={cliente._id} id={`row-${cliente._id}`} className="border-t border-gray-700 hover:bg-gray-800">
                                                    <td className="py-4 px-6 sm:px-3" onClick={() => toggleCustomFields(cliente._id)}>
                                                        <button className="text-red-500 hover:underline sm:text-sm">
                                                            {iconState[cliente._id] ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowRight} />}
                                                        </button>
                                                    </td>
                                                    <td className="py-4 px-6 sm:px-3">
                                                        <div className="flex flex-col items-start">
                                                            <strong className="text-white mb-1 sm:text-sm">{cliente.name} {cliente.surname}</strong>
                                                            <span className="text-sm text-gray-500">{cliente.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-white sm:px-3 sm:text-sm">
                                                        {cliente.dni}
                                                    </td>
                                                    <td className="py-4 text-white px-6 sm:px-3">
                                                        {cliente.phone}
                                                    </td>
                                                    <td className="py-4 px-6 sm:px-3">
                                                        <Link to={`/client/${cliente._id}`}>
                                                            <button className="text-red-500 hover:underline sm:text-sm">Edit</button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                                {customFieldsToShow[cliente._id] && (
                                                    <>
                                                        {filteredHouses.length > 0 ? (
                                                            <>
                                                                <tr className="border-t border-red-700 hover:bg-gray-800 text-left text-blue-400">
                                                                <th className="py-2 px-6 sm:px-3 sm:text-sm"></th>
                                                                    <th className="py-2 px-6 sm:px-3 sm:text-sm">Direccion</th>
                                                                    <th className="py-2 px-6 sm:px-3 sm:text-sm">Referencia</th>
                                                                    <th className="py-2 px-6 sm:px-3 sm:text-sm">Acciones</th>
                                                                </tr>

                                                                {filteredHouses.map((casa) => (
                                                                    <tr key={casa._id} className="text-white hover:bg-gray-800">
                                                                        <td className="py-2 px-6 sm:px-3 sm:text-sm"></td>
                                                                        <td className="py-2 px-6 sm:px-3 sm:text-sm">{casa.direccion}</td>
                                                                        <td className="py-2 px-6 sm:px-3 sm:text-sm">{casa.referencia}</td>
                                                                        <td className="py-2 px-6 sm:px-3">
                                                                            <Link to={`/new-house/${casa._id}`}>
                                                                                <button className="text-red-500 hover:underline sm:text-sm">Edit</button>
                                                                            </Link> <br/>
                                                                            <Link to={`/new-house`}>
                                                                        <button className="text-red-500 hover:underline sm:text-sm">Crear Casa</button>
                                                                    </Link>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <tr className="border-t border-red-700 hover:bg-gray-800 text-left">
                                                                <td colSpan="3" className="py-2 px-6 sm:px-3 sm:text-sm">
                                                                    <Link to={`/new-house`}>
                                                                        <button className="text-blue-500 hover:underline sm:text-sm">Crear Casa</button>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                )}
                                            </React.Fragment>
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

export default ClientesPage