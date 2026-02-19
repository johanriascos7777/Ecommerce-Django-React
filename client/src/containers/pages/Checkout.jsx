import Layout from '../../hocs/Layout';
import {get_items, get_total, get_item_total, remove_item, update_item} from '../../redux/actions/cart'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import CartItem from '../../components/cart/CartItem';
import { Link } from 'react-router-dom';
import { setAlert } from '../../redux/actions/alert';
import { get_shipping_options } from '../../redux/actions/shipping';


const Checkout = () => {
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

  // 3. OBTENEMOS LAS OPCIONES DE ENVÍO DEL SLICE 'Shipping'
  // El slice Shipping guarda en 'shipping' el array de opciones que devuelve el backend.
  const { shipping } = useSelector(state => state.Shipping);

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

  // 4. ESTADO LOCAL DEL FORMULARIO
  // shipping_id guarda la opción de envío que el usuario seleccione con los radio buttons.
  // Empieza en 0 (ninguna opción seleccionada).
  const [formData, setFormData] = useState({
    shipping_id: 0,
  });

  const { shipping_id } = formData;

  // Manejador genérico para cualquier input/select/radio del formulario
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {

    // Despachamos las acciones para obtener los datos del carrito
    dispatch(get_items());
    dispatch(get_total());
    dispatch(get_item_total());

    // Cargamos las opciones de envío disponibles desde el backend.
    // No necesita argumentos: solo trae la lista de opciones (ej: "Express $10 - 2 días").
    dispatch(get_shipping_options());

    // ⛔ NO DESCOMENTAR ESTAS LÍNEAS - ERROR DE DISEÑO:
    // remove_item(item) y update_item(item, count) REQUIEREN argumentos obligatorios.
    // Llamarlos aquí sin argumentos causaría: "Cannot read properties of undefined"
    // porque internamente intentan acceder a item.product.id y item.product.quantity.
    //
    // Estas acciones NO son de "carga inicial", sino de "respuesta a eventos del usuario".
    // Se ejecutan correctamente desde CartItem a través de los handlers:
    //   → handleRemoveItem(item)       en el botón "Remove"
    //   → handleUpdateItem(item, count) en el formulario "Update"
    //
    /* dispatch(remove_item());
    dispatch(update_item()); */
    /* Pasa funciones que despachen acciones a CartItem:
    En tu código, estás pasando la acción importada (update_item, remove_item) directamente como prop. Lo correcto es pasar una nueva función que, cuando se llame, despache esa acción.*/

  },[dispatch]); // Es buena práctica añadir 'dispatch' a las dependencias.


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

  const showItems = () => {
    return(
      <div>
        {
          items && 
          items !== null && 
          items !== undefined && 
          items.length !== 0 && 
          items.map((item, index)=>{
            let count = item.count;
            return (
              <div key={index}>
                <CartItem 
                  item={item}
                  count={count}
                  update_item={handleUpdateItem}
                  remove_item={handleRemoveItem}
                  setAlert={setAlert}
                />
              </div>
            );
          })
        }
      </div>
    )
  }

  // Renderiza los radio buttons con las opciones de envío que llegaron del backend.
  // Cada opción muestra: nombre - precio (tiempo de entrega).
  // Al seleccionar una, onChange actualiza shipping_id en el estado local del formulario.
  const renderShipping = () => {
    if (shipping && shipping !== null && shipping !== undefined) {
      return (
        <div className='mb-5'>
          {
            shipping.map((shipping_option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  onChange={e => onChange(e)}
                  value={shipping_option.id}
                  name='shipping_id'
                  type='radio'
                  required
                />
                <label className='ml-4'>
                  {shipping_option.name} - ${shipping_option.price} ({shipping_option.time_to_delivery})
                </label>
              </div>
            ))
          }
        </div>
      );
    }
  };

  const checkoutButton = () => {
    if (total_items < 1) {
      return(
        <>
          <Link to='/shop'>
            <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
              Buscar items
            </button>
          </Link>
        </>
      )
    } else if (!isAuthenticated) {
      return(
        <>
          <Link to='/login'>
            <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
              Login
            </button>
          </Link>
        </>
      )
    } else {
      return(
        <>
          <Link to='/checkout'>
            <button className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
              Checkout
            </button>
          </Link>
        </>
      )
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-cyan-500">CHECKOUT</h1>
      <div>Total de artículos: {total_items}</div>
      <div>Subtotal: ${amount}</div>
      {showItems()}

      <hr /> {/* Un separador simple */}

      {/* =============== Order summary SIN ESTILOS =============== */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading">
          Order summary
        </h2>

        <dl>
          {/* =============== SHIPPING OPTIONS =============== 
              renderShipping() muestra los radio buttons con las opciones de envío.
              Cuando el usuario seleccione una, shipping_id se actualizará en el formData.
              Más adelante, shipping_id se usará en get_payment_total() para calcular
              el total incluyendo el costo del envío seleccionado. */}
          <div className="mb-4 text-2xl text-purple-600 font-bold">
            SHIPPING OPTIONS
          </div>
          {renderShipping()}

          <div>
            <dt>
              <span>Shipping estimate</span>
            </dt>
            <dd>$5.00</dd>
          </div>
          <div>
            <dt>
              <span>Tax estimate</span>
            </dt>
            <dd>$8.32</dd>
          </div>
          <div>
            <dt>Order total</dt>
            <dd>${amount.toFixed(2)}</dd>
          </div>
        </dl>

        <div>
          {checkoutButton()}
        </div>
      </section>
    </Layout>
  )
}

export default Checkout