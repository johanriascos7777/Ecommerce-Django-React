import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { check_authenticated, load_user, refresh } from '../redux/actions/auth';
import {get_items, get_total, get_item_total} from '../redux/actions/cart'
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux'; 
// 🧠 1. Importando los hooks de Redux que vamos a usar




const Layout = (props) => {
  const dispatch = useDispatch(); // Obténemos la funcion dispatch de redux


    // ✨ 2. `useSelector` nos permite "seleccionar" datos del estado global de Redux.
  // Aquí estamos obteniendo el total de artículos del estado del carrito.
  const total_items = useSelector(state => state.Cart.total_items);

{/*
  Este useEffect ejecuta las acciones en secuencia usando async/await, asegurando que cada acción termine antes de iniciar la siguiente.
*/}

useEffect(() => {
  const initializeAuth = async () => {
    try {
      await dispatch(refresh());// 1. Intenta refrescar el token
      await dispatch(check_authenticated());// 2. Verifica autenticación con el nuevo token
      await dispatch(load_user());// 3. Carga los datos del usuario

       // 🚀 3. Despachamos las acciones para obtener los datos del carrito.
        await dispatch(get_items());
        await dispatch(get_total());
        await dispatch(get_item_total());

    } catch (error) {
      console.error('Error initializing auth:', error);
      // Opcional: Mostrar un mensaje al usuario
    }
  };
  initializeAuth();
}, [dispatch]);

  return (
    <div>
        {/* 👇 4. Pasamos la variable `total_items` como una prop a la Navbar */}
        <Navbar total_items={total_items} />
        <ToastContainer autoClose ={5000} />
        {props.children}
        <Footer/>
    </div>
  )
}

export default Layout