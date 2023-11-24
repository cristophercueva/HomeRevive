import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form'
import { useTrabajadores } from '../context/TrabajadorContext';
import { useClientes } from '../context/ClienteContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCasas } from '../context/CasaContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { faBell, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import IconoHomeRevive from '../resources/IconoHomeRevive.png';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
dayjs.extend(utc)

function NewCasaPage() {
    const { logout, user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const { getTrabajadores, trabajadores } = useTrabajadores();
    const { getLastCliente, clientes } = useClientes();
    const [idCliente, setIdCliente] = useState(null);


    const [casaErrors, setCasaErrors] = useState([]);
    const { createCasa, updateCasa, getCasa } = useCasas();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        getTrabajadores();
        getLastCliente();
        // Si getLastCliente es sincrónico, puedes agregar el console.log aquí
        // console.log(clientes);
    }, []);
    
    // Si getLastCliente es asíncrono y actualiza el estado 'clientes',
    // puedes usar otro useEffect para detectar cambios en ese estado.
    useEffect(() => {
        if (clientes && clientes.length > 0) {
            setIdCliente(clientes[0]._id);
        }
    }, [clientes]); // Este useEffect se dispara cada vez que 'clientes' cambia
     // Este useEffect se dispara cada vez que 'clientes' cambia
    

    useEffect(() => {

        async function loadCasa() {
            if (params.id) {
                try {
                    const casa = await getCasa(params.id);

                    setValue('direccion', casa.direccion);
                    setValue('referencia', casa.referencia);
                    setValue('visita', dayjs.utc(casa.visita).format("YYYY-MM-DD"));
                    setValue('estado', casa.estado);
                    setValue('trabajadorId', casa.trabajadorId);
                } catch (error) {
                    console.error(error);
                }
            }
        }

        loadCasa();
    }, []); // dependency on params.id means this will re-run when params.id changes

    const onSubmit = async (data) => {
        const dataValid = {
            ...data,
            visita: data.visita ? dayjs.utc(data.visita).format() : dayjs.utc().format,
            clienteId: idCliente,
        };
        try {
            if (params.id) {
                await updateCasa(params.id, dataValid);
            } else {
                await createCasa(dataValid);
            }
            navigate('/');
        } catch (error) {
            console.error("Error al procesar el formulario:", error.response.data.message);
            setCasaErrors(prevErrors => [...prevErrors, error.response.data.message || "Error al procesar la solicitud"]);
        }
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

    const fullName =
        user && user.data
            ? `${user.data.name} ${user.data.surname}`
            : "Usuario desconocido";

    const todayDate = new Date().toISOString().split("T")[0];
    return (
        <div className="flex h-screen w-full bg-gray-100">

            {/* Botón Hamburguesa */}
            <button className={`md:hidden p-4 ${sidebarOpen ? 'hidden' : 'block'} bg-marron`} onClick={toggleSidebar}>
                ☰
            </button>

            {/* Panel de Navegación */}
            <div ref={sidebarRef} className={`bg-marron w-64 p-6 space-y-4 text-white h-screen ${sidebarOpen ? 'block' : 'hidden'} md:block`}>

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
                    <h2 className="text-xl font-semibold">Nuevo Casa</h2>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded hover:bg-gray-200">
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                        <button className="flex items-center space-x-2" onClick={logout}>
                            <FontAwesomeIcon icon={faPowerOff} className="text-red-500 hover:text-red-700" />
                        </button>
                    </div>
                </div>
                {
                    casaErrors.length > 0 && casaErrors.map((error, i) => (
                        <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
                            {error}
                        </div>
                    ))
                }
                <div className="p-6 flex-1 bg-gray-700 overflow-y-auto flex items-center justify-center">
                    <div className="m-10 ">
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                            <div className="mb-4">
                                <label htmlFor="direccion" className="block text-gray-700 text-sm font-bold mb-2">Direccion</label>
                                <input
                                    {...register("direccion", { required: "La direccion es requerida" })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="direccion"
                                    type="text"
                                />
                                {errors.direccion && <p className="text-red-500">{errors.direccion.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="referencia" className="block text-gray-700 text-sm font-bold mb-2">Referencia</label>
                                <input
                                    {...register("referencia", { required: "La referencia es requerida" })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="referencia"
                                    type="text"
                                />
                                {errors.referencia && <p className="text-red-500">{errors.referencia.message}</p>}
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="visita" className="block text-gray-700 text-sm font-bold mb-2">Fecha de Visita</label>
                                <div className="mt-2">
                                    <input
                                        type='date'
                                        {...register("visita", {
                                            required: "El campo Fecha de Visita es requerido",
                                            validate: value => new Date(value) >= new Date(todayDate) || "La fecha no puede ser hoy ni una fecha pasada"
                                        })}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        autoFocus
                                    />
                                    {errors.visita && <p className="text-red-500">{errors.visita.message}</p>}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
                                <select
                                    {...register("estado", {
                                        required: "Estado es requerido",
                                        validate: value => value !== "Escoge un estado" || "Por favor, selecciona un estado válido"
                                    })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="estado"
                                    defaultValue="Escoge un estado"
                                >
                                    <option disabled>Escoge un estado</option>
                                    <option>Sin Estado</option>
                                    <option>Inicio</option>
                                    <option>2da Fase</option>
                                    <option>3ra Fase</option>
                                    <option>Terminado</option>
                                </select>
                                {errors.estado && <p className="text-red-500">{errors.estado.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="trabajadorId" className="block text-gray-700 text-sm font-bold mb-2">Trabajador</label>
                                <select
                                    {...register("trabajadorId", {
                                        required: "Trabajador es requerido",
                                        validate: value => value !== "" || "Por favor, selecciona un Trabajador válido"
                                    })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="trabajadorId"
                                    defaultValue=""
                                >
                                    <option disabled value="">Escoge un Trabajador</option>
                                    {trabajadores
                                        .filter(trabajador => trabajador.cargo === 'Ingeniero')
                                        .map((trabajador, index) => (
                                            <option key={index} value={trabajador._id}>{trabajador.name}</option>
                                        ))
                                    }
                                </select>
                                {errors.trabajadorId && <p className="text-red-500">{errors.trabajadorId.message}</p>}
                            </div>
                            <div className="flex items-center justify-between">
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewCasaPage