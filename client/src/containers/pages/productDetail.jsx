import Layout from "../../hocs/Layout";
import { Oval } from "react-loader-spinner";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from "react-router";
import { useEffect, useState } from "react";

// Acciones de productos
import { get_product, get_related_products } from "../../redux/actions/products";

// Acciones del carrito
import { get_items, add_item, get_total, get_item_total } from "../../redux/actions/cart";

// ✅ Acciones de wishlist — agregadas del tutorial
import {
    add_wishlist_item,
    get_wishlist_items,
    get_wishlist_item_total,
    remove_wishlist_item
} from '../../redux/actions/wishlist';

// ✅ Acciones de reseñas — agregadas del tutorial
import {
    get_reviews,
    get_review,
    create_review,
    update_review,
    delete_review,
    filter_reviews
} from '../../redux/actions/reviews';

// Componentes
import ImageGallery from "../../components/product/ImageGallery";
import WishlistHeart from "../../components/product/WishlistHeart";  // ✅ agregado del tutorial
import Stars from '../../components/product/Stars';                  // ✅ agregado del tutorial


const ProductDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // Estado del formulario de reseñas
    const [formData, setFormData] = useState({
        comment: '',
        rating: '',
    });
    const { comment, rating } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


    // ─── ESTADO GLOBAL ────────────────────────────────────────────────────────

    // Con useSelector, accedemos al estado de 'product' desde el store de Redux.
    // La estructura state.Products.product depende de cómo hayas configurado tu reducer.
    const product = useSelector(state => state.Products.product);

    // ✅ Autenticación — necesaria para wishlist y reseñas
    const isAuthenticated = useSelector(state => state.Auth.isAuthenticated);

    // ✅ Wishlist — lista de items guardados por el usuario
    const wishlist = useSelector(state => state.Wishlist.wishlist);

    // ✅ Reseñas — review es la reseña del usuario actual, reviews es la lista completa
    const review = useSelector(state => state.Reviews.review);
    const reviews = useSelector(state => state.Reviews.reviews);


    // ─── PARAMS ───────────────────────────────────────────────────────────────
    const params = useParams();
    const productId = params.productId;

    // --- console.log para debug (puedes eliminarlo en producción) ---
    console.log('Datos del producto en Detail:', product);
    // -----------------------------------------------------------------


    // ─── EFECTOS ──────────────────────────────────────────────────────────────
    useEffect(() => {
        // Despachamos las acciones para obtener los datos del producto
        window.scrollTo(0, 0);
        if (productId) {
            dispatch(get_product(productId));
            dispatch(get_related_products(productId));
            // ✅ Cargamos los items de la wishlist al montar
            dispatch(get_wishlist_items());
            dispatch(get_wishlist_item_total());
        }
    }, [dispatch, productId]);

    // ✅ Cargamos las reseñas cuando cambia el productId
    useEffect(() => {
        dispatch(get_reviews(productId));
    }, [productId]);

    // ✅ Cargamos la reseña del usuario actual cuando cambia el productId
    useEffect(() => {
        dispatch(get_review(productId));
    }, [productId]);


    // ─── HANDLERS ─────────────────────────────────────────────────────────────

    // Agregar producto al carrito
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
    };

    // ✅ Agregar o quitar de la wishlist según si ya está presente
    const addToWishlist = async () => {
        if (isAuthenticated) {
            let isPresent = false;

            if (
                wishlist && wishlist !== null && wishlist !== undefined &&
                product && product !== null && product !== undefined
            ) {
                wishlist.map(item => {
                    if (item.product.id.toString() === product.id.toString()) {
                        isPresent = true;
                    }
                });
            }

            if (isPresent) {
                // Si ya está en wishlist, lo quitamos
                await dispatch(remove_wishlist_item(product.id));
                await dispatch(get_wishlist_items());
                await dispatch(get_wishlist_item_total());
            } else {
                // Si no está, lo agregamos
                await dispatch(remove_wishlist_item(product.id));
                await dispatch(add_wishlist_item(product.id));
                await dispatch(get_wishlist_items());
                await dispatch(get_wishlist_item_total());
                await dispatch(get_items());
                await dispatch(get_total());
                await dispatch(get_item_total());
            }
        } else {
            return <Navigate to="/cart" />;
        }
    };

    // ✅ Crear una nueva reseña
    const leaveReview = e => {
        e.preventDefault();
        if (rating !== null)
            dispatch(create_review(productId, rating, comment));
    };

    // ✅ Actualizar la reseña existente del usuario
    const updateReview = e => {
        e.preventDefault();
        if (rating !== null)
            dispatch(update_review(productId, rating, comment));
    };

    // ✅ Eliminar la reseña del usuario
    const deleteReview = () => {
        const fetchData = async () => {
            await dispatch(delete_review(productId));
            await dispatch(get_review(productId));
            setFormData({ comment: '' });
        };
        fetchData();
    };

    // ✅ Filtrar reseñas por número de estrellas
    const filterReviews = numStars => {
        dispatch(filter_reviews(productId, numStars));
    };

    // ✅ Volver a mostrar todas las reseñas
    const getReviews = () => {
        dispatch(get_reviews(productId));
    };


    // ─── RENDER ───────────────────────────────────────────────────────────────
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
                                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                        {product.name}
                                    </h1>

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

                                    {/* ✅ Selector de color — del tutorial */}
                                    <div className="mt-6">
                                        <div>
                                            <h3 className="text-sm text-gray-600">Color</h3>
                                            <fieldset className="mt-2">
                                                <legend className="sr-only">Choose a color</legend>
                                                <div className="flex items-center space-x-3">
                                                    <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-700">
                                                        <input type="radio" name="color-choice" value="Washed Black" className="sr-only" />
                                                        <span aria-hidden="true" className="h-8 w-8 bg-gray-700 border border-black border-opacity-10 rounded-full"></span>
                                                    </label>
                                                    <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-400">
                                                        <input type="radio" name="color-choice" value="White" className="sr-only" />
                                                        <span aria-hidden="true" className="h-8 w-8 bg-white border border-black border-opacity-10 rounded-full"></span>
                                                    </label>
                                                    <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-500">
                                                        <input type="radio" name="color-choice" value="Washed Gray" className="sr-only" />
                                                        <span aria-hidden="true" className="h-8 w-8 bg-gray-500 border border-black border-opacity-10 rounded-full"></span>
                                                    </label>
                                                </div>
                                            </fieldset>
                                        </div>

                                        {/* Lógica para mostrar si hay stock */}
                                        <p className="mt-4">
                                            {product && product !== null && product !== undefined && product.quantity > 0 ? (
                                                <span className='text-green-500'>In Stock</span>
                                            ) : (
                                                <span className='text-red-500'>Out of Stock</span>
                                            )}
                                        </p>

                                        {/* Botones: Agregar al carrito + Wishlist */}
                                        <div className="mt-4 flex sm:flex-col1">
                                            {loading ? (
                                                <button className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white">
                                                    <Oval
                                                        height={20}
                                                        width={20}
                                                        color="#fff"
                                                        visible={true}
                                                        ariaLabel='oval-loading'
                                                        secondaryColor="#eee"
                                                        strokeWidth={3}
                                                        strokeWidthSecondary={3}
                                                    />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={addToCart}
                                                    className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                                                >
                                                    Agregar al Carrito
                                                </button>
                                            )}

                                            {/* ✅ Botón de wishlist (corazón) */}
                                            <WishlistHeart
                                                product={product}
                                                wishlist={wishlist}
                                                addToWishlist={addToWishlist}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ✅ Sección de reseñas — agregada del tutorial */}
                        <section className='my-5 max-w-7xl'>
                            <div className="grid grid-cols-5">

                                {/* Columna izquierda: filtros por estrellas + formulario de reseña */}
                                <div className="col-span-2">
                                    <div>
                                        {/* Botón para mostrar todas las reseñas */}
                                        <button
                                            className='btn btn-primary btn-sm mb-3 ml-6 mt-2'
                                            onClick={getReviews}
                                        >
                                            Mostrar todas
                                        </button>

                                        {/* Filtros por cantidad de estrellas */}
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <div
                                                key={star}
                                                className='mb-1'
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => filterReviews(star)}
                                            >
                                                <Stars rating={star} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Formulario: Update si ya tiene reseña, Add si no tiene */}
                                    {review && isAuthenticated ? (
                                        <form onSubmit={e => updateReview(e)}>
                                            <div>
                                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                                                    Update your review
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        rows={4}
                                                        name="comment"
                                                        id="comment"
                                                        required
                                                        value={comment}
                                                        onChange={e => onChange(e)}
                                                        placeholder={review.comment}
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        defaultValue={''}
                                                    />
                                                </div>
                                            </div>
                                            <select
                                                name="rating"
                                                className="mt-4 float-right"
                                                required
                                                value={rating}
                                                onChange={e => onChange(e)}
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                            <button
                                                type="submit"
                                                className="mt-4 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Update
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={e => leaveReview(e)}>
                                            <div>
                                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                                                    Add your review
                                                </label>
                                                <div className="mt-1">
                                                    <textarea
                                                        rows={4}
                                                        name="comment"
                                                        id="comment"
                                                        required
                                                        value={comment}
                                                        onChange={e => onChange(e)}
                                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        defaultValue={''}
                                                    />
                                                </div>
                                            </div>
                                            <select
                                                name="rating"
                                                className="mt-4 float-right"
                                                required
                                                value={rating}
                                                onChange={e => onChange(e)}
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                            <button
                                                type="submit"
                                                className="mt-4 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Add
                                            </button>
                                        </form>
                                    )}
                                </div>

                                {/* Columna derecha: lista de reseñas */}
                                <div className="col-span-3">
                                    {reviews && reviews.map((review, index) => (
                                        <div key={index} className="flex mb-4">
                                            <div className="mx-4 flex-shrink-0">
                                                <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </span>
                                            </div>
                                            <div>
                                                <Stars rating={review.rating} />
                                                <h4 className="text-lg font-bold">{review.user}</h4>
                                                <p className="mt-1">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetail;