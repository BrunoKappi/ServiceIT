

const Notification = (state = {}, action) => {
    switch (action.type) {
        case 'CLEAR_NOTIFICATION':
            return {}
        case 'SET_NOTIFICATION':
            return action.Notification
        default:
            return state
    }
}

export default Notification



