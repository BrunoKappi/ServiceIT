

const Dados = (state = [], action) => {
    switch (action.type) {
        case 'ADD_DADO':
            return state.concat(action.Chamado)
        case 'SET_DADOS':
            return action.Dados        
        default:
            return state
    }
}

export default Dados



