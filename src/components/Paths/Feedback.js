import { React } from "react";
import { connect } from 'react-redux'
import './css/Feedback.css'

const Feedback = (props) => {


  return (
    <div className="Feedback">

      <h1>Deixe seu Feedback no formulário a seguir, é rapidinho...</h1>

      <h2>
        <a href="https://forms.gle/VnbUUr3trCopZFua8">Formulário de Feedback</a>
      </h2>


    </div>
  );
}

const ConnectedFeedback = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    })
  }
})(Feedback)

export default ConnectedFeedback
