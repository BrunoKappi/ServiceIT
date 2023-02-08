import { combineReducers, createStore } from 'redux'
import Usuarios from './reducers/Usuarios'
import LoggedUser from './reducers/LoggedUser'
import Chamados from './reducers/Chamados'
import Dados from './reducers/Dados'
import Notification from './reducers/Notification'

const store = createStore(
    combineReducers({
        Usuarios: Usuarios,
        LoggedUser,
        Chamados,
        Dados,
        Notification
    }), 

    //A linha abaixo é para habilitar o Rexux Store Extension
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(() => {
    localStorage.setItem("ServiceIT", JSON.stringify(store.getState()))
    //console.log("Store Changed", store.getState())
})


export default store



