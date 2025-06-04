import Layout from '../../hocs/Layout';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get_categories } from '../../redux/actions/categories'; // Asegúrate que la ruta sea correcta

const Shop = () => {
  const dispatch = useDispatch();

  // Selecciona las categorías del estado de Redux
  // categories será 'null' inicialmente, luego el array de categorías o 'null' si falla
  const categories = useSelector(state => state.Categories.categories);
  // También podrías querer un estado de carga
  const loading = useSelector(state => state.Categories.loading); // Si añades 'loading' al reducer

  useEffect(() => {
    console.log("Despachando get_categories"); // Para depurar
    dispatch(get_categories());
  }, [dispatch]);

  console.log("Categorías en el componente:", categories); // Para depurar

  return (
    <Layout>
      <div className="shop">
        <h1>Shop</h1>
        <p>Welcome to the shop page!</p>

        {/* {loading && <p>Cargando categorías...</p>} */}
        {/* Si no tienes 'loading', puedes usar categories === null */}
        {categories === null && <p>Cargando categorías...</p>}

{/*Array.isArray(categories):  Esta función de JavaScript verifica si la variable categories es realmente un array (arreglo). Devuelve true si lo es, y false si no lo es (por ejemplo, si es null, undefined, un objeto, un número, un string, etc.). */}
        {Array.isArray(categories) && categories.length > 0 && (
          <>
            <h2>Categorías Cargadas:</h2>
            <ul>
            {
              categories &&
              categories !== null &&
              categories !== undefined &&
              categories.map(category =>{
                if (category.sub_categories.length === 0){
                  return(
                   <div key={category.id} className='flex items-center h-5 my-5'>
                    <input
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
                        name='category_id'
                        type='radio'
                        className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300'
                      />
                      <label className='ml-3 min-w-0 flex-1 text-gray-500'>
                        {category.name}
                      </label>
                    </div>
                  )
                  category.sub_categories.map(sub_category =>{
                    result.push(
                      <div key={sub_category.id} className='flex items-center h-5 my-5 ml-5'>
                        <input
                          name='category_id'
                          type='radio'
                          className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300'
                        />
                        <label className='ml-3 min-w-0 flex-1 text-gray-500'>
                          {sub_category.name}
                        </label>
                      </div>
                    )
                  })
                  return result
                }
              })
            }
            </ul>
          </>
        )}

        {Array.isArray(categories) && categories.length === 0 && (
          <p>No hay categorías para mostrar.</p>
        )}

        {/* Si quieres mostrar un error específico si la carga falla y no es solo 'null' */}
        {/* Podrías añadir un 'error' al estado de Redux si categories es null y no estás cargando */}

      </div>
    </Layout>
  );
}

export default Shop;