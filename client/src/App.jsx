import { Routes, Route } from "react-router-dom";
import Home from "./containers/Home";
import Error404 from "./containers/errors/Error404";
import Signup from "./containers/auth/Signup";
import Login from "./containers/auth/Login"
import Activate from "./containers/auth/Activate"
import Reset_Password from "./containers/auth/ResetPassword";
import Reset_Password_Confirm from "./containers/auth/ResetPasswordConfirm";
import Shop from "./containers/Shop";
import ProductDetail from "./containers/pages/productDetail";
import Search from "./containers/pages/Search";
import Cart from "./containers/pages/Cart";
import Checkout from "./containers/pages/Checkout";
import PrivateRoute from "./hocs/PrivateRoute";

import ThankYou from "./containers/pages/ThankYou";
import Dashboard from "./containers/pages/Dashboard";
import DashboardPayments from "./containers/pages/DashboardPayments";
import DashboardPaymentDetail from "./containers/pages/DashboardPaymentDetail";
import DashboardProfile from "./containers/pages/DashboardProfile";

function App() {


 {/* TESTING PUSH GITHUB OTHER COMPUTER*/}
  return (
    <div className='text-blue-700'>
 

    <Routes>
       {/* ERROR DISPLAY */}
    <Route path="*" element={<Error404 />} />
    
        {/* HOME */}
        <Route path="/" element={<Home/>} />

        {/* CART */}
        <Route path="/cart" element={<Cart />} />
      


        {/* AUTHENTICATION */}
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/activate/:uid/:token" element={<Activate/>} />
        <Route path="/reset_password" element={<Reset_Password/>} />
        <Route path="/password/reset/confirm/:uid/:token" element={<Reset_Password_Confirm/>} />
        
         <Route path="/shop" element={<Shop/>} />
         <Route path="/product/:productId" element={<ProductDetail/>} />
          <Route path="/search" element={<Search/>} />

        {/* ================================================================= */}
        {/* ====================== RUTAS PROTEGIDAS ========================= */}
        {/* ================================================================= */}
   
        <Route element={<PrivateRoute />}>
          <Route path="/checkout" element={<Checkout />} />
   
        </Route>
                  <Route exact path='/thankyou' element={<ThankYou/>}/>
          
          <Route exact path='/dashboard' element={<Dashboard/>}/>
          <Route exact path='/dashboard/payments' element={<DashboardPayments/>}/>
          <Route exact path='/dashboard/payment/:transaction_id' element={<DashboardPaymentDetail/>}/>
          <Route exact path='/dashboard/profile' element={<DashboardProfile/>}/>
      </Routes>


    </div>
  )
}

export default App
