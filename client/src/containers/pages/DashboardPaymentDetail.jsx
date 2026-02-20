import { useSelector, useDispatch } from 'react-redux';
import { useEffect, Fragment, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';

// Acciones
import { list_orders, get_order_detail } from '../../redux/actions/orders';
import { get_items, get_total, get_item_total } from '../../redux/actions/cart';

// Componentes
import DashboardLink from '../../components/dashboard/DashboardLink';

// Heroicons v2
import {
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    FolderIcon,
    HomeIcon,
    InboxIcon,
    UsersIcon,
    XMarkIcon,           // antes: XIcon
    Bars3BottomLeftIcon, // antes: MenuAlt2Icon
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'; // antes: SearchIcon

// Headless UI
import { Dialog, Menu, Transition } from '@headlessui/react';


// Opciones del menú de usuario (estáticas)
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings',     href: '#' },
    { name: 'Sign out',     href: '#' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}


const DashboardPaymentDetail = () => {
    const dispatch = useDispatch();

    // ─── ESTADO GLOBAL ────────────────────────────────────────────────────────
    const { isAuthenticated, user } = useSelector(state => state.Auth);

    // `order` contiene el detalle de una sola orden con sus order_items
    const { order } = useSelector(state => state.Orders);

    // Estado local: controla si el sidebar móvil está abierto
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Obtenemos el transaction_id desde la URL: /dashboard/payment/:transaction_id
    const { transaction_id } = useParams();


    // ─── EFECTOS ──────────────────────────────────────────────────────────────
    useEffect(() => {
        // Cargamos el detalle de la orden específica usando el transaction_id de la URL
        dispatch(get_order_detail(transaction_id));
    }, [transaction_id, dispatch]);


    // ─── GUARD: redirigir si no está autenticado ──────────────────────────────
    if (!isAuthenticated)
        return <Navigate to="/" />;

    // Guard: esperamos a que la orden cargue antes de renderizar el detalle
    // Esto evita el crash de `order.order_items` cuando order aún es null
    if (!order || order === null)
        return <div className="p-8 text-gray-500">Cargando detalle de la orden...</div>;


    // ─── RENDER ───────────────────────────────────────────────────────────────
    return (
        <>
            <div>
                {/* ── Sidebar móvil ── */}
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
                                    {/* Botón cerrar sidebar en móvil */}
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

                        {/* Dummy element para forzar el shrink del sidebar */}
                        <div className="flex-shrink-0 w-14" aria-hidden="true" />
                    </Dialog>
                </Transition.Root>


                {/* ── Sidebar fijo desktop ── */}
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


                    {/* ── Detalle de la orden ── */}
                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="max-w-3xl mx-auto">
                                    <div className="bg-white">
                                        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">

                                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                                Order Details
                                            </h1>

                                            {/* Encabezado: transaction ID + fecha relativa con moment */}
                                            <div className="text-sm border-b border-gray-200 mt-2 pb-5 sm:flex sm:justify-between">
                                                <dl className="flex">
                                                    <dt className="text-gray-500">Transaction ID: &nbsp;</dt>
                                                    <dd className="font-medium text-gray-900">{order.transaction_id}</dd>
                                                    <dt>
                                                        <span className="sr-only">Date</span>
                                                        <span className="text-gray-400 mx-2" aria-hidden="true">&middot;</span>
                                                    </dt>
                                                    <dd className="font-medium text-gray-900">
                                                        {/* moment convierte la fecha ISO a formato relativo */}
                                                        <time>{moment(order.date_issued).fromNow()}</time>
                                                    </dd>
                                                </dl>
                                            </div>

                                            {/* Lista de items de la orden */}
                                            {/* order.order_items viene del backend con los productos de esta orden */}
                                            <div className="mt-8">
                                                <h2 className="sr-only">Products purchased</h2>

                                                <div className="space-y-24">
                                                    {order.order_items && order.order_items.map((product) => (
                                                        <div
                                                            key={product.id}
                                                            className="grid grid-cols-1 text-sm sm:grid-rows-1 sm:grid-cols-12 sm:gap-x-6 md:gap-x-8 lg:gap-x-8"
                                                        >
                                                            {/* Nombre y descripción del producto */}
                                                            <div className="mt-6 sm:col-span-7 sm:mt-0 md:row-end-1">
                                                                <h3 className="text-lg font-medium text-gray-900">
                                                                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                                                                </h3>
                                                                <p className="font-medium text-gray-900 mt-1">
                                                                    Cantidad: {product.count}
                                                                </p>
                                                                <p className="text-gray-500 mt-3">{product.description}</p>
                                                            </div>

                                                            {/* Dirección de entrega, costo de envío y barra de progreso */}
                                                            <div className="sm:col-span-12 md:col-span-7">
                                                                <dl className="grid grid-cols-1 gap-y-8 border-b py-8 border-gray-200 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                                                                    <div>
                                                                        <dt className="font-medium text-gray-900">Delivery address</dt>
                                                                        <dd className="mt-3 text-gray-500">
                                                                            <span className="block">{order.address_line_1}</span>
                                                                            <span className="block">{order.address_line_2}</span>
                                                                        </dd>
                                                                    </div>
                                                                    <div>
                                                                        <dt className="font-medium text-gray-900">Shipping</dt>
                                                                        <dd className="mt-3 text-gray-500 space-y-3">
                                                                            <p>$ {order.shipping_price}</p>
                                                                            <p>$ {order.amount} Total Cost</p>
                                                                        </dd>
                                                                    </div>
                                                                </dl>

                                                                {/* Estado con barra de progreso */}
                                                                <p className="font-medium text-gray-900 mt-6 md:mt-10">
                                                                    Status: {order.status}
                                                                </p>
                                                                <div className="mt-6">
                                                                    <div className="bg-gray-200 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-2 bg-indigo-600 rounded-full"
                                                                            style={{ width: `calc((${order.step} * 2 + 1) / 8 * 100%)` }}
                                                                        />
                                                                    </div>
                                                                    {/* Etiquetas: Order placed → Processing → Shipped → Delivered */}
                                                                    <div className="hidden sm:grid grid-cols-4 font-medium text-gray-600 mt-6">
                                                                        <div className="text-indigo-600">Order placed</div>
                                                                        <div className={classNames(order.step > 0 ? 'text-indigo-600' : '', 'text-center')}>
                                                                            Processing
                                                                        </div>
                                                                        <div className={classNames(order.step > 1 ? 'text-indigo-600' : '', 'text-center')}>
                                                                            Shipped
                                                                        </div>
                                                                        <div className={classNames(order.step > 2 ? 'text-indigo-600' : '', 'text-right')}>
                                                                            Delivered
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
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

export default DashboardPaymentDetail;