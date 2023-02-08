

export const addChamadoAction = (Chamado = {}) => {
    
    return ({
        type: 'ADD_CHAMADO',
        Chamado
    })
}


export const editChamadoAction = (uid,EditedUser = {}) => {
    return ({
        type: 'EDIT_CHAMADO',
        uid,
        EditedUser
    })
}


export const clearAllChamados = () => {
    return ({
        type: 'CLEAR_ALL'
    })
}

export const setChamados = (Chamados) => {
    return ({
        type: 'SET_CHAMADOS',
        Chamados
    })
}


