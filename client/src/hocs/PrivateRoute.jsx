import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Usamos useSelector para obtener el estado de autenticación directamente del store
  const { isAuthenticated, loading } = useSelector(state => state.Auth);

  // Opcional: Si aún está cargando, puedes mostrar un spinner o un mensaje
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, lo redirigimos a la página de login
  // 'replace' evita que el usuario pueda volver a la ruta anterior con el botón de "atrás"
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el componente hijo (la ruta anidada)
  return <Outlet />;
};

export default PrivateRoute;