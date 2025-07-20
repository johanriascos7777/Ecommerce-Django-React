import Layout from '../hocs/Layout';
import { Disclosure,  DisclosureButton,DisclosurePanel } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get_categories } from '../redux/actions/categories';
import { get_products, get_filtered_products } from '../redux/actions/products';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { prices } from '../helpers/fixedPrices';

const Shop = () => {
  const dispatch = useDispatch();

  // ✨✨✨ CAMBIO 1: Agregar selector para search_products ✨✨✨
  const categories = useSelector(state => state.Categories.categories);
  const products = useSelector(state => state.Products.products);
  const filtered_products = useSelector(state => state.Products.filtered_products);
  const searched_products = useSelector(state => state.Products.search_products); // Nuevo selector

  const [filtered, setFiltered] = useState(false);
  const [formData, setFormData] = useState({
    category_id: '0',
    price_range: 'Any',
    sortBy: 'created',
    order: 'desc'
  });

  const { 
    category_id,
    price_range,
    sortBy,
    order
  } = formData;

  useEffect(() => {
    dispatch(get_categories());
    dispatch(get_products());
    window.scrollTo(0,0);
  }, [dispatch]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value});

  // ✨✨✨ CAMBIO 2: Función showProducts actualizada ✨✨✨
  const showProducts = () => {
    let results = [];
    let display = [];

    // Prioridad 1: Productos filtrados localmente
    if (filtered && filtered_products) {
      filtered_products.forEach((product, index) => {
        display.push(
          <div key={index}>
            <ProductCard product={product} />
          </div>
        );
      });
    } 
    // Prioridad 2: Resultados de búsqueda
    else if (searched_products && searched_products.length > 0) {
      searched_products.forEach((product, index) => {
        display.push(
          <div key={index}>
            <ProductCard product={product} />
          </div>
        );
      });
    }
    // Prioridad 3: Todos los productos
    else if (products) {
      products.forEach((product, index) => {
        display.push(
          <div key={index}>
            <ProductCard product={product} />
          </div>
        );
      });
    } else {
      return <p>No se encontraron productos.</p>;
    }

    for (let i = 0; i < display.length; i += 3) {
      results.push(
        <div key={i} className='grid md:grid-cols-3 gap-4'>
          {display[i] ? display[i] : <div className=''></div>}
          {display[i+1] ? display[i+1] : <div className=''></div>}
          {display[i+2] ? display[i+2] : <div className=''></div>}
        </div>
      );
    }

    return results;
  };

  return (
    <Layout>
      <div className='2-column-contain-main'>
        {/* Columna izquierda */}
        <div className="shop">
          <h1>Shop</h1>
          <p>Welcome to the shop page!</p>

          {categories === null && <p>Cargando categorías...</p>}

          {Array.isArray(categories) && categories.length > 0 && (
            <>
              <h2>Categorías Cargadas:</h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  dispatch(get_filtered_products(category_id, price_range, sortBy, order));
                  setFiltered(true);
                }}
              >
                <ul>
                  {categories.map(category => {
                    if (category.sub_categories.length === 0) {
                      return (
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
                      );
                    } else {
                      let result = [];
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
                      );
                      category.sub_categories.forEach(sub_category => {
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
                        );
                      });
                      return result;
                    }
                  })}
                </ul>

                {/* Precios */}
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
                            {prices.map((price, index) => (
                              <div key={index} className='form-check'>
                                <input
                                  onChange={e => onChange(e)}
                                  value={price.name}
                                  name='price_range'
                                  type='radio'
                                  className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded-full'
                                  defaultChecked={price.id === 0}
                                />
                                <label className='ml-3 min-w-0 flex-1 text-gray-500 font-sofiapro-light'>
                                  {price.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </h3>
                    </>
                  )}
                </Disclosure>

                {/* Más filtros */}
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
                              <label htmlFor='sortBy' className='mr-3 min-w-0 flex-1 text-gray-500'>
                                Ver por
                              </label>
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
                              <label htmlFor='order' className='mr-3 min-w-0 flex-1 text-gray-500'>
                                Orden
                              </label>
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
                  Buscar
                </button>
              </form>
            </>
          )}

          {Array.isArray(categories) && categories.length === 0 && (
            <p>No hay categorías para mostrar.</p>
          )}
        </div>

        {/* Columna derecha */}
        <div className="bg-white">
          <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Customers also purchased</h2>
            <div className="mt-6">
              {products && showProducts()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Shop;