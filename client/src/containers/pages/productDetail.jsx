import Layout from "../../hocs/Layout";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { get_product, get_related_products } from "../../redux/actions/products";
import { useEffect } from "react";
import ImageGallery from "../../components/product/ImageGallery"; // Asegúrate de importar ImageGallery

const ProductDetail = () => {
  const dispatch = useDispatch();
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
                    <p>
                      {product.quantity > 0 ? (
                        <span className='text-green-500'>En Stock</span>
                      ) : (
                        <span className='text-red-500'>Agotado</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Aquí irían los botones de 'Añadir al carrito', 'Añadir a la lista de deseos', etc. */}

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