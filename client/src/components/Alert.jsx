import { Fragment } from 'react'
// Importamos los íconos desde Heroicons
import { CheckCircleIcon } from '@heroicons/react/solid'
// Importamos los hooks de react-redux
import { useDispatch, useSelector } from 'react-redux'
// Aquí puedes importar cualquier acción que quieras despachar (por ejemplo, para ocultar la alerta después de un tiempo)
/*import { clearAlert } from '../actions/alertActions' */ // Asegúrate de tener esta acción definida si es necesario

function Alert() {
    // Usamos el hook `useSelector` para acceder al estado global
    const alert = useSelector(state => state.Alert.alert)

    // Usamos `useDispatch` para obtener la función dispatch y poder despachar acciones
    const dispatch = useDispatch()

    // Función que se encarga de mostrar la alerta
    const displayAlert = () => {
        // Verificamos si hay una alerta en el estado
        if (alert !== null) {
            // Si existe, devolvemos el JSX con el mensaje y tipo de alerta
            return (
                <div className={`rounded-md bg-${alert.alertType}-50 p-4`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {/* Icono basado en el tipo de alerta */}
                            <CheckCircleIcon className={`h-5 w-5 text-${alert.alertType}-400`} aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            {/* El mensaje de la alerta */}
                            <p className={`text-sm font-medium text-${alert.alertType}-800`}>{alert.msg}</p>
                        </div>
                    </div>
                </div>
            )
        } else {
            // Si no hay alerta, retornamos un Fragment vacío
            return (
                <Fragment></Fragment>
            )
        }
    }

    // Aquí puedes despachar una acción para eliminar la alerta después de un cierto tiempo (opcional)
    // Si deseas que la alerta se cierre después de un tiempo, puedes usar algo como esto:
    // React.useEffect(() => {
    //     if (alert) {
    //         setTimeout(() => {
    //             dispatch(clearAlert())
    //         }, 3000)  // Despacha `clearAlert` después de 3 segundos
    //     }
    // }, [alert, dispatch])

    return (
        <Fragment>
            {displayAlert()}
        </Fragment>
    )
}

export default Alert
