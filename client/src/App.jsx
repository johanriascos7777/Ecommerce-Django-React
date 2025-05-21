import { Routes, Route } from "react-router-dom";
import Home from "./containers/Home";
import Error404 from "./containers/errors/Error404";
import Signup from "./containers/auth/Signup";
import Login from "./containers/auth/Login"
import Activate from "./containers/auth/Activate"
import Reset_Password from "./containers/auth/ResetPassword";
import Reset_Password_Confirm from "./containers/auth/ResetPasswordConfirm";

function App() {


 {/* TESTING PUSH GITHUB OTHER COMPUTER*/}
  return (
    <div className='text-blue-700'>
 

    <Routes>
       {/* ERROR DISPLAY */}
    <Route path="*" element={<Error404 />} />
    
        {/* HOME */}
        <Route path="/" element={<Home/>} />

        {/* AUTHENTICATION */}
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/activate/:uid/:token" element={<Activate/>} />
        <Route path="/reset_password" element={<Reset_Password/>} />
        <Route path="/password/reset/confirm/:uid/:token" element={<Reset_Password_Confirm/>} />
     
      </Routes>


    </div>
  )
}

export default App
