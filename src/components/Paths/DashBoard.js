import React from "react";
import { connect } from 'react-redux'
import './css/Dashboard.css'
import Dash from '../../images/Dash.png'


const DashBoard = (props) => {



  return (
    <div className="Dashboard">
      <p>Esta tela ainda está em desenvolvimento, aqui somente há uma foto de como será parecido futuramente</p>
      <img src={Dash} alt="" />

    </div>
  );        
}

const ConnectedDashBoard = connect((state) => {
  return {
    LoggedUser: state.LoggedUser
  }
})(DashBoard)

export default ConnectedDashBoard

