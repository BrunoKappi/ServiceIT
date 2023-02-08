

export const clearLoggedUser = () => {
    return ({
        type: 'CLEAR_LOGGED'
    })
}

export const setLoggedUser = (user) => {
    return ({
        type: 'SET_LOGGED',
        user
    })
}


export const setChamadoListening = (docID) => {
    return ({
        type: 'SET_CHAMADO_LISTENING',
        docID
    })
}


export const clearChamadoListening = () => {
    return ({
        type: 'CLEAR_CHAMADO_LISTENING'
    })
}


export const ToggleSideBar = () => {
    return ({
        type: 'TOGGLE_SIDEBAR'
    })
}

export const SetSidebarTag = (tab) => {
    return ({
        type: 'SET_SIDEBAR_TAB',
        tab
    })
}
