import React from 'react'
import './css/bottomBar.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { AiFillHome } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { FaThList } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";




const BottomBar = (props) => {

    return (
        <div>
            <ul className="bottomList">
                <li className="bottomListLI">
                    <Link to="/App/DashBoard">
                        <AiFillHome className='botomBarIcon' />
                    </Link>
                </li>
                <li className="bottomListLI">
                    <Link to="/App/MeusChamados">
                        <FaThList className='botomBarIcon' />
                    </Link>
                </li>
                <li className="bottomListLI">
                    <Link to="/App/Profile">
                        <FaUserAlt className='botomBarIcon' />
                    </Link>                      
                </li>
                <li className="bottomListLI">
                    <Link to="/App/AbrirChamado" >
                        <MdPostAdd className='botomBarIcon' />
                    </Link>
                </li>
            </ul>
        </div>
    )
}


const ConnectedBottomBar = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        Usuario: state.Usuarios.find(Usuario => {
            return Usuario.email === state.LoggedUser.email
        })
    }
})(BottomBar)

export default ConnectedBottomBar

