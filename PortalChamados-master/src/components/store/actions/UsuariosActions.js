

export const addUsuarioAction = (novoUsuario = {}) => {
    
    return ({
        type: 'ADD_USUARIO',
        novoUsuario
    })
}


export const editUsuarioAction = (uid,EditedUser = {}) => {
    return ({
        type: 'EDIT_USUARIO',
        uid,
        EditedUser
    })
}


export const clearAllUsuarios = () => {
    return ({
        type: 'CLEAR_ALL'
    })
}

export const setUsuarios = (Usuarios) => {
    return ({
        type: 'SET_USUARIOS',
        Usuarios
    })
}


