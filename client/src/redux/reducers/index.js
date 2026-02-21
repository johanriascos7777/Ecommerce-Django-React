import { combineReducers } from "redux";
import Auth from './auth'
import Alert from './alert'
import Categories from './categories'
import Products from './products'
import Cart from "./cart";
import Shipping from './shipping';
import Payment from './payment';      // ❌ faltaba
import Orders from './orders';        // ❌ faltaba
import Coupons from './coupons';      // ❌ faltaba
import Profile from './profile';      // ❌ faltaba
import Wishlist from './wishlist';    // ❌ faltaba
import Reviews from './reviews';      // ❌ faltaba


export default combineReducers({
    Auth,
    Alert,
    Categories,
    Products,
    Cart,
    Shipping,
    Payment,
    Orders,
    Coupons,
    Profile,
    Wishlist,
    Reviews
})