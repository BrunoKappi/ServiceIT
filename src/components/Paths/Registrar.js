import React, { useState, useEffect } from 'react'
import { register } from '../firebase/auth'

import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './css/Registrar.css'
import Logo from '../../images/logoPreto.png'
import Celular from '../../images/Celular.png'
import { SetLoggedUser,LogarComGooglePopup } from '../utils/Utilidades';

import { MaxLengthEmail, DefaultLoggedUser } from '../../GlobalVars';

const Registrar = (props) => {

    const [Email, setEmail] = useState('');
    const [Senha, setSenha] = useState(''); 
    const [Erro, setErro] = useState('');

    const navigate = useNavigate();
         
    useEffect(() => {
        if (props.LoggedUser.email !== 'Vazio' && props.LoggedUser.email) {
             navigate("/App")
        }

    }, [props.LoggedUser.email, navigate]);


    const HandleSubmitSigin = (e) => {
        e.preventDefault()
        if (Email && Senha) {
            register(Email.toLocaleLowerCase(), Senha).then((message) => {
                const user = {
                    ...DefaultLoggedUser,
                    email: message.user.email,
                    Id: message.user.uid
                }
                SetLoggedUser(user)
                navigate('/App')
            }
            ).catch((error) => {
                console.log("ERRADO REGISTRO", error.code)
                let SenhaFraca = error.code.includes("password");
                let EmailEmUso = error.code.includes("use");
                if (SenhaFraca)
                    setErro('A senha deve ter pelo menos 6 caracteres')
                if (EmailEmUso)
                    setErro('Esse Email já está em uso')
                setTimeout(() => {
                    setErro('')
                }, 3000);
            })
        }
    }
    return (
        <div className='DivRegisterForm2'>
            <div className='DivLateralLogin'>
                <img className="LogoLogin" src={Celular} alt="" />
            </div>



            <form onSubmit={HandleSubmitSigin} className="RegisterForm">

                <img className="LogoLogin" src={Logo} alt="" />
                {Erro && <p className='Erro'>{Erro}</p>}

                <h1 className='Header'>Crie sua conta</h1>

                <div className='formRowLogin'>

                    <input maxLength={MaxLengthEmail} className='RegisterInput' type="email" placeholder='Digite seu Email' onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='formRowLogin'>

                    <input className='RegisterInput' type="password" placeholder='Escolha uma Senha' onChange={e => setSenha(e.target.value)} />
                </div>


                <button className='SignInButton'>Enviar</button>
                <button className='login-with-google-btn' onClick={LogarComGooglePopup}>Cadastre-se com o Google</button>
                <Link className='Link' to="/">Entrar</Link>
            </form>

 
        </div>
    )
}


const ConnectedRegistrar = connect((state) => {
    return {
        LoggedUser: state.LoggedUser
    }
})(Registrar)

export default ConnectedRegistrar

