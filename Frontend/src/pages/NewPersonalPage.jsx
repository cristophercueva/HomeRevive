import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form'
import { useTrabajadores } from '../context/TrabajadorContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { faBell, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import IconoHomeRevive from '../resources/IconoHomeRevive.png';

function NewPersonalPage() {

    const { logout, user, loading } = useAuth(); // Asegúrate de desestructurar 'loading' aquí
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [trabajadorErrors, setTrabajadorErrors] = useState([]);
    const { createTrabajador, updateTrabajador, getTrabajador } = useTrabajadores();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function loadTrabajador() {
            if (params.id) {
                try {
                    const personal = await getTrabajador(params.id);

                    setValue('name', personal.name);
                    setValue('surname', personal.surname);
                    setValue('dni', personal.dni)
                    setValue('email', personal.email);
                    setValue('phone', personal.phone);
                    setValue('cargo', personal.cargo);
                    setValue('estado', personal.estado);
                } catch (error) {
                    setTrabajadorErrors(prevErrors => [...prevErrors, error.response.data.message || "Error al procesar la solicitud"]);
                }
            }
        }
        loadTrabajador();
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        const dataValid = {
            ...data,
        };

        try {
            if (params.id) {
                await updateTrabajador(params.id, dataValid);
            } else {
                await createTrabajador(dataValid);
            }
            navigate('/personals');
        } catch (error) {
            // Captura y muestra el error
            console.error("Error al procesar el formulario:", error.response.data.message);
            setTrabajadorErrors(prevErrors => [...prevErrors, error.response.data.message || "Error al procesar la solicitud"]);
        }

    });


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
                    <h2 className="text-xl font-semibold">Nuevo Personal</h2>
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
                    trabajadorErrors.length > 0&& trabajadorErrors.map((error, i) => (
                        <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
                            {error}
                        </div>
                    ))
                }
                <div className="p-6 flex-1 bg-gray-700 overflow-y-auto flex items-center justify-center">
                    <div className="m-10 ">
                        <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombres</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" name="name"
                                    {...register("name", {
                                        required: true,
                                        pattern: /^[A-Za-z\s]+$/
                                    })}
                                />
                                {
                                    errors.name && errors.name.type === "required" && (
                                        <p className="text-red-500">El nombre es requerido</p>
                                    )
                                }
                                {
                                    errors.name && errors.name.type === "pattern" && (
                                        <p className="text-red-500">El nombre solo puede contener letras</p>
                                    )
                                }
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">Apellidos</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="surname" type="text" name="surname"
                                    {...register("surname", {
                                        required: true,
                                        pattern: /^[A-Za-z\s]+$/
                                    })}
                                />
                                {
                                    errors.surname && errors.surname.type === "required" && (
                                        <p className="text-red-500">El apellido es requerido</p>
                                    )
                                }
                                {
                                    errors.surname && errors.surname.type === "pattern" && (
                                        <p className="text-red-500">El apellido solo puede contener letras</p>
                                    )
                                }
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dni">Documento de Identidad</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="dni" type="text" name="dni"
                                    {...register("dni", {
                                        required: true,
                                        pattern: /^[0-9]{8}$/ // Expresión regular para 8 números
                                    })}
                                />
                                {
                                    errors.dni && errors.dni.type === "required" && (
                                        <p className="text-red-500">El DNI es requerido</p>
                                    )
                                }
                                {
                                    errors.dni && errors.dni.type === "pattern" && (
                                        <p className="text-red-500">El DNI debe tener exactamente 8 números</p>
                                    )
                                }
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" name="email"
                                    {...register("email", {
                                        required: true,
                                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                    })}
                                />
                                {
                                    errors.email && errors.email.type === "required" && (
                                        <p className="text-red-500">El correo electrónico es requerido</p>
                                    )
                                }
                                {
                                    errors.email && errors.email.type === "pattern" && (
                                        <p className="text-red-500">Ingresa un correo electrónico válido</p>
                                    )
                                }
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Telefono</label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="phone" type="text" name="phone"
                                    {...register("phone", {
                                        required: true,
                                        pattern: /^[0-9]{9}$/ // Expresión regular para 9 números
                                    })}
                                />
                                {
                                    errors.phone && errors.phone.type === "required" && (
                                        <p className="text-red-500">El teléfono es requerido</p>
                                    )
                                }
                                {
                                    errors.phone && errors.phone.type === "pattern" && (
                                        <p className="text-red-500">Ingresa un número de celular válido</p>
                                    )
                                }
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cargo">Cargo</label>
                                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="cargo" name="cargo"
                                    {...register("cargo", {
                                        required: true,
                                        validate: value => value !== "Escoge un Cargo"
                                    })}
                                    defaultValue="Escoge un Cargo" // Establecer el valor predeterminado
                                >

                                    <option disabled>Escoge un Cargo</option>
                                    <option>Admin</option>
                                    <option>Ingeniero</option>
                                    <option>Arquitecto</option>
                                    {/* Agrega más opciones si es necesario */}
                                </select>
                                {errors.cargo && errors.cargo.type === "required" && (
                                    <p className="text-red-500">Cargo es requerido</p>
                                )}
                                {errors.cargo && errors.cargo.type === "validate" && (
                                    <p className="text-red-500">Por favor, selecciona un cargo válido</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">Cargo</label>
                                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="estado" name="estado"
                                    {...register("estado", {
                                        required: true,
                                        validate: value => value !== "Escoge un estado"
                                    })}
                                    defaultValue="Escoge un estado" // Establecer el valor predeterminado
                                >

                                    <option disabled>Escoge un estado</option>
                                    <option>Activo</option>
                                    <option>Inactivo</option>
                                    {/* Agrega más opciones si es necesario */}
                                </select>
                                {errors.estado && errors.estado.type === "required" && (
                                    <p className="text-red-500">Estado es requerido</p>
                                )}
                                {errors.estado && errors.estado.type === "validate" && (
                                    <p className="text-red-500">Por favor, selecciona un estado válido</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewPersonalPage