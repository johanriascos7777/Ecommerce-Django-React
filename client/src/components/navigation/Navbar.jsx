import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/Alert';
import { useSelector } from 'react-redux';
import { MdArrowDropDown, MdPerson, MdExitToApp } from 'react-icons/md'; // Iconos de Material Design

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = useSelector(state => state.Auth.isAuthenticated);
    const user = useSelector(state => state.Auth.user);

    // Menú con iconos
    const authLinks = (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                <MdPerson className="text-xl" />
                {user?.name || 'Usuario'}
                <MdArrowDropDown className="text-xl" />
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
                        <button
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

    // Enlaces con Fragment
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
                    {/* Elementos de navegación */}
                    <div className="flex gap-6 text-white">
                        <span>Elemento 1</span>
                        <span>Elemento 2</span>
                        <span>Elemento 3</span>
                        <span>Elemento 4</span>
                    </div>

                    {/* Bloque de autenticación */}
                    <div className="flex gap-4">
                        {isAuthenticated ? authLinks : guestLinks}
                    </div>
                </div>
            </div>
            <Alert/>
        </Fragment>
    );
};