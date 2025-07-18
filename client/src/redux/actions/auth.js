import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    LOGOUT,

} from './types';

import axios from 'axios';
import { setAlert } from './alert';


export const check_authenticated = () => async dispatch => {
    if(localStorage.getItem('access')){
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({
            token: localStorage.getItem('access')
        });

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/verify/`, body, config);

            if (res.status === 200) {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch(err){
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }
    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
}




export const signup = (first_name, last_name, email, password, re_password) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    })

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ first_name, last_name, email, password, re_password });

    try {
        console.log('Enviando datos de registro:', body);

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/users/`, body, config);

        console.log('Respuesta del servidor:', res);

        if (res.status === 201) {
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: res.data
                //si hacemos console.log a res, podemos ver la cantidad de datos que trae, en este caso queremoos data
            });
            dispatch(setAlert('Te enviamos un correo, por favor activa tu cuenta. Revisa el correo de spam', 'green'));
            console.log('Registro exitoso:', res.data);
        } else {
            dispatch({
                type: SIGNUP_FAIL
            });
            dispatch(setAlert('Error al crear la cuenta', 'red'));

            console.log('Registro fallido con estado:', res.status);
        }
        dispatch({
            type: REMOVE_AUTH_LOADING
        })

    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        })
        dispatch(setAlert('Error conectando con el servidor, intenta mas tarde.', 'red'));
        console.log('Error en la solicitud de registro:', err);
    }
};



export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
             "Authorization": `Bearer ${localStorage.getItem('access')}`, // Se escribe Bearer y no JWT 
                "accept": "application/json"
            }
        };



        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users/me/`, config);
            if (res.status === 200) {
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: USER_LOADED_FAIL
                });
            }
        }
        catch (err) {
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
}





export const login = (email, password) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    })
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        email,
        password
    });

    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/create/`, body, config);

        if (res.status === 200) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
            dispatch(load_user()); //Esta función se encarga de cargar los datos del usuario. ¡Pero se agrega luego de hacer creado el action load_user!

            dispatch({
                type: REMOVE_AUTH_LOADING
            })

            dispatch(setAlert('Inicio de sesion con exito', 'green'));

        } else {
            dispatch({
                type: LOGIN_FAIL
            });

            dispatch({
                type: REMOVE_AUTH_LOADING
            })

            dispatch(setAlert('Error al iniciar sesion', 'red'));
        }


    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        })
        dispatch(setAlert('Error al iniciar, intenta mas tarde.', 'red'));
        console.log('Error en la solicitud de inicio de sesion:', err);
    } // Aquí se cerró el 'catch' y el 'try' correctamente.
}


export const activate = (uid, token) => async dispatch => {

    dispatch({
        type: SET_AUTH_LOADING
    })

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        uid,
        token
    });

    try {

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/users/activation/`, body, config);

        if (res.status === 204) {
            dispatch({
                type: ACTIVATION_SUCCESS
            });
            dispatch(setAlert('Cuenta activada correctamente', 'green'));
        } else {
            dispatch({
                type: ACTIVATION_FAIL
            });
            dispatch(setAlert('Error al activar la cuenta', 'red'));
        }
        dispatch({
            type: REMOVE_AUTH_LOADING

        })
    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        })
        dispatch(setAlert('Error conectando con el servidor, intenta mas tarde.', 'red'));
    }
}

export const refresh = () => async dispatch => {
    if (localStorage.getItem('refresh')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({
            refresh: localStorage.getItem('refresh')
        });

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/jwt/refresh/`, body, config);
            
            if (res.status === 200) {
                dispatch({
                    type: REFRESH_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: REFRESH_FAIL
                });
            }
        }catch(err){
            dispatch({
                type: REFRESH_FAIL
            });
        }
    } else {
        dispatch({
            type: REFRESH_FAIL
        });
    }
}

export const reset_password = (email) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try{
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/users/reset_password/`, body, config);
        
        if (res.status === 204) {
            dispatch({
                type: RESET_PASSWORD_SUCCESS
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            dispatch(setAlert('Password reset email sent', 'green'));
        } else {
            dispatch({
                type: RESET_PASSWORD_FAIL
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            dispatch(setAlert('Error sending password reset email', 'red'));
        }
    }
    catch(err){
        dispatch({
            type: RESET_PASSWORD_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Error sending password reset email', 'red'));
    }
}

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    dispatch({
      type: SET_AUTH_LOADING
    });
  
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    // Verificamos si las contraseñas coinciden primero
    if (new_password !== re_new_password) {
      dispatch({
        type: RESET_PASSWORD_CONFIRM_FAIL
      });
      dispatch({
        type: REMOVE_AUTH_LOADING
      });
      dispatch(setAlert('Passwords do not match', 'red'));
    } else {
      // Si las contraseñas coinciden, construimos el cuerpo de la petición
      const body = JSON.stringify({
        uid,
        token,
        new_password,
        re_new_password
      });
  
      try {
        // Ahora sí, hacemos la petición POST al endpoint de confirmación de reseteo de contraseña
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/users/reset_password_confirm/`, body, config);
  
        if (res.status === 204) {
          dispatch({
            type: RESET_PASSWORD_CONFIRM_SUCCESS
          });
          dispatch({
            type: REMOVE_AUTH_LOADING
          });
          dispatch(setAlert('Password has been reset successfully', 'green'));
        } else {
          dispatch({
            type: RESET_PASSWORD_CONFIRM_FAIL
          });
          dispatch({
            type: REMOVE_AUTH_LOADING
          });
          dispatch(setAlert('Error resetting your password', 'red'));
        }
      } catch(err){
        dispatch({
          type: RESET_PASSWORD_CONFIRM_FAIL
        });
        dispatch({
          type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Error resetting your password', 'red'));
      }
    }
  };
  


export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
    dispatch(setAlert('Succesfully logged out', 'green'));
}