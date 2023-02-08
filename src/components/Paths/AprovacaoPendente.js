import { React } from "react";
import { connect } from 'react-redux'
import './css/aprovacao.css'
import Alert from 'react-bootstrap/Alert';
import { SairUmaPagina } from "../utils/Utilidades";

const AprovacaoPendente = (props) => {

  return (
    <div className="AprovacaoPendente">


      {props.Usuario.aprovado === false && props.Usuario.rejeitado === false &&
        <span className='Aviso'>
          <Alert variant="warning ">
            O seu perfil ainda está com a aprovação pendente. Consulte seu administrador.
            <a className="BackLogout" href="/" onClick={SairUmaPagina}>Voltar          </a>
          </Alert>
        </span>


      }             


      {props.Usuario.aprovado === false && props.Usuario.rejeitado === true &&

        <span className='Aviso'>
          <Alert variant="warning ">
            O seu perfil não foi aprovado pelo responsável. Consulte seu administrador.
            <a className="BackLogout" href="/" onClick={SairUmaPagina}>Voltar          </a>
          </Alert>
        </span>
      }


    </div>
  );
}

const ConnectedAprovacaoPendente = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    })
  }
})(AprovacaoPendente)

export default ConnectedAprovacaoPendente
