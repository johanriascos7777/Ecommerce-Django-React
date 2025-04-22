import Layout from "../../hocs/Layout";
import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activate } from "../../redux/actions/auth";
import { Oval } from "react-loader-spinner";  // Importación corregida


const Activate = () => {
  // Usamos el hook useDispatch para obtener la función de dispatch
  const dispatch = useDispatch();
  // Usamos el hook useParams para obtener los parámetros de la URL
  const params = useParams();
  
  // Estado local para controlar si la cuenta fue activada
  const [activated, setActivated] = useState(false);
  
  // Usamos el hook useSelector para obtener el estado 'loading' de Redux
  const loading = useSelector((state) => state.Auth.loading);
  
  // Este hook se ejecuta cuando el componente es montado o cuando cambian los parámetros
  useEffect(() => {
    // Aquí podríamos hacer alguna acción cuando el componente se monta
  }, [params]);

  // Función que maneja el clic del botón para activar la cuenta
  const handleClick = () => {
    const uid = params.uid;
    const token = params.token;

    // Llamamos a la acción de activar la cuenta (dispatch)
    dispatch(activate(uid, token));

    // Marcamos como activado para evitar reintentar la activación
    setActivated(true);
  };

  // Si la cuenta ya ha sido activada y el estado de loading es falso, redirigimos a la home
  if (activated && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Si está en proceso de carga, mostramos el loader */}
          {loading ? (
            <button
              className="inline-flex mt-12 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
               <Oval type="Oval" color="#fff" width={20} height={20} />
            </button>
          ) : (
            // Si no está cargando, mostramos el botón para activar la cuenta
            <button
              onClick={handleClick}
              className="inline-flex mt-12 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Activate Account
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Activate;
