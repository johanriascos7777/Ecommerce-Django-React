import React, { useState, Fragment, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
// 🧠 1. Importando los hooks de Redux que vamos a usar
import { useSelector, useDispatch } from 'react-redux';
import { MdArrowDropDown, MdPerson, MdExitToApp, MdShoppingCart } from 'react-icons/md';
import { logout } from '../../redux/actions/auth';
// ✅ 2. Importando la acción que queremos despachar para obtener las categorías
import { get_categories } from '../../redux/actions/categories';
import { get_search_products } from '../../redux/actions/products';
// Asumimos que el componente SearchBox está en la misma carpeta para este ejemplo
import SearchBox from './SearchBox';


export const Navbar = ({ total_items }) => {
    // 🧠 `useDispatch` nos da la función `dispatch` directamente.
    // En el método clásico, necesitaríamos `mapDispatchToProps` o pasar un objeto de acciones a `connect`.
    // ¡Nos estamos ahorrando un montón de código repetitivo!
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // ✨ `useSelector` nos permite "seleccionar" datos del estado global de Redux.
    // Esto reemplaza completamente la necesidad de la función `mapStateToProps`.
    // Es más directo y podemos tener varios `useSelector` para diferentes partes del estado.
    const isAuthenticated = useSelector(state => state.Auth.isAuthenticated);
    const user = useSelector(state => state.Auth.user);
    const categories = useSelector(state => state.Categories.categories);
    
    // 🚀 `useEffect` se ejecuta cuando el componente se monta (como `componentDidMount` en clases).
    // Es el lugar perfecto para hacer llamadas a la API o despachar acciones iniciales.
    // El segundo argumento `[dispatch]` es un array de dependencias. Significa que este efecto
    // solo se volverá a ejecutar si la función `dispatch` cambia (lo cual es muy raro).
    useEffect(() => {
        // Despachamos la acción para obtener las categorías cuando el Navbar se carga por primera vez.
        dispatch(get_categories());
    }, [dispatch]);


    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setIsOpen(false);
    }
    
    // --- Lógica para el SearchBox que ahora vive en el Navbar ---
    const [formData, setFormData] = useState({
      search: '',
      category_id: '0' 
    });

    const { search,  category_id } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

// 🚀 3. ¡Aquí está la magia! Implementamos la lógica de búsqueda.
    const onSubmit = e => {
      e.preventDefault();
      
      // Despachamos la acción `get_search_products` con el término de búsqueda y la categoría.
      dispatch(get_search_products(search, category_id));
      
      // 🔗 Después de despachar la acción, redirigimos al usuario a la página de la tienda (o a una página de resultados).
      // La página `/search` ahora mostrará los productos filtrados por la búsqueda.
      navigate('/search');
    }
    // --- Fin de la lógica del SearchBox ---


    // Menú autenticado
    const authLinks = (
        <div className="relative m-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                    <svg 
                        className="h-full w-full text-[#333333]" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </span>
                
                <span className="text-[#333333]">
                    {user?.name || 'Usuario'}
                </span>
                <MdArrowDropDown className="text-xl text-[#333333]" />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md min-w-[160px]">
                    <div className="py-1">
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        >
                            <MdPerson />
                            Perfil
                        </Link>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                            <MdExitToApp />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // Enlaces para invitados
    const guestLinks = (
        <Fragment>
            <Link 
                to="/login" 
                className="flex items-center gap-1 text-[#333333] hover:text-gray-200"
            >
                <MdPerson />
                Ingresar
            </Link>
            <Link 
                to="/signup" 
                className="flex items-center gap-1 text-[#333333] hover:text-gray-200"
            >
                <MdExitToApp />
                Registrarse
            </Link>
        </Fragment>
    );

    return (
        <Fragment>
            <div className='w-full max-w-7xl bg-white mr-auto ml-auto'>
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    {/* 👇 Le pasamos las categorías y la lógica al SearchBox */}
                    <SearchBox 
                        categories={categories}
                        search={search}
                        onChange={onChange}
                        onSubmit={onSubmit}
                    />

                    <div className="flex gap-6 w-full ml-5 text-[#333333] items-center">
                        <Link to="/shop"><span>Shop</span></Link>
                    </div>

                    <div className="flex gap-4">
                        <Link to="/cart">
                        <div className='p-2 rounded'><MdShoppingCart className="text-[24px] text-[#555555]" /></div>
                        <span className="text-xs absolute top-1 mt-0 ml-5 bg-red-500 text-white font-semibold rounded-full px-2 text-center">{total_items}</span>
                        </Link>
                        {isAuthenticated ? authLinks : guestLinks}
                    </div>
                </div>
            </div>
            <Alert/>
        </Fragment>
    );
};

// 🥳 ¡No hay `connect` al final! 🥳
// Gracias a los hooks `useSelector` y `useDispatch`, ya no necesitamos envolver
// nuestro componente con la función `connect(mapStateToProps, mapDispatchToProps)(Navbar)`.
// El código es más limpio, más moderno y más fácil de entender.
export default Navbar; // Exportamos el componente directamente.