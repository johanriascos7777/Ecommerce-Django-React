import Layout from '../../hocs/Layout';
import {get_items, get_total, get_item_total, remove_item, update_item} from '../../redux/actions/cart'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import CartItem from '../../components/cart/CartItem';
import { Link } from 'react-router-dom';
import { setAlert } from '../../redux/actions/alert';




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

useEffect(() => {

  // Despachamos las acciones para obtener los datos del carrito
  dispatch(get_items());
  dispatch(get_total());
  dispatch(get_item_total());
 /* dispatch(remove_item());
  dispatch(update_item());*/ 
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

    const checkoutButton = () => {
        if (total_items < 1) {
            return(
                <>
                <Link
                to='/shop'
                
            >
                <button
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            >
                Buscar items
                </button>
            </Link>
            </>
            )
        } else if (!isAuthenticated) {
            return(<>
            <Link
                to='/login'
                
            >
                <button
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            >
                Login
                </button>
            </Link>
            </>)
            
        } else {
            return(
                <>
                <Link
                to='/checkout'>
                 <button
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            >
                Checkout
                </button>
            </Link>
                </>
            )
           
        }
    }



  return (
  <Layout>
      <h1>Tu Carrito de Compras</h1>
      <div>Total de artículos: {total_items}</div>
      <div>Subtotal: ${amount}</div>
      {showItems()}
    </Layout>
  )
}

export default Cart