import {React} from "react";
import { connect } from 'react-redux'
import Page404 from '../../images/404.png'
import Page404Mobile from '../../images/404Mobile.png'
import './css/NotFound.css'

const  NotFound = (props) => {


  return (
    <div className="NotFound">
        
      <img className="Page404" src={Page404} alt="" />

      <img className="Page404Mobile" src={Page404Mobile} alt="" />
    

    </div>
  );
}

const ConnectedNotFound = connect((state) => {           
  return {
      LoggedUser: state.LoggedUser,
      Usuario: state.Usuarios.find(Usuario => {
          return Usuario.email === state.LoggedUser.email
      })
  }
})(NotFound)

export default ConnectedNotFound
