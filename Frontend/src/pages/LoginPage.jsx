import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import homeReviveIllustration from '../resources/4153051.jpg';


// ...


function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { signin, errors: signinErrors, isAuthenticated, user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (user && user.data.estado === "Activo") {
                if (user.data.cargo === "Admin") {
                    navigate("/adminpage");
                } else if (user.data.cargo === "Ingeniero") {
                    navigate("/ingenieropage");
                } else {
                    navigate("/homepage");
                }
            }
        }        
    }, [isAuthenticated, user, navigate]);
    

    const onSubmit = handleSubmit((data) => {
        signin(data);
    });
    


    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center md:justify-start bg-white p-4">
            <div className="flex-1 hidden md:block">
                <img src={homeReviveIllustration} alt="HomeRevive Illustration" />
            </div>

            {/* Parte del formulario de inicio de sesión */}
            <div className="flex-1 bg-white p-8 md:p-16 rounded-lg mt-10 md:mt-0">
                <h2 className="text-4xl font-semibold mb-6 font-roboto-mono">HomeRevive</h2>
                {
                        signinErrors.map((error, i) => (
                            <div className='bg-red-500 p2 text-white text-center my-2' key={i}>
                                {error}
                            </div>
                        ))
                    }
                <p className="text-gray-600 font-open-sans mb-10">
                    Bienvenido de nuevo! Por favor, introduzca sus datos.
                </p>
                <form onSubmit={onSubmit} className="mt-10 ">
                    <div className="mb-6">

                        <input
                            type="username"
                            id="username"
                            placeholder="Username"
                            className="w-full px-2 py-1 border-b-2 focus:outline-none focus:border-green-500"
                            {...register("username", { required: true })}
                        />
                        {
                                    errors.username && (
                                        <p className="text-red-500">Usuario es requerido</p>
                                    )
                        }
                    </div>

                    <div className="mb-4">

                        <input
                            type="password"
                            id="password"
                            placeholder="Contraseña"
                            className="w-full px-2 py-1 border-b-2 focus:outline-none focus:border-green-500"
                            {...register("password", { required: true })}
                        />
                        {
                                    errors.password && (
                                        <p className="text-red-500">Contraseña es requerido</p>
                                    )
                        }
                        <a href="#" className="text-sm  mb-10 font-bold text-black-900 hover:underline mt-2 block text-right">Olvidaste tu contraseña?</a>

                    </div>
                    <button
                        type="submit"
                        className="w-full text-2xl font-bold font-roboto-mono bg-black text-white p-4 px-5 btn-radius hover:bg-green-600 transition-all duration-200 mt-5 md:mt-0" 
                    >
                        Iniciar Sesion
                    </button>


                </form>
            </div>
        </div>
    );
}

export default LoginPage;
