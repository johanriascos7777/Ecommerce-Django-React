// Fichero: src/components/home/ProductsSold.js

import { Link } from "react-router-dom";

/*
const products = [
    {
      id: 1,
      name: 'Black Basic Tee',
      price: '$32',
      href: '#',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-03-favorite-01.jpg',
      imageAlt: "Model wearing women's black cotton crewneck tee.",
    },
    // More products...
  ]
*/


export default function ProductsSold({ data }) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Los mas vendidos</h2>
          <a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
            Browse all favorites<span aria-hidden="true"> →</span>
          </a>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-y-0 sm:gap-x-6 lg:gap-x-8">
          {data && 
          data !== null &&
          data !== undefined &&
          data.map((product) => (
            <div key={product.id} className="group relative">
              <div className="w-full h-96 rounded-lg overflow-hidden group-hover:opacity-75 sm:h-auto sm:aspect-w-2 sm:aspect-h-3">
                
                {/* --- LA CORRECCIÓN ESTÁ AQUÍ --- */}
                <img
                  // Construimos la URL completa de nuevo.
                  // Usamos get_thumbnail para ser consistentes con el otro componente y tu serializer.
                  src={`${import.meta.env.VITE_API_URL}${product.get_thumbnail}`}
                  alt={product.name}
                  className="w-full h-full object-center object-cover"
                />

              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                <Link to={`/product/${product.id}`}>
                  <span className="absolute inset-0" />
                  {product.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500">${product.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link to="#" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Ver mas productos<span aria-hidden="true"> →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}