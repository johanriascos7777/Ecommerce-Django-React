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
} from './types';

import axios from 'axios';
import { setAlert } from './alert';


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

