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
import { v4 as uuidv4 } from 'uuid';
dayjs.extend(utc)

function CasaArquitectoPage() {
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
                    setValue('trabajador2Id', casa.trabajador2Id)

                    // Aquí asumimos que `camposcasa` es un objeto donde las claves son los nombres de los campos
                    // y los valores son los valores de esos campos.
                    // Convertimos ese objeto en un array de la forma que nuestro estado espera.
                    const camposCasaArray = Object.entries(casa.camposcasa).map(([nombre, valor]) => ({
                        id: uuidv4(), // Aquí deberías tener una mejor forma de generar IDs únicos o usar los que ya existen
                        nombre,
                        valor
                    }));

                    setCampos(camposCasaArray);

                    const camposCasaRemoArray = Object.entries(casa.camposrenovacioncasa).map(([nombre, valor]) => ({
                        id: uuidv4(), // Aquí deberías tener una mejor forma de generar IDs únicos o usar los que ya existen
                        nombre,
                        valor
                    }));

                    setCamposRemodelacion(camposCasaRemoArray);

                } catch (error) {
                    console.error(error);
                }
            }
        }

        loadCasa();
    }, [params.id]); // dependency on params.id means this will re-run when params.id changes

    const onSubmit = async (formData) => {
        const camposObjeto = campos.reduce((obj, campo) => {
            obj[campo.nombre] = campo.valor;
            return obj;
        }, {});

        const camposRemodelacionObjeto = camposRemodelacion.reduce((obj, camporemo) => {
            obj[camporemo.nombre] = camporemo.valor;
            return obj;
        }, {});


        const dataValid = {
            ...formData,
            visita: formData.visita ? dayjs.utc(formData.visita).format() : dayjs.utc().format(),
            clienteId: idCliente,
            camposcasa: camposObjeto,
            camposrenovacioncasa: camposRemodelacionObjeto,
        };

        try {
            if (params.id) {
                await updateCasa(params.id, dataValid);
            } else {
                await createCasa(dataValid);
            }
            navigate('/');
        } catch (error) {
            console.error("Error al procesar el formulario:", error.response?.data?.message);
            setCasaErrors(prevErrors => [...prevErrors, error.response?.data?.message || "Error al procesar la solicitud"]);
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

    const [campos, setCampos] = useState([]);

    const agregarCampo = () => {
        const nuevoCampo = {
            id: uuidv4(),
            nombre: '', // Este será el nombre del campo, como 'tamaño'
            valor: ''   // Este será el valor del campo, como '120m2'
        };

        setCampos([...campos, nuevoCampo]);
    };

    const eliminarCampo = (id) => {
        setCampos(campos.filter(campo => campo.id !== id));
    };



    // Esta función recogerá los campos y los transformará en el objeto necesario para enviar al backend


    // Aquí debes agregar la lógica para enviar los datos al backend
    // Por ejemplo, podrías hacer una solicitud POST con `camposObjeto` como el cuerpo

    const [camposRemodelacion, setCamposRemodelacion] = useState([]);

    const agregarCampoRemodelacion = () => {
        const nuevaRemo = {
            id: uuidv4(),
            nombre: '', // Este será el nombre del campo, como 'tamaño'
            valor: ''   // Este será el valor del campo, como '120m2'

        };

        setCamposRemodelacion([...camposRemodelacion, nuevaRemo]);
    };

    const eliminarCampoRemodelacion = (id) => {
        setCamposRemodelacion(camposRemodelacion.filter(camporemo => camporemo.id !== id));
    };


    return (
        <div className="flex min-h-screen w-full bg-gray-100">

            {/* Botón Hamburguesa */}
            <button className={`md:hidden p-4 ${sidebarOpen ? 'hidden' : 'block'} bg-marron`} onClick={toggleSidebar}>
                ☰
            </button>

            {/* Panel de Navegación */}
            <div ref={sidebarRef} className={`bg-marron w-64 p-6 space-y-4 text-white min-h-screen ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
  
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
                <div className="bg-gray-800 p-4 min-h-screen w-full"> {/* Usa min-h-screen en lugar de h-full */}
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
                        <form className="w-full " onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-wrap -mx-2">
                                <div className="w-full sm:w-1/3 px-2 mb-4">
                                    <label htmlFor="direccion" className="block text-gray-700 text-sm font-bold mb-2">Direccion</label>
                                    <input
                                        {...register("direccion", { required: "La direccion es requerida" })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="direccion"
                                        type="text"
                                        disabled
                                    />
                                    {errors.direccion && <p className="text-red-500">{errors.direccion.message}</p>}
                                </div>

                                <div className="w-full sm:w-1/3 px-2 mb-4">
                                    <label htmlFor="referencia" className="block text-gray-700 text-sm font-bold mb-2">Referencia</label>
                                    <input
                                        {...register("referencia", { required: "La referencia es requerida" })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="referencia"
                                        type="text"
                                        disabled
                                    />
                                    {errors.referencia && <p className="text-red-500">{errors.referencia.message}</p>}
                                </div>
                                <div className="w-full sm:w-1/3 px-2 mb-4">
                                    <label htmlFor="visita" className="block text-gray-700 text-sm font-bold mb-2">Fecha de Visita</label>
                                    <div className="mt-2">
                                        <input
                                            type='date'
                                            {...register("visita", {
                                                required: "El campo Fecha de Visita es requerido",
                                            })}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"

                                            disabled
                                        />
                                        {errors.visita && <p className="text-red-500">{errors.visita.message}</p>}
                                    </div>
                                </div>
                                <div className="w-full sm:w-1/3 px-2 mb-4">
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

                            </div>

                            <div className="mt-4 p-8 bg-white rounded-lg shadow-md w-full"> {/* Contenedor para Campos Casa */}
                                <label htmlFor="camposcasa" className="block text-gray-700 text-sm font-bold mb-2">Campos Casa</label>
                                {campos.map((campo, index) => (
                                    <div key={campo.id} className="mb-4 grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={campo.nombre}
                                            placeholder="Nombre del campo"
                                            disabled
                                            className="p-2 border rounded bg-gray-100" // bg-gray-100 to indicate the field is disabled
                                        />
                                        <textarea
                                            value={campo.valor}
                                            placeholder="Valor del campo"
                                            disabled
                                            rows={3} // Adjust the number of rows based on average content length
                                            className="p-2 border rounded bg-gray-100 resize-none" // resize-none to prevent resizing
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-8 bg-white rounded-lg shadow-md w-full"> {/* Contenedor para Campos Remodelación */}
                                <label htmlFor="camposcasa" className="block text-gray-700 text-sm font-bold mb-2">Campos Remodelacion</label>
                                {camposRemodelacion.map((camporemo, index) => (
                                    <div key={camporemo.id} className="mb-4 grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={camporemo.nombre}
                                            placeholder="Nombre del campo"
                                            onChange={(e) => {
                                                const nuevosCampos = [...camposRemodelacion];
                                                nuevosCampos[index].nombre = e.target.value;
                                                setCamposRemodelacion(nuevosCampos);
                                            }}
                                            className="p-2 border rounded bg-gray-100 w-full"

                                        />
                                        <textarea
                                            type="text"
                                            value={camporemo.valor}
                                            placeholder="Valor del campo"
                                            onChange={(e) => {
                                                const nuevosCampos = [...camposRemodelacion];
                                                nuevosCampos[index].valor = e.target.value;
                                                setCamposRemodelacion(nuevosCampos);
                                            }}
                                            className="p-2 border rounded bg-gray-100 resize-none w-full"
                                        />
                                        <button onClick={() => eliminarCampoRemodelacion(camporemo.id)} className="px-4 py-2 bg-red-500 text-white rounded">
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                                <button onClick={agregarCampoRemodelacion} type="button" className="px-4 py-2 bg-blue-500 text-white rounded">
                                    Agregar
                                </button>
                            </div>


                            <div className="flex items-center justify-between mt-6">
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

export default CasaArquitectoPage