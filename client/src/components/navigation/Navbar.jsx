import React, { useState, Fragment, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';

// 🧠 1. Importando los hooks de Redux que vamos a usar
import { useSelector, useDispatch } from 'react-redux';
import { MdArrowDropDown, MdPerson, MdExitToApp, MdShoppingCart, MdDashboard, MdMenu, MdClose } from 'react-icons/md';

import { logout } from '../../redux/actions/auth';
// ✅ 2. Importando la acción que queremos despachar para obtener las categorías
import { get_categories } from '../../redux/actions/categories';
import { get_search_products } from '../../redux/actions/products';

// Headless UI para el menú móvil con animación
import { Popover, Transition } from '@headlessui/react';

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
    const total_items_redux = useSelector(state => state.Cart.total_items);

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
    };

    // --- Lógica para el SearchBox que ahora vive en el Navbar ---
    const [formData, setFormData] = useState({
        search: '',
        category_id: '0'
    });

    const { search, category_id } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 🚀 3. ¡Aquí está la magia! Implementamos la lógica de búsqueda.
    const onSubmit = e => {
        e.preventDefault();

        // Despachamos la acción `get_search_products` con el término de búsqueda y la categoría.
        dispatch(get_search_products(search, category_id));

        // 🔗 Después de despachar la acción, redirigimos al usuario a la página de la tienda (o a una página de resultados).
        // La página `/search` ahora mostrará los productos filtrados por la búsqueda.
        navigate('/search');
    };
    // --- Fin de la lógica del SearchBox ---


    // Menú autenticado — incluye acceso al Dashboard y cerrar sesión
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
                    {user?.first_name || 'Usuario'}
                </span>
                <MdArrowDropDown className="text-xl text-[#333333]" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md min-w-[160px] z-50">
                    <div className="py-1">
                        {/* ✅ Enlace al Dashboard — agregado desde el tutorial */}
                        <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                        >
                            <MdDashboard />
                            Dashboard
                        </Link>

                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                        >
                            <MdPerson />
                            Perfil
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-gray-700"
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
                className="flex items-center gap-1 text-[#333333] hover:text-gray-500"
            >
                <MdPerson />
                Ingresar
            </Link>
            <Link
                to="/signup"
                className="flex items-center gap-1 text-[#333333] hover:text-gray-500"
            >
                <MdExitToApp />
                Registrarse
            </Link>
        </Fragment>
    );

    return (
        <Fragment>
            {/* ── Navbar principal (desktop) ── */}
            <div className='w-full max-w-7xl bg-white mr-auto ml-auto'>
                <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-3">

                    {/* Logo / marca */}
                    <Link to="/" className="flex items-center flex-shrink-0">
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                            alt="Logo"
                        />
                    </Link>

                    {/* 👇 Le pasamos las categorías y la lógica al SearchBox */}
                    {/* Ocultamos el buscador en móvil, se muestra en el menú desplegable */}
                    <div className="hidden md:block">
                        <SearchBox
                            categories={categories}
                            search={search}
                            onChange={onChange}
                            onSubmit={onSubmit}
                        />
                    </div>

                    {/* Links de navegación desktop */}
                    <div className="hidden md:flex gap-6 text-[#333333] items-center">
                        <NavLink to="/shop">
                            <span>Shop</span>
                        </NavLink>
                    </div>

                    {/* Carrito + auth (desktop) */}
                    <div className="hidden md:flex gap-4 items-center">
                        <Link to="/cart" className="relative">
                            <div className='p-2 rounded'>
                                <MdShoppingCart className="text-[24px] text-[#555555]" />
                            </div>
                            {/* Badge con la cantidad de items del carrito */}
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-semibold rounded-full px-1.5 text-xs text-center">
                                {total_items_redux}
                            </span>
                        </Link>
                        {isAuthenticated ? authLinks : guestLinks}
                    </div>

                    {/* ── Botón hamburguesa (solo móvil) — agregado desde el tutorial ── */}
                    <div className="flex md:hidden items-center gap-3">
                        <Link to="/cart" className="relative">
                            <MdShoppingCart className="text-[24px] text-[#555555]" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-semibold rounded-full px-1.5 text-xs text-center">
                                {total_items_redux}
                            </span>
                        </Link>

                        {/* Popover para el menú móvil */}
                        <Popover className="relative">
                            {({ open, close }) => (
                                <>
                                    <Popover.Button className="bg-white p-2 rounded text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                                        {open
                                            ? <MdClose className="h-6 w-6" />
                                            : <MdMenu className="h-6 w-6" />
                                        }
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="duration-200 ease-out"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="duration-100 ease-in"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        {/* Panel del menú móvil */}
                                        <Popover.Panel className="absolute right-0 z-50 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                            <div className="p-4 space-y-3">

                                                {/* Buscador en móvil */}
                                                <SearchBox
                                                    categories={categories}
                                                    search={search}
                                                    onChange={onChange}
                                                    onSubmit={e => { onSubmit(e); close(); }}
                                                />

                                                <hr />

                                                <NavLink
                                                    to="/shop"
                                                    onClick={close}
                                                    className="block text-sm text-gray-700 hover:text-gray-900"
                                                >
                                                    Shop
                                                </NavLink>

                                                <hr />

                                                {/* Links según autenticación en móvil */}
                                                {isAuthenticated ? (
                                                    <>
                                                        <Link
                                                            to="/dashboard"
                                                            onClick={close}
                                                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                                                        >
                                                            <MdDashboard /> Dashboard
                                                        </Link>
                                                        <Link
                                                            to="/profile"
                                                            onClick={close}
                                                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                                                        >
                                                            <MdPerson /> Perfil
                                                        </Link>
                                                        <button
                                                            onClick={() => { handleLogout(); close(); }}
                                                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 w-full text-left"
                                                        >
                                                            <MdExitToApp /> Cerrar sesión
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link
                                                            to="/login"
                                                            onClick={close}
                                                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                                                        >
                                                            <MdPerson /> Ingresar
                                                        </Link>
                                                        <Link
                                                            to="/signup"
                                                            onClick={close}
                                                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                                                        >
                                                            <MdExitToApp /> Registrarse
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>

                </div>
            </div>

            <Alert />
        </Fragment>
    );
};

// 🥳 ¡No hay `connect` al final! 🥳
// Gracias a los hooks `useSelector` y `useDispatch`, ya no necesitamos envolver
// nuestro componente con la función `connect(mapStateToProps, mapDispatchToProps)(Navbar)`.
// El código es más limpio, más moderno y más fácil de entender.
export default Navbar; // Exportamos el componente directamente.