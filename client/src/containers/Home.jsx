// Fichero: src/pages/Home.js

/*

En el código antiguo, el componente Home era "tonto". No sabía nada sobre Redux. Simplemente recibía un montón de props y las usaba. La "magia" ocurría fuera, en la función connect, que era la encargada de inyectar esas props.

En el código nuevo, el componente Home es "inteligente". Ya no espera recibir nada. En su lugar, usa sus propias herramientas (los hooks) para comunicarse directamente con el store de Redux y obtener lo que necesita.

*/

// --- IMPORTS ---
import Layout from "../hocs/Layout";
import { useEffect } from "react";
import Banner from '../components/home/Banner'
import ProductsArrival from '../components/home/ProductsArrival';
import ProductsSold from '../components/home/ProductsSold';
import { 
    get_products_by_arrival, 
    get_products_by_sold 
} from '../redux/actions/products';

// NUEVO: Importamos los hooks que necesitamos de 'react-redux'.
// Estos dos hooks son el reemplazo moderno para el HOC (Higher-Order Component) `connect`.
import { useSelector, useDispatch } from 'react-redux';

// NUEVO: El componente ya no recibe props inyectadas por Redux. Su firma es más simple
// porque toda la interacción con Redux se manejará adentro con hooks.
const Home = () => {

    // NUEVO: Obtenemos la función `dispatch`. Este hook hace la función de lo que
    // antes hacía `connect` al recibir un objeto de acciones: envolverlas para poder
    // despacharlas. Ahora, controlamos el despacho de forma explícita.
    const dispatch = useDispatch();

    // NUEVO: Usamos `useSelector` para extraer datos del estado.
    // Este hook reemplaza directamente la función `mapStateToProps` del código antiguo.
    // Su trabajo es tomar el estado global y devolver la pieza de datos que este componente necesita.
    const products_arrival = useSelector(state => state.Products.products_arrival);
    const products_sold = useSelector(state => state.Products.products_sold);

    useEffect(() => {
        window.scrollTo(0, 0);

        // NUEVO: Para ejecutar una acción, la "despachamos" explícitamente.
        // En el código antiguo, llamábamos a `get_products_by_arrival()` como si fuera una prop.
        // Ahora, la envolvemos en `dispatch()` para dejar claro que estamos iniciando un
        // cambio en el estado global de Redux.
        dispatch(get_products_by_arrival());
        dispatch(get_products_by_sold());

    // NUEVO: Incluimos `dispatch` en el array de dependencias. Es una buena práctica
    // y React-Redux garantiza que la identidad de `dispatch` es estable, por lo que
    // no causará re-renders innecesarios.
    }, [dispatch]);

    return(
        <Layout>
            <div className="text-blue-500">
               <Banner/>
                {/* El JSX no cambia, pero ahora es 100% claro de dónde vienen los datos,
                    ya que `products_arrival` y `products_sold` están definidos unas líneas
                    más arriba dentro del mismo componente. */}
                <ProductsArrival data={products_arrival}/>
                <ProductsSold data={products_sold}/>
            </div>
        </Layout>
    )
}

// NUEVO: Exportamos el componente directamente.
// Todo el código `export default connect(mapStateToProps, { ... })(Home)` del
// final del archivo antiguo ha sido eliminado por completo.
export default Home;


