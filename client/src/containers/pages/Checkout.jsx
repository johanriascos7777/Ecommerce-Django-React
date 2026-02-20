import Layout from '../../hocs/Layout';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

// Componentes
import CartItem from '../../components/cart/CartItem';
import ShippingForm from '../../components/checkout/ShippingForm';

// Acciones del carrito
import { get_items, get_total, get_item_total, update_item, remove_item } from '../../redux/actions/cart';
import { setAlert } from '../../redux/actions/alert';

// Acciones de envío
import { get_shipping_options } from '../../redux/actions/shipping';

// Acciones de autenticación (para refrescar el token si es necesario)
import { refresh } from '../../redux/actions/auth';

// Acciones de pago: obtener total, token de braintree y procesar pago
import { get_payment_total, get_client_token, process_payment } from '../../redux/actions/payment';

// Acción para validar cupones de descuento
import { check_coupon } from '../../redux/actions/coupons';

// Lista fija de países para el formulario de envío
import { countries } from '../../helpers/fixedCountries';

// Componente de pago de Braintree (requiere: npm install braintree-web-drop-in-react)
import DropIn from 'braintree-web-drop-in-react';


const Checkout = () => {
    const dispatch = useDispatch();

    // ─── ESTADO GLOBAL (Redux) ────────────────────────────────────────────────

    // Datos de autenticación
    const { isAuthenticated, user } = useSelector(state => state.Auth);

    // Items del carrito y total de artículos
    const { items, total_items } = useSelector(state => state.Cart);

    // Opciones de envío que llegan del backend
    const { shipping } = useSelector(state => state.Shipping);

    // Estado del pago: token de braintree, si ya se hizo el pago, loading, y los totales
    const {
        clientToken,
        made_payment,
        loading,
        original_price,
        total_after_coupon,
        total_amount,
        total_compare_amount,
        estimated_tax,
        shipping_cost,
    } = useSelector(state => state.Payment);

    // Cupón aplicado (si existe)
    const { coupon } = useSelector(state => state.Coupons);


    // ─── ESTADO LOCAL ─────────────────────────────────────────────────────────

    // Datos del formulario de envío y dirección
    const [formData, setFormData] = useState({
        full_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province_region: '',
        postal_zip_code: '',
        country_region: 'Colombia',   // ← cambia al país por defecto que prefieras
        telephone_number: '',
        coupon_name: '',
        shipping_id: 0,               // 0 = ninguna opción de envío seleccionada
    });

    const {
        full_name,
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        postal_zip_code,
        country_region,
        telephone_number,
        coupon_name,
        shipping_id,
    } = formData;

    // Instancia del widget de Braintree (se llena cuando DropIn está listo)
    const [data, setData] = useState({ instance: {} });

    // Manejador genérico para cualquier input del formulario
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    // ─── EFECTOS ──────────────────────────────────────────────────────────────

    useEffect(() => {
        // Al montar el componente: subimos al tope de la página y cargamos opciones de envío
        window.scrollTo(0, 0);
        dispatch(get_items());
        dispatch(get_total());
        dispatch(get_item_total());
        dispatch(get_shipping_options());
    }, [dispatch]);

    useEffect(() => {
        // Cuando el usuario esté cargado, pedimos el token de Braintree para mostrar el widget de pago
        dispatch(get_client_token());
    }, [user]);

    useEffect(() => {
        // Recalculamos el total cada vez que cambia el envío o el cupón aplicado
        if (coupon && coupon !== null && coupon !== undefined)
            dispatch(get_payment_total(shipping_id, coupon.name));
        else
            dispatch(get_payment_total(shipping_id, 'default'));
    }, [shipping_id, coupon]);


    // ─── HANDLERS ─────────────────────────────────────────────────────────────

    // Eliminar un ítem del carrito
    const handleRemoveItem = (item) => {
        dispatch(remove_item(item));
    };

    // Actualizar la cantidad de un ítem
    const handleUpdateItem = (item, count) => {
        dispatch(update_item(item, count));
    };

    // Validar y aplicar el cupón ingresado
    const apply_coupon = async e => {
        e.preventDefault();
        dispatch(check_coupon(coupon_name));
    };

    // Procesar el pago al enviar el formulario
    const buy = async e => {
        e.preventDefault();

        // Pedimos el nonce (token de un solo uso) al widget de Braintree
        let nonce = await data.instance.requestPaymentMethod();

        // Si hay cupón aplicado, lo mandamos; si no, mandamos string vacío
        const couponToSend = (coupon && coupon !== null && coupon !== undefined)
            ? coupon.name
            : '';

        dispatch(process_payment(
            nonce,
            shipping_id,
            couponToSend,
            full_name,
            address_line_1,
            address_line_2,
            city,
            state_province_region,
            postal_zip_code,
            country_region,
            telephone_number
        ));
    };


    // ─── RENDERS AUXILIARES ───────────────────────────────────────────────────

    // Lista de items del carrito
    const showItems = () => (
        <div>
            {items &&
                items !== null &&
                items !== undefined &&
                items.length !== 0 &&
                items.map((item, index) => (
                    <div key={index}>
                        <CartItem
                            item={item}
                            count={item.count}
                            update_item={handleUpdateItem}
                            remove_item={handleRemoveItem}
                            setAlert={setAlert}
                        />
                    </div>
                ))
            }
        </div>
    );

    // Radio buttons con las opciones de envío del backend
    const renderShipping = () => {
        if (shipping && shipping !== null && shipping !== undefined) {
            return (
                <div className='mb-5'>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Selecciona tu método de envío:</p>
                    {shipping.map((shipping_option, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                onChange={e => onChange(e)}
                                value={shipping_option.id}
                                name='shipping_id'
                                type='radio'
                                required
                                className="h-4 w-4 text-indigo-600"
                            />
                            <label className='ml-3 text-sm text-gray-700'>
                                {shipping_option.name} — <span className="font-medium">${shipping_option.price}</span>{' '}
                                <span className="text-gray-400">({shipping_option.time_to_delivery})</span>
                            </label>
                        </div>
                    ))}
                </div>
            );
        }
    };

    // Widget de pago de Braintree o botones de carga/login según el estado
    const renderPaymentInfo = () => {
        if (!clientToken) {
            // Aún no tenemos el token: mostramos un indicador simple
            if (!isAuthenticated) {
                return (
                    <Link
                        to="/login"
                        className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-gray-700"
                    >
                        Inicia sesión para continuar
                    </Link>
                );
            } else {
                return (
                    <button
                        disabled
                        className="w-full bg-indigo-400 text-white py-3 px-4 rounded-md text-sm font-medium cursor-not-allowed"
                    >
                        Cargando método de pago...
                    </button>
                );
            }
        } else {
            // Tenemos el token: mostramos el widget de Braintree y el botón de compra
            return (
                <>
                    {/* Widget de Braintree: muestra tarjeta de crédito, PayPal, etc. */}
                    <DropIn
                        options={{
                            authorization: clientToken,
                            paypal: { flow: 'vault' }
                        }}
                        onInstance={instance => (data.instance = instance)}
                    />

                    <div className="mt-4">
                        {loading ? (
                            // Mientras se procesa el pago mostramos el botón deshabilitado
                            <button
                                disabled
                                className="w-full bg-indigo-400 text-white py-3 px-4 rounded-md text-sm font-medium cursor-not-allowed"
                            >
                                Procesando pago...
                            </button>
                        ) : (
                            // Botón principal de compra
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                Realizar pedido
                            </button>
                        )}
                    </div>
                </>
            );
        }
    };


    // ─── GUARDS ───────────────────────────────────────────────────────────────

    // Si no está autenticado, redirigimos al inicio
    if (!isAuthenticated)
        return <Navigate to='/' />;

    // Si el pago fue exitoso, redirigimos a la página de agradecimiento
    if (made_payment)
        return <Navigate to='/thankyou' />;


    // ─── RENDER PRINCIPAL ─────────────────────────────────────────────────────

    return (
        <Layout>
            <div className="bg-white max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-10">

                    {/* ── Columna izquierda: items del carrito ── */}
                    <section className="lg:col-span-7">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Tu carrito ({total_items} {total_items === 1 ? 'artículo' : 'artículos'})
                        </h2>

                        {/* Mostramos los items o un mensaje si está vacío */}
                        {items && items.length > 0
                            ? <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                                {showItems()}
                              </ul>
                            : <p className="text-gray-400 text-sm">No tienes artículos en tu carrito.</p>
                        }
                    </section>

                    {/* ── Columna derecha: resumen + formulario de envío + pago ── */}
                    {/* ShippingForm contiene: cupón, totales, dirección y el widget de pago */}
                    <ShippingForm
                        full_name={full_name}
                        address_line_1={address_line_1}
                        address_line_2={address_line_2}
                        city={city}
                        state_province_region={state_province_region}
                        postal_zip_code={postal_zip_code}
                        telephone_number={telephone_number}
                        countries={countries}
                        onChange={onChange}
                        buy={buy}
                        user={user}
                        renderShipping={renderShipping}
                        total_amount={total_amount}
                        total_after_coupon={total_after_coupon}
                        total_compare_amount={total_compare_amount}
                        estimated_tax={estimated_tax}
                        shipping_cost={shipping_cost}
                        shipping_id={shipping_id}
                        shipping={shipping}
                        renderPaymentInfo={renderPaymentInfo}
                        coupon={coupon}
                        apply_coupon={apply_coupon}
                        coupon_name={coupon_name}
                    />

                </div>
            </div>
        </Layout>
    );
};

export default Checkout;