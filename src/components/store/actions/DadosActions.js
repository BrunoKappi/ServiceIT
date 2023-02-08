

export const addDadoAction = (Dado = {}) => {
    
    return ({
        type: 'ADD_DADO',
        Dado
    })
}


export const editDadoAction = (uid,EditedUser = {}) => {
    return ({
        type: 'EDIT_DADO',
        uid,
        EditedUser
    })
}


export const clearAllDados = () => {
    return ({
        type: 'CLEAR_ALL'
    })
}

export const setDados = (Dados) => {
    return ({
        type: 'SET_DADOS',
        Dados
    })
}




export const AddCategoria = (Categoria) => {
    return ({
        type: 'ADD_CATEGORIA',
        Categoria
    })
}





