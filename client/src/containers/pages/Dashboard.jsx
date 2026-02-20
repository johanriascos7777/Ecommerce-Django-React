import Layout from '../../hocs/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, Fragment, useState } from 'react';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';

// Acciones
import { list_orders } from '../../redux/actions/orders';
import { get_items, get_total, get_item_total } from '../../redux/actions/cart';

// Componentes
import DashboardLink from '../../components/dashboard/DashboardLink';

// Heroicons v2 — rutas actualizadas de /outline y /solid a /24/outline y /24/solid
import {
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    UsersIcon,
    XMarkIcon,       // antes: XIcon
    PaperClipIcon,
    Bars3BottomLeftIcon, // antes: MenuAlt2Icon
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'; // antes: SearchIcon

// Headless UI — sin cambios
import { Dialog, Menu, Transition } from '@headlessui/react';


// Links de navegación del sidebar (estáticos, solo visuales por ahora)
const navigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Team',      href: '#', icon: UsersIcon, current: false },
    { name: 'Projects',  href: '#', icon: FolderIcon, current: false },
    { name: 'Calendar',  href: '#', icon: CalendarIcon, current: false },
    { name: 'Documents', href: '#', icon: InboxIcon, current: false },
    { name: 'Reports',   href: '#', icon: ChartBarIcon, current: false },
];

// Opciones del menú de usuario (estáticas por ahora)
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings',     href: '#' },
    { name: 'Sign out',     href: '#' },
];

// Utilidad para combinar clases de Tailwind condicionalmente
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}


const Dashboard = () => {
    const dispatch = useDispatch();

    // ─── ESTADO GLOBAL ────────────────────────────────────────────────────────
    const { isAuthenticated, user } = useSelector(state => state.Auth);
    const { orders } = useSelector(state => state.Orders);

    // Estado local: controla si el sidebar móvil está abierto o cerrado
    const [sidebarOpen, setSidebarOpen] = useState(false);


    // ─── EFECTOS ──────────────────────────────────────────────────────────────
    useEffect(() => {
        // Al montar: sincronizamos el carrito y cargamos las órdenes del usuario
        dispatch(get_items());
        dispatch(get_total());
        dispatch(get_item_total());
        dispatch(list_orders());
    }, [dispatch]);


    // ─── GUARD: si no está autenticado redirigimos al inicio ─────────────────
    if (!isAuthenticated)
        return <Navigate to="/" />;


    // ─── RENDER ───────────────────────────────────────────────────────────────
    return (
        <>
            <div>
                {/* ── Sidebar móvil (se abre con el botón de hamburguesa) ── */}
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    {/* Botón para cerrar el sidebar en móvil */}
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>

                                <div className="flex-shrink-0 flex items-center px-4">
                                    <Link to="/">
                                        <img
                                            className="h-8 w-auto cursor-pointer"
                                            src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                                            alt="Workflow"
                                        />
                                    </Link>
                                </div>

                                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                                    <nav className="px-2 space-y-1">
                                        <DashboardLink />
                                    </nav>
                                </div>
                            </div>
                        </Transition.Child>

                        <div className="flex-shrink-0 w-14" aria-hidden="true" />
                    </Dialog>
                </Transition.Root>


                {/* ── Sidebar fijo para desktop ── */}
                <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                    <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 gap-3">
                            <Link
                                to="/"
                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Regresar
                            </Link>
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                                alt="Workflow"
                            />
                        </div>

                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-2 pb-4 space-y-1">
                                <DashboardLink />
                            </nav>
                        </div>
                    </div>
                </div>


                {/* ── Contenido principal ── */}
                <div className="md:pl-64 flex flex-col flex-1">

                    {/* Barra superior */}
                    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">

                        {/* Botón hamburguesa (solo móvil) */}
                        <button
                            type="button"
                            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        <div className="flex-1 px-4 flex justify-between">
                            {/* Buscador */}
                            <div className="flex-1 flex">
                                <form className="w-full flex md:ml-0" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">Search</label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search-field"
                                            className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                            placeholder="Search"
                                            type="search"
                                            name="search"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Notificaciones + menú de usuario */}
                            <div className="ml-4 flex items-center md:ml-6">
                                <button
                                    type="button"
                                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button>

                                {/* Dropdown del perfil */}
                                <Menu as="div" className="ml-3 relative">
                                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        />
                                    </Menu.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            {userNavigation.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-gray-700'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>


                    {/* ── Contenido del dashboard ── */}
                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-3xl mx-auto">

                                    {/* Información del usuario */}
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Información de la cuenta
                                        </h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            Datos personales y pedidos.
                                        </p>
                                    </div>

                                    <div className="mt-5 border-t border-gray-200">
                                        <dl className="divide-y divide-gray-200">
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                                                <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <span className="flex-grow">
                                                        {user.first_name} {user.last_name}
                                                    </span>
                                                </dd>
                                            </div>

                                            <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
                                                <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    <span className="flex-grow">{user.email}</span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Lista de órdenes del usuario */}
                                    {/* orders viene del slice Orders gracias a list_orders() en el useEffect */}
                                    <div className="mt-8">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                            Mis pedidos
                                        </h3>
                                        {orders && orders.length > 0 ? (
                                            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                                                {orders.map((order, index) => (
                                                    <li key={index} className="py-4 flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                Orden #{order.transaction_id}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Total: ${order.amount}
                                                            </p>
                                                        </div>
                                                        {/* Enlace al detalle de la orden */}
                                                        <Link
                                                            to={`/order/${order.transaction_id}`}
                                                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                                        >
                                                            Ver detalle →
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-400">
                                                Aún no tienes pedidos realizados.
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default Dashboard;