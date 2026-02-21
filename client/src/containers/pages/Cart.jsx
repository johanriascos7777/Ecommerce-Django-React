import Layout from '../../hocs/Layout';
import { get_items, get_total, get_item_total, remove_item, update_item } from '../../redux/actions/cart';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import CartItem from '../../components/cart/CartItem';
import { Link } from 'react-router-dom';
import { setAlert } from '../../redux/actions/alert';

// ✅ Acciones y componente de wishlist — agregados del tutorial
import { remove_wishlist_item } from '../../redux/actions/wishlist';
import WishlistItem from '../../components/cart/WishlistItem';

// ✅ Heroicons v2
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';


const Cart = () => {
    const dispatch = useDispatch();

    // 1. OBTENEMOS DATOS DEL SLICE 'Cart'
    // useSelector ya se encarga de que el componente se actualice cuando estos datos cambien.
    const { items, amount, compare_amount, total_items } = useSelector(state => state.Cart);

    // ==================================================================
    // 2. LA SOLUCIÓN: OBTENER DATOS DEL SLICE 'Auth'
    // Le pedimos a Redux que nos de el estado de autenticación.
    // Asumimos que tu slice de autenticación se llama 'Auth'. Si se llama 'Authentication'
    // o de otra forma, solo tienes que cambiar state.Auth por el nombre correcto.
    // ==================================================================
    const { isAuthenticated } = useSelector(state => state.Auth);

    // ✅ Items de la wishlist — del tutorial (state.Wishlist.items)
    const wishlist_items = useSelector(state => state.Wishlist.items);

    /*SE COMENTA PARA SUSTITUIR POR USE SELECTOR DE ARRIBA
    const cartState = useSelector(state => state.Cart)
    */

    /*SE COMENTA PARA SUSTITUIR POR USE SELECTOR DE ARRIBA
    // Accede a las propiedades del estado del carrito
    const cartItems = cartState.items;
    const amount = cartState.amount;        
    const compareAmount = cartState.compare_amount;
    const totalItems = cartState.total_items;
    */

    // ✅ render/setRender: fuerza re-render cuando se actualiza o elimina un item
    const [render, setRender] = useState(false);

    useEffect(() => {
        // Despachamos las acciones para obtener los datos del carrito
        window.scrollTo(0, 0);
        dispatch(get_items());
        dispatch(get_total());
        dispatch(get_item_total());
        /* dispatch(remove_item());
        dispatch(update_item()); */
        /* Pasa funciones que despachen acciones a CartItem:
        En tu código, estás pasando la acción importada (update_item, remove_item) directamente como prop. Lo correcto es pasar una nueva función que, cuando se llame, despache esa acción.*/
    }, [dispatch, render]); // ✅ agregamos render como dependencia igual que el tutorial


    // Función para manejar la eliminación de un ítem.
    // Esta es la función que pasaremos como prop a CartItem.
    const handleRemoveItem = (item) => {
        // Aquí sí usamos dispatch para enviar la acción.
        dispatch(remove_item(item));
    };

    // Función para manejar la actualización de un ítem.
    const handleUpdateItem = (item, count) => {
        dispatch(update_item(item, count));
    };

    // ✅ Función para eliminar un item de la wishlist
    const handleRemoveWishlistItem = (item) => {
        dispatch(remove_wishlist_item(item));
    };

    const showItems = () => {
        return (
            <div>
                {
                    items &&
                    items !== null &&
                    items !== undefined &&
                    items.length !== 0 &&
                    items.map((item, index) => {
                        let count = item.count;
                        return (
                            <div key={index}>
                                <CartItem
                                    item={item}
                                    count={count}
                                    update_item={handleUpdateItem}
                                    remove_item={handleRemoveItem}
                                    render={render}
                                    setRender={setRender}
                                    setAlert={setAlert}
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    // ✅ Lista de items guardados en wishlist — agregado del tutorial
    const showWishlistItems = () => {
        return (
            <div>
                {
                    wishlist_items &&
                    wishlist_items !== null &&
                    wishlist_items !== undefined &&
                    wishlist_items.length !== 0 &&
                    wishlist_items.map((item, index) => {
                        let count = item.count;
                        return (
                            <div key={index}>
                                <WishlistItem
                                    item={item}
                                    count={count}
                                    update_item={handleUpdateItem}
                                    remove_wishlist_item={handleRemoveWishlistItem}
                                    render={render}
                                    setRender={setRender}
                                    setAlert={setAlert}
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    const checkoutButton = () => {
        if (total_items < 1) {
            return (
                <>
                    <Link to='/shop'>
                        <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                            Buscar items
                        </button>
                    </Link>
                </>
            );
        } else if (!isAuthenticated) {
            return (
                <>
                    <Link to='/login'>
                        <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                            Login
                        </button>
                    </Link>
                </>
            );
        } else {
            return (
                <>
                    <Link to='/checkout'>
                        <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                            Checkout
                        </button>
                    </Link>
                </>
            );
        }
    };


    return (
        <Layout>
            <div className="bg-white">
                <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Shopping Cart Items ({total_items})
                    </h1>

                    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">

                        {/* Lista de items del carrito */}
                        <section aria-labelledby="cart-heading" className="lg:col-span-7">
                            <h2 id="cart-heading" className="sr-only">
                                Items in your shopping cart
                            </h2>
                            <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                                {showItems()}
                            </ul>
                        </section>

                        {/* =============== Order summary =============== */}
                        <section
                            aria-labelledby="summary-heading"
                            className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                        >
                            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                                Order summary
                            </h2>

                            <dl className="mt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Subtotal</dt>
                                    <dd className="text-sm font-medium text-gray-900">${compare_amount.toFixed(2)}</dd>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                    <dt className="flex items-center text-sm text-gray-600">
                                        <span>Shipping estimate</span>
                                        <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                                            <span className="sr-only">Learn more about how shipping is calculated</span>
                                            <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                                        </a>
                                    </dt>
                                    <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                    <dt className="flex text-sm text-gray-600">
                                        <span>Tax estimate</span>
                                        <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                                            <span className="sr-only">Learn more about how tax is calculated</span>
                                            <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                                        </a>
                                    </dt>
                                    <dd className="text-sm font-medium text-gray-900">$8.32</dd>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                    <dt className="text-base font-medium text-gray-900">Order total</dt>
                                    <dd className="text-base font-medium text-gray-900">${amount.toFixed(2)}</dd>
                                </div>
                            </dl>

                            <div className="mt-6">
                                {checkoutButton()}
                            </div>
                        </section>
                    </div>

                    {/* ✅ Items de la wishlist debajo del carrito — agregado del tutorial */}
                    {showWishlistItems()}

                </div>
            </div>
        </Layout>
    );
};

export default Cart;