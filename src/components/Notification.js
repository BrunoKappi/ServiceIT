import React, { useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert';
import './css/Notification.css'
import { connect } from 'react-redux'
import { MdCancel } from "react-icons/md";
import { Notificar } from './utils/Utilidades';

const Notification = (props) => {

    const [Visible, setVisible] = useState(false);
    const [NotificationDesc, setNotificationDesc] = useState('false');

    useEffect(() => {
        if (props.Notification.descricao) {
            setVisible(true)
            setNotificationDesc(props.Notification.descricao)
            setTimeout(() => {
                setVisible(false)
                setNotificationDesc('')
                Notificar('')
            }, 4000);
        } else {
            setVisible(false) 
            setNotificationDesc('')
        }
    }, [props.Notification]);






    const DismissNotification = () => {
        setVisible(false)
        Notificar('')
        setNotificationDesc('')
    }

    return (
        <div className={`Notification  ${Visible ? 'NotificationHidden NotificationOpen' : 'NotificationHidden'}`}>
            {Visible &&
                <Alert variant="warning" className='AlertaNenhumChamado'>
                    <div className='NotificationBody'>
                        <span>{NotificationDesc}</span>
                        <MdCancel onClick={DismissNotification} />
                    </div>
                </Alert>
            }
        </div>
    )
}


const ConnectedNotification = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        Notification: state.Notification
    }
})(Notification)

export default ConnectedNotification