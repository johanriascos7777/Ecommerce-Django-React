import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { check_authenticated, load_user, refresh } from '../redux/actions/auth';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; 



const Layout = (props) => {
  const dispatch = useDispatch(); // Obténemos la funcion dispatch de redux


{/*
  Este useEffect ejecuta las acciones en secuencia usando async/await, asegurando que cada acción termine antes de iniciar la siguiente.
*/}

useEffect(() => {
  const initializeAuth = async () => {
    try {
      await dispatch(refresh());// 1. Intenta refrescar el token
      await dispatch(check_authenticated());// 2. Verifica autenticación con el nuevo token
      await dispatch(load_user());// 3. Carga los datos del usuario
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Opcional: Mostrar un mensaje al usuario
    }
  };
  initializeAuth();
}, [dispatch]);

  return (
    <div>
        <Navbar/>
        <ToastContainer autoClose ={5000} />
        {props.children}
        <Footer/>
    </div>
  )
}

export default Layout