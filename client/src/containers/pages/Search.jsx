import Layout from '../../hocs/Layout';
import { Disclosure,  DisclosureButton,DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get_categories } from '../../redux/actions/categories';
import { get_filtered_products } from '../../redux/actions/products';
import ProductCard from '../../components/product/ProductCard';
import { prices } from '../../helpers/fixedPrices';


const Search = () => {

  const dispatch = useDispatch();

  // =================================================================================
  // == ✨ SELECCIÓN DE DATOS DEL ESTADO (hooks) ✨                                  ==
  // == Tu código para leer del store de Redux es perfecto.                         ==
  // =================================================================================
  const categories = useSelector(state => state.Categories.categories);
  const filtered_products = useSelector(state => state.Products.filtered_products);
  const searched_products = useSelector(state => state.Products.search_products);

  // =================================================================================
  // == ⚙️ ESTADO LOCAL DEL COMPONENTE ⚙️                                            ==
  // == Maneja los filtros específicos de esta página.                              ==
  // =================================================================================
  const [filtered, setFiltered] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '0',
    price_range: 'Any',
    sortBy: 'created',
    order: 'desc'
  });

  const { category_id, price_range, sortBy, order } = formData;


  // =================================================================================
  // == 🚀 EFECTOS SECUNDARIOS (useEffect) 🚀                                        ==
  // =================================================================================

  // Efecto para cargar las categorías, se ejecuta una sola vez.
  useEffect(() => {
    dispatch(get_categories());
    window.scrollTo(0,0);
    // 🧠 Limpiamos la bandera 'filtered' al montar, para evitar que muestre
    //    filtros de una visita anterior a la página.
    setFiltered(false);
  }, [dispatch]);


  // 🧠 ✨ ¡LA SOLUCIÓN DEFINITIVA ESTÁ AQUÍ! ✨ 🧠
  // Este `useEffect` "escucha" si `searched_products` cambia.
  // Si llega una nueva búsqueda del Navbar, ¡reseteamos el filtro de la página!
  useEffect(() => {
    if (searched_products) {
      setFiltered(false);
    }
  }, [searched_products]);


  // =================================================================================
  // == 🕹️ MANEJADORES DE EVENTOS 🕹️                                                 ==
  // =================================================================================
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    dispatch(get_filtered_products(category_id, price_range, sortBy, order));
    setFiltered(true);
  };


  // =================================================================================
  // == 💡 LÓGICA DE RENDERIZADO INTELIGENTE 💡                                       ==
  // == Esta función ahora decide correctamente qué productos mostrar.              ==
  // =================================================================================
  const showProducts = () => {
      let display = [];
      let currentProducts = null;

      // Prioridad 1: ¿Se activó el filtro de ESTA página? Muestra `filtered_products`.
      if (filtered && filtered_products) {
        currentProducts = filtered_products;
      }
      // Prioridad 2: Si no, ¿hay resultados de la búsqueda del NAVBAR? Muestra `searched_products`.
      else if (searched_products) {
        currentProducts = searched_products;
      }

      // Si tenemos una lista de productos, la preparamos para renderizar.
      if (currentProducts && currentProducts.length > 0) {
        currentProducts.forEach((product, index) => {
            display.push(<div key={index}><ProductCard product={product} /></div>);
        });
      }
      // Si no hay productos, mostramos un mensaje amigable.
      else {
          return <p>No se encontraron productos que coincidan con tu criterio.</p>
      }

      // Organizamos los productos en una grilla de 3 columnas.
      let results = [];
      for (let i = 0; i < display.length; i += 3) {
        results.push(
          <div key={i} className='grid md:grid-cols-3 gap-4'>
              {display[i] ? display[i] : <div className=''></div>}
              {display[i+1] ? display[i+1] : <div className=''></div>}
              {display[i+2] ? display[i+2] : <div className=''></div>}
          </div>
        )
      }
      return results;
    }


  // =================================================================================
  // == 🖼️ RENDERIZADO DEL COMPONENTE (JSX) 🖼️                                     ==
  // =================================================================================
  return (
    <Layout>
      <div className='2-column-contain-main'>
        {/* Columna Izquierda: Filtros */}
      <div className="shop">
        <h1>Resultados de tu Búsqueda</h1>
 
        {categories === null && <p>Cargando filtros...</p>}
        {Array.isArray(categories) && categories.length > 0 && (
          <>
            <h2>Filtra tus resultados:</h2>
          
              <form onSubmit={onSubmit}>
                <ul>
                    {/* ... Tu código para renderizar las categorías ... */}
                    {
                    categories.map(category =>{
                        if (category.sub_categories.length === 0){
                        return(
                        <div key={category.id} className='flex items-center h-5 my-5'>
                            <input
                            onChange={e => onChange(e)}
                            value={category.id.toString()}
                            name='category_id'
                            type='radio'
                            className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300'
                            />
                            <label className='ml-3 min-w-0 flex-1 text-gray-500'>
                            {category.name}
                            </label>
                        </div>
                        )
                        } else{
                        let result = []
                        result.push(
                            <div key={category.id} className='flex items-center h-5 my-5'>
                            <input
                                onChange={e => onChange(e)}
                                value={category.id.toString()}
                                name='category_id'
                                type='radio'
                                className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300'
                            />
                            <label className='ml-3 min-w-0 flex-1 text-gray-500'>
                                {category.name}
                            </label>
                            </div>
                        )
                        category.sub_categories.forEach(sub_category =>{
                            result.push(
                            <div key={sub_category.id} className='flex items-center h-5 my-5 ml-5'>
                                <input
                                onChange={e => onChange(e)}
                                value={sub_category.id.toString()}
                                name='category_id'
                                type='radio'
                                className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300'
                                />
                                <label className='ml-3 min-w-0 flex-1 text-gray-500'>
                                {sub_category.name}
                                </label>
                            </div>
                            )
                        });
                        return result
                        }
                    })
                    }
                </ul>

                {/* ... Tu código para los Disclosures (precios y otros filtros) ... */}
                <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                    {({ open }) => (
                        <>
                        <h3 className="-mx-2 -my-3 flow-root">
                        <DisclosureButton className="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                            <span className="font-sofiapro-regular text-gray-900">Prices</span>
                            <span className="ml-6 flex items-center">
                            {open ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                            </span>
                        </DisclosureButton>
                        <DisclosurePanel className="pt-6">
                            <div className="space-y-6">
                            {
                                prices && prices.map((price, index) => {
                                    if (price.id === 0) {
                                        return (
                                            <div key={index} className='form-check'>
                                                <input
                                                    onChange={e => onChange(e)}
                                                    value={price.name}
                                                    name='price_range'
                                                    type='radio'
                                                    className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded-full'
                                                    defaultChecked
                                                />
                                                <label className='ml-3 min-w-0 flex-1 text-gray-500 font-sofiapro-light'>{price.name}</label>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className='form-check'>
                                                <input
                                                    onChange={e => onChange(e)}
                                                    value={price.name}
                                                    name='price_range'
                                                    type='radio'
                                                    className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded-full'
                                                />
                                                <label className='ml-3 min-w-0 flex-1 text-gray-500 font-sofiapro-light'>{price.name}</label>
                                            </div>
                                        )
                                    }
                                })
                            }
                            </div>
                            </DisclosurePanel>
                        </h3>
                        </>
                    )}
                    </Disclosure>

                    <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                    {({ open }) => (
                        <>
                        <h3 className="-mx-2 -my-3 flow-root">
                        <DisclosureButton className="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                            <span className="font-sofiapro-regular text-gray-900">Mas Filtros</span>
                            <span className="ml-6 flex items-center">
                            {open ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                            )}
                            </span>
                        </DisclosureButton>
                        <DisclosurePanel className="pt-6">
                            <div className="space-y-6">
                            <div className='form-group '>
                                <label htmlFor='sortBy' className='mr-3 min-w-0 flex-1 text-gray-500'
                                >Ver por</label>
                                    <select
                                        className='my-2 font-sofiapro-light inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500'
                                        id='sortBy'
                                        name='sortBy'
                                        onChange={e => onChange(e)}
                                        value={sortBy}
                                    >
                                    <option value='date_created'>Fecha</option>
                                    <option value='price'>Precio</option>
                                    <option value='sold'>Sold</option>
                                    <option value='title'>Nombre</option>
                                    </select>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='order' className='mr-3 min-w-0 flex-1 text-gray-500'
                                >Orden</label>
                                <select
                                    className='my-2 font-sofiapro-light inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500'
                                    id='order'
                                    name='order'
                                    onChange={e => onChange(e)}
                                    value={order}
                                >
                                    <option value='asc'>A - Z</option>
                                    <option value='desc'>Z - A</option>
                                </select>
                            </div>
                            </div>
                        </DisclosurePanel>
                        </h3>
                        </>
                    )}
                    </Disclosure>
                
                <button
                    type="submit"
                    className="float-right inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Aplicar Filtros
                </button>
              </form>
          </>
        )}
      </div>

      {/* Columna Derecha: Resultados */}
      <div className="bg-white">
        

        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
    {
        // Si el usuario aplicó un filtro EN ESTA PÁGINA, muestra "Resultados filtrados".
        filtered
        ? "Resultados filtrados"
        // Si no, y si hay productos de la búsqueda del NAVBAR, muestra "Productos encontrados".
        : (searched_products && searched_products.length > 0)
        ? `Productos encontrados (${searched_products.length})`
        // Si no se cumple nada (por ejemplo, al entrar a /search directamente), muestra un texto por defecto.
        : "No hay resultados para mostrar"
    }
    </h2>
    <div className="mt-6">
        {showProducts()}
    </div>
</div>
        </div>
    </div>
    </Layout>
  );
}

// ✅ Y finalmente, exportamos tu componente "Search" correctamente.
export default Search;