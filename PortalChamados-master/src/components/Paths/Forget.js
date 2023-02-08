import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './css/Forget.css'
import { ResetarSenha } from '../utils/Utilidades';
import Logo from '../../images/logoPreto.png'

const Forget = (props) => {

    const [Email, setEmail] = useState('');
    const [Erro, setErro] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (props.LoggedUser.email !== 'Vazio' && props.LoggedUser.email)
            navigate("/App")
    }, [props.LoggedUser.email, navigate]);


    const HandleSubmitSigin = (e) => {
        e.preventDefault()
        if (Email) {
            ResetarSenha(Email).then((message) => {
                setErro("Link de reconfiguração de Senha enviado para seu Email")
                setTimeout(() => {
                    setErro("")
                }, 4000)
            }
            ).catch((error) => {
                setErro("Email não encontrado")
                setTimeout(() => {
                    setErro("")
                }, 4000)
            })
        }
    }
    return (
        <div className='DivRegisterForm'>
            <div className='formContainer'>
                <img className="LogoLogin" src={Logo} alt="" />

                <form onSubmit={HandleSubmitSigin} className="RegisterForm">
                    <h1 className='Header' >Resetar Senha</h1>
                    {Erro && <p className='Erro'>{Erro}</p>}
                    <input className='ForgetInput' type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} />
                    <button className='SignInButton'>Enviar Email</button>
                    <Link className='Link' to="/">Entrar</Link>
                </form>
            </div>

        </div>
    )
}


const ConnectedForget = connect((state) => {
    return {
        LoggedUser: state.LoggedUser
    }
})(Forget)

export default ConnectedForget

