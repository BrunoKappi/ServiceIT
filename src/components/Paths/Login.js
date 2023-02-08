import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './css/Login.css'
import Logo from '../../images/logoPreto.png'
import Celular from '../../images/Celular.png'
import { DefaultLoggedUser } from '../../GlobalVars'
import { SetLoggedUser, Login as LoginFirebase, LogarComGooglePopup } from '../utils/Utilidades';



const Login = (props) => {

    const [Email, setEmail] = useState('');
    const [Senha, setSenha] = useState('');
    const [Erro, setErro] = useState('');

    const navigate = useNavigate();


    useEffect(() => {

        if (props.LoggedUser.email !== 'Vazio' && props.LoggedUser.email)
            navigate("App/DashBoard")
    }, [props.LoggedUser.email, navigate]);


    const HandleSubmitSigin = (e) => {
        e.preventDefault()
        if (Email && Senha) {
            LoginFirebase(Email.toLocaleLowerCase(), Senha).then((message) => {
                const user = {
                    ...DefaultLoggedUser,
                    email: message.user.email,
                    Id: message.user.uid
                }
                SetLoggedUser(user)
                navigate('/App/DashBoard')
            }
            ).catch((error) => {
                setErro('Email ou Senha incorretos')
                setTimeout(() => {
                    setErro('')
                }, 3000);
            })
        }
    }






    return (
        <div className='DivLoginForm'>
            <div className='DivLateralLogin'>
                <img className="LogoLogin" src={Celular} alt="" />
                <Link className='VideoLink' to="/Video">Saiba mais Sobre o ServiceIT</Link>
            </div>
            <div className='formContainer'>

                <form onSubmit={HandleSubmitSigin} className="LoginForm">
                    <img className="LogoLogin" src={Logo} alt="" />

                    {Erro && <p className='Erro'>{Erro}</p>}


                    <input className='LoginInput' type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} />
                    <input className='LoginInput' type="password" placeholder='Senha' onChange={e => setSenha(e.target.value)} />
                    <button className='SignInButton'>Entrar</button>

                    <div className='LinhaOu'>
                        <div className='Linha'></div>
                        <span>OU</span>
                        <div className='Linha'></div>
                    </div>

                    <button className='login-with-google-btn' onClick={LogarComGooglePopup}>Entrar com o Google</button>

                    <div className='RegisterLink'>
                        <span >Não tem uma conta? </span>
                        <Link className='RegisterLink' to="/Registrar">Cadastre-se</Link>
                    </div>
                    <Link className='ForgetLink' to="/Forget">Esqueci Minha Senha</Link>
                </form>
                <Link className='VideoLinkForm' to="/Video">Saiba mais Sobre o ServiceIT</Link>
            </div>



        </div>
    )
}


const ConnectedLogin = connect((state) => {
    return {
        LoggedUser: state.LoggedUser
    }
})(Login)

export default ConnectedLogin

