

export const clearNotification = () => {
    return ({
        type: 'CLEAR_NOTIFICATION'
    })
}

export const setNotification = (Notification) => {
    return ({
        type: 'SET_NOTIFICATION',
        Notification
    })
}

