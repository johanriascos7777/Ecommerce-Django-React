import React, { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import { useSelector } from 'react-redux';
import { MdArrowDropDown, MdPerson, MdExitToApp } from 'react-icons/md';
import { logout } from '../../redux/actions/auth';
import { useDispatch } from 'react-redux';

export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = useSelector(state => state.Auth.isAuthenticated);
    const user = useSelector(state => state.Auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/'); // Redirección correcta usando hook
        setIsOpen(false); // Cierra el menú desplegable
    }

    // Menú autenticado
    const authLinks = (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                    <svg 
                        className="h-full w-full text-gray-300" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </span>
                
                <span className="text-black">
                    {user?.name || 'Usuario'}
                </span>
                <MdArrowDropDown className="text-xl text-black" />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md min-w-[160px]">
                    <div className="py-1">
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        >
                            <MdPerson />
                            Perfil
                        </Link>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                            <MdExitToApp />
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // Enlaces para invitados
    const guestLinks = (
        <Fragment>
            <Link 
                to="/login" 
                className="flex items-center gap-1 text-white hover:text-gray-200"
            >
                <MdPerson />
                Ingresar
            </Link>
            <Link 
                to="/signup" 
                className="flex items-center gap-1 text-white hover:text-gray-200"
            >
                <MdExitToApp />
                Registrarse
            </Link>
        </Fragment>
    );

    return (
        <Fragment>
            <div className='w-full bg-slate-600 p-4'>
                <div className="flex justify-between items-center max-w-6xl mx-auto">
                    <div className="flex gap-6 text-white">
                        <span>Elemento 1</span>
                        <span>Elemento 2</span>
                        <span>Elemento 3</span>
                        <span>Elemento 4</span>
                    </div>

                    <div className="flex gap-4">
                        {isAuthenticated ? authLinks : guestLinks}
                    </div>
                </div>
            </div>
            <Alert/>
        </Fragment>
    );
};