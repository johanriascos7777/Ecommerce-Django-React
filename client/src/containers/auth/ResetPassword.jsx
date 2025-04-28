import Layout from "../../hocs/Layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reset_password } from "../../redux/actions/auth";
import { Oval } from "react-loader-spinner";    // ← Spinner Oval importado
import { Navigate } from "react-router";        // ← Para redireccionar tras login
import { Link } from "react-router";


export default function Reset_Password() {
  const dispatch = useDispatch();

  // 1. Obtenemos el estado de loading desde Redux (state.Auth.loading)
  const loading = useSelector((state) => state.Auth.loading);

  // 2. Control para saber cuándo redirigir al usuario tras el dispatch
  const [activated, setActivated] = useState(false);





  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //cuando hemos enviado un password request:
  const [requestSent, setRequestSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    
  });

  const { email } = formData;

  // 3. Actualizamos el estado local al cambiar inputs
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 4. Al hacer submit, lanzamos la acción de login y activamos la redirección
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(reset_password(email));
    setRequestSent(true); // ← Activamos el estado de request enviado
 
  };

  // 5. Si ya accionamos el login, redirigimos al home
  if (requestSent && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Recover your password
          </h2>
          <span className="text-gray-900">¿Recordaste tu contraseña? <Link className="text-blue-500" to="/login">Login here</Link> </span>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  value={email}
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  onChange={onChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

          
            <div>
              {/* 6. Botón con condicional de loading
              
                El botón de envío lleva el atributo disabled={loading} para evitar múltiples submissions mientras carga.
                Dentro del botón, renderizamos el spinner <Oval /> si loading es true; en caso contrario, mostramos "Login".

              */}
              <button
                type="submit"
                disabled={loading} // ← Deshabilitar mientras carga
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
              >
                {loading ? (
                  // 7. Spinner Oval cuando loading === true
                  <Oval
                    height={20}
                    width={20}
                    color="#fff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#fff"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                ) : (
                  // 8. Texto normal cuando no está cargando
                  "Send email"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
