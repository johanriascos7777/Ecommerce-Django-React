import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers/index.js';
import { thunk as thunkMiddleware } from 'redux-thunk';

// Esta línea asegura que podemos usar las Redux DevTools en el navegador, si están instaladas
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(thunkMiddleware))
);

export default store;
