import Layout from "../../hocs/Layout";
import { Oval } from "react-loader-spinner"; 
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { get_product, get_related_products } from "../../redux/actions/products";
import { get_items, add_item, get_total, get_item_total } from "../../redux/actions/cart";
import { useEffect, useState  } from "react";
import ImageGallery from "../../components/product/ImageGallery"; // Asegúrate de importar ImageGallery

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);


// CÓDIGO CORREGIDO en ProductDetail.jsx
const addToCart = async () => {
  if (product && product.quantity > 0) {
      setLoading(true);
      await dispatch(add_item(product));
      await dispatch(get_items());
      await dispatch(get_total());
      await dispatch(get_item_total());
      setLoading(false);
      navigate('/cart');
  }
}


  const params = useParams();
  const productId = params.productId;

  // Con useSelector, accedemos al estado de 'product' desde el store de Redux.
  // La estructura state.Products.product depende de cómo hayas configurado tu reducer.
  const product = useSelector(state => state.Products.product);

 // --- ¡AÑADE ESTA LÍNEA AQUÍ! ---
  console.log('Datos del producto en Detail:', product);
  // ---------------------------------

  useEffect(() => {
    // Despachamos las acciones para obtener los datos del producto
    if (productId) {
      dispatch(get_product(productId));
      dispatch(get_related_products(productId));
    }
  }, [dispatch, productId]);

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            
            {/* Componente de la galería de imágenes */}
            {/* Le pasamos la foto del producto desde el estado de Redux */}
            <ImageGallery photo={product && product.photo} />

            {/* Información del producto */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              {/* Mostramos los detalles del producto si 'product' existe */}
              {product && (
                <>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

                  <div className="mt-3">
                    <h2 className="sr-only">Información del producto</h2>
                    <p className="text-3xl text-gray-900">$ {product.price}</p>
                  </div>
                  
                  {/* Aquí se renderizará la descripción HTML del producto */}
                  <div className="mt-6">
                    <h3 className="sr-only">Descripción</h3>
                    <div
                      className="text-base text-gray-700 space-y-6"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>

                  {/* Lógica para mostrar si hay stock (puedes añadirla más adelante) */}
                  <div className="mt-4">
                                  <p className="mt-4">
                  {
                      product && 
                      product !== null &&
                      product !== undefined && 
                      product.quantity > 0 ? (
                          <span className='text-green-500'>
                              In Stock
                          </span>
                      ) : (
                          <span className='text-red-500'>
                              Out of Stock
                          </span>
                      )
                  }
              </p>

                  </div>
                  
                  {/* Aquí irían los botones de 'Añadir al carrito', 'Añadir a la lista de deseos', etc. */}
                     <button
  onClick={addToCart}
  // Deshabilitamos el botón mientras carga para evitar múltiples clics
  disabled={loading}
  // Añadimos clases para darle estilo, padding, color, etc.
  className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
>
  {loading ? (
    <Oval
      height={20}
      width={20}
      color="#fff" // Cambiado a blanco para que contraste con el fondo del botón
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="#eee" // Un color secundario para el efecto visual
      strokeWidth={3}
      strokeWidthSecondary={3}
    />
  ) : (
    "Añadir al carrito"
  )}
</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetail;