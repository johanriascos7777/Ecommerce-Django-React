import { Routes, Route } from "react-router-dom";
import Home from "./containers/Home";
import Error404 from "./containers/errors/Error404";
import Signup from "./containers/auth/Signup";
import Login from "./containers/auth/Login"
import Activate from "./containers/auth/Activate"

function App() {



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
     
      </Routes>


    </div>
  )
}

export default App
