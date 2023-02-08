

const LoggedUser = (state = {}, action) => {
    switch (action.type) {
        case 'CLEAR_LOGGED':
            return {
                email: 'Vazio',
                uid: 'Vazio'
            }
        case 'TOGGLE_SIDEBAR':
            return {
                ...state,
                SidebarActive: !state.SidebarActive
            }
        case 'SET_SIDEBAR_TAB':
            return {
                ...state,
                CurrentSidebarTab: action.tab
            }
        case 'SET_CHAMADO_LISTENING':
            return {
                ...state,
                ChamadoListening: action.docID,
                Listening : true
            }
        case 'CLEAR_CHAMADO_LISTENING':
            return {
                ...state,
                ChamadoListening: ''
            }
        case 'SET_LOGGED':
            return action.user
        default:
            return state
    }
}

export default LoggedUser
