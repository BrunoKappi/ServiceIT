import React from 'react'
import { Outlet } from "react-router-dom"
import Sidebar from './Sidebar'
import './css/Layout.css'
import { connect } from 'react-redux'
import NavBar from './NavBar'
import BottomBar from './BottomBar'
import Notification from './Notification';

const Layout = (props) => {

    if (props.LoggedUser.email !== 'Vazio' && props.LoggedUser.email) {
        return (
            <div className='OuterLayout'>
                <NavBar />
                <div className='Layout'>
                    <Sidebar className="regularSidebar" />
                    <main className='Content'>
                        <Outlet />
                        <div className="bottomSidebar">
                            <BottomBar />
                        </div>
                    </main>

                </div>   


                <Notification />

            </div>

        )
    } else {
        return (
            <div className='Layout'>
                Redirecionando
            </div>
        )
    }


}


const ConnectedLayout = connect((state) => {
    return {
        LoggedUser: state.LoggedUser
    }
})(Layout)

export default ConnectedLayout