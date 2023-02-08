import { uuidv4 } from "@firebase/util"

const UsuariosPadrao = [
    {
        uid: uuidv4(),
        email: 'brunokappidematos2@gmail.com',
        nome: 'Bruno',
        tipo: 'Solucionador'
    }
]

const Usuarios = (state = UsuariosPadrao, action) => {

    switch (action.type) {
        case 'ADD_USUARIO':
            return state.concat(action.novoUsuario)
        case 'CLEAR_ALL':
            return []
        case 'SET_USUARIOS':
            return action.Usuarios
        case 'EDIT_USUARIO':
            return state.filter( usuario => {
                return usuario.uid !== action.uid
            }).concat(action.EditedUser)
        default:
            return state
    }
}


export default Usuarios
