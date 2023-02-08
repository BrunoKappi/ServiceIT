

const Chamados = (state = [], action) => {
    switch (action.type) {
        case 'ADD_CHAMADO':
            return state.concat(action.Chamado)
        case 'SET_CHAMADOS':
            return action.Chamados
        default:
            return state
    }
}

export default Chamados
