import React, { useState,useEffect } from 'react'
import './css/navBar.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { BsFillPersonFill } from "react-icons/bs";
import { MdOutlineLogout, MdOutlinePendingActions,MdFeedback } from "react-icons/md";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { BsFillGearFill } from "react-icons/bs";
import { FaThList, FaUserClock } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaUserAlt, FaUserEdit } from "react-icons/fa";
import Logo from '../images/Logo.png'
import { MdPostAdd } from "react-icons/md";
import { SetTab, ToggleSidebar, Sair, GetUserUrlImage } from './utils/Utilidades';
import { emailADM } from '../GlobalVars';
import User from '../images/User.png'

const NavBar = (props) => {

    const [isActive, setisActive] = useState(true);
    const [imageUrls, setImageUrls] = useState();

    const toggleSidebarEvent = () => {
        setisActive(!isActive)
        ToggleSidebar(isActive)
    }

    useEffect(() => {
       
        GetUserUrlImage(`images/${props.Usuario.uid}`).then((url) => {
            console.log("Retorno", url)
            setImageUrls(url);           
        }).catch((error) => {
            console.log("Retorno Erro", error)
            setImageUrls('');          
        })


    }, []);


    return (
        <div>

            <Navbar expand={'md'} id='navBarResponsive' bg="dark" variant="dark">
                <Container fluid bg='dark'>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
                    <Navbar.Brand>
                        <div className='LogoAndCollpse'>
                            <div onClick={toggleSidebarEvent} className='Hamburguer'>
                                <div className='part'></div>
                                <div className='part'></div>
                                <div className='part'></div>
                            </div>
                            <Link to="/App/DashBoard">
                                <img className="LogoNavBar" src={Logo} alt="" />
                            </Link>
                        </div>
                    </Navbar.Brand>

                    <Navbar.Offcanvas id="sidebarOffCanvas" backdrop={true}>
                        <Offcanvas.Header closeButton closeVariant='white'>
                            <Offcanvas.Title>
                                <h1>
                                    <Link className='offCanvasBrand' to="/App/DashBoard">
                                        <img className="LogoNavBar" src={Logo} alt="" />
                                    </Link>
                                </h1>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body >
                            <Nav className="justify-content-end flex-grow-1 ">
                                <div className='profileDropdown'>
                                    <Nav.Link href='/App/Feedback'>Pesquisa de Satisfação</Nav.Link>
                                </div>


                                <div className='profileDropdown'>


                                    <NavDropdown title={
                                        <span className='ProfileNavLinkTitle' >{`${props.Usuario.nome} ${props.Usuario.sobrenome}`}  </span>}>

                                        <Link onClick={e => SetTab('Profile')} className="dropDownLink" to="/App/Profile">
                                            <BsFillPersonFill className='IconeEscuro' />  Meu Perfil
                                        </Link>


                                        <Link onClick={e => SetTab('MeusChamados')} className="dropDownLink" to="/App/MeusChamados">
                                            <FaUserEdit className='IconeEscuro' /> Meus Chamados
                                            <span className="BadgeNumber">
                                                {props.MeusChamados.length > 0 && <span>{props.MeusChamados.length}</span>}
                                            </span>
                                        </Link>



                                        <Link className='dropDownLink' to="/App/AbrirChamado" onClick={e => SetTab('AbrirChamado')}>
                                            <MdPostAdd className='IconeEscuro' />
                                            Abrir Chamado
                                        </Link>


                                        {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&

                                            <Link className='dropDownLink' to="/App/ChamadosAbertos" onClick={e => SetTab('ChamadosAbertos')}>
                                                <MdOutlinePendingActions className='IconeEscuro' />
                                                Chamados em Aberto
                                                <span className="BadgeNumber">
                                                    {props.ChamadosAbertos.length > 0 && <span>{props.ChamadosAbertos.length}</span>}
                                                </span>
                                            </Link>

                                        }




                                        {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&

                                            <Link to="/App/AtribuidosAMim" className='dropDownLink' onClick={e => SetTab('AtribuidosAMim')}>
                                                <FaUserClock className='IconeEscuro' />
                                                Atribuidos a mim
                                                <span className="BadgeNumber">
                                                    {props.AtribuidosAMim.length > 0 && <span>{props.AtribuidosAMim.length}</span>}
                                                </span>
                                            </Link>


                                        }


                                        {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&

                                            <Link to="/App/TodosChamados" className='dropDownLink' onClick={e => SetTab('TodosChamados')}>
                                                <FaThList className='IconeEscuro' />
                                                Todos os Chamados
                                                <span className="BadgeNumber">
                                                    {props.TodosChamados.length > 0 && <span>{props.TodosChamados.length}</span>}
                                                </span>
                                            </Link>

                                        }


                                        {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&

                                            <Link to="/App/Categorias" className='dropDownLink' onClick={e => SetTab('Categorias')}>
                                                <BsFillGearFill className='IconeEscuro' />
                                                Categorias
                                            </Link>

                                        }



                                        <NavDropdown.Divider />

                                        <span href='/' className="dropDownLink" onClick={Sair}>
                                            <MdOutlineLogout className='IconeEscuro' /> Sair
                                        </span>

                                    </NavDropdown>



                                </div>

                                <div className='profileDropdown'>

                                    <img className="ProfileUserPhotoNav" src={imageUrls || User} alt="" />

                                </div>

                                <div id="SmDivNavBarID" className='SmDivNavBar'>

                                    <div className="SmSidebar">
                                        <ul className='SmUl'>
                                            <li className="DashLI">
                                                <Link className='smNavLink' to="/App/DashBoard" onClick={e => SetTab('DashBoard')}>
                                                    <MdDashboard />
                                                    <span className="TextoLink">DashBoard</span>
                                                </Link>
                                            </li>
                                            <li className="ChamadosLI">
                                                <Link className='smNavLink' to="/App/AbrirChamado" onClick={e => SetTab('AbrirChamado')}>
                                                    <MdPostAdd />
                                                    <span className="TextoLink"> Abrir Chamado</span>
                                                </Link>
                                            </li>
                                            <li className="ChamadosLI">
                                                <Link className='smNavLink' to="/App/MeusChamados" onClick={e => SetTab('MeusChamados')}>
                                                    <FaUserEdit />
                                                    <span className='SmNavBarText'>Meus Chamados</span>
                                                    <span className="BadgeNumber">
                                                        <span>{props.MeusChamados.length}</span>
                                                    </span>

                                                </Link>
                                            </li>
                                            <li>
                                                <Link className='smNavLink ' to="/App/Profile" onClick={e => SetTab('Profile')}>
                                                    <FaUserAlt />
                                                    <span className="TextoLink">Meu Pefil</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className='smNavLink ' to="/App/Feedback" onClick={e => SetTab('Feedback')}>
                                                    <MdFeedback />
                                                    <span className="TextoLink">Pesquisa de Satisfação</span>
                                                </Link>
                                            </li>
                                            {props.Usuario.email === 'admin@serviceit.com' &&
                                                <li>
                                                    <Link className='smNavLink ' to="/App/Aprovacoes" onClick={e => SetTab('Aprovacoes')}>
                                                        <span className="TextoLink">Aprovações</span>
                                                    </Link>
                                                </li>
                                            }


                                            {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&
                                                <li>
                                                    <Link to="/App/ChamadosAbertos" onClick={e => SetTab('ChamadosAbertos')}>
                                                        <MdOutlinePendingActions />
                                                        <span className='SmNavBarText'>Chamados abertos</span>
                                                        <span className="BadgeNumber">
                                                            <span>{props.ChamadosAbertos.length}</span>
                                                        </span>
                                                    </Link>
                                                </li>
                                            }

                                            {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&
                                                <li>
                                                    <Link to="/App/AtribuidosAMim" onClick={e => SetTab('AtribuidosAMim')}>
                                                        <FaUserClock />
                                                        <span className='SmNavBarText'>Atribuidos a mim</span>
                                                        <span className="BadgeNumber">
                                                            <span>{props.AtribuidosAMim.length}</span>
                                                        </span>
                                                    </Link>
                                                </li>
                                            }

                                            {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&
                                                <li>
                                                    <Link to="/App/TodosChamados" onClick={e => SetTab('TodosChamados')}>
                                                        <FaThList />
                                                        <span className='SmNavBarText'>Todos os Chamados</span>
                                                        <span className="BadgeNumber">
                                                            <span>{props.TodosChamados.length}</span>
                                                        </span>
                                                    </Link>
                                                </li>
                                            }


                                            {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&
                                                <li>
                                                    <Link to="/App/Categorias" onClick={e => SetTab('Categorias')}>
                                                        <BsFillGearFill />
                                                        <span className="TextoLink">
                                                            <span>Categorias</span>

                                                        </span>
                                                    </Link>
                                                </li>
                                            }

                                            <li className='LogouButtonNavSm'>
                                                <a href='/' id='LogouButtonNavSm' className="LogouButtonNavSm" onClick={Sair}>
                                                    <MdOutlineLogout /> Sair
                                                </a>
                                            </li>



                                        </ul>
                                    </div>
                                </div>
                            </Nav>





                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>



        </div>
    )
}




const ConnectedNavBar = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        Usuario: state.Usuarios.find(Usuario => {
            return Usuario.email === state.LoggedUser.email
        }),
        TodosChamados: state.Chamados,
        ChamadosAbertos: state.Chamados.filter(Chamado => {
            return Chamado.Andamento.Status === 'Aberto'
        }),
        AtribuidosAMim: state.Chamados.filter(Chamado => {
            return Chamado.Andamento.Responsavel.Email === state.LoggedUser.email
        }),
        MeusChamados: state.Chamados.filter(Chamado => {
            return Chamado.Solicitante.EmailSolicitante === state.LoggedUser.email
        })
    }
})(NavBar)

export default ConnectedNavBar

