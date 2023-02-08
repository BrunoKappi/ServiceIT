import React, { useState } from "react";
import './css/Sidebar.css'
import { Link } from 'react-router-dom'
import { FaUserAlt } from "react-icons/fa";
import { FaThList } from "react-icons/fa";
import { MdDashboard, MdOutlinePendingActions } from "react-icons/md";
import { FaUserFriends, FaUserClock, FaUserEdit } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { connect } from 'react-redux'
import { BsFillGearFill } from "react-icons/bs";
import { HiOutlineRefresh } from "react-icons/hi";
import { SetTab, StopListening, GetChamados } from "./utils/Utilidades";
import { emailADM } from "../GlobalVars";

const Sidebar = (props) => {

  const [RefreshMessage, setRefreshMessage] = useState('Atualizar Dados');

  const RefreshChamados = () => {
    setRefreshMessage("Buscando dados...")
    GetChamados().then(() => {
      setRefreshMessage("Dados atualizados!")
      setTimeout(() => {
        setRefreshMessage("Atualizar Dados")
      }, 1000);
    })
  }


  return (
    <div className={`Sidebar  ${props.LoggedUser.SidebarActive ? 'Active' : 'UnActive'} `}>
      <nav>
        <ul>
          <li className="sidebarLink" onClick={e => { SetTab('DashBoard'); StopListening() }} >
            <Link to="/App/DashBoard" className={`${props.LoggedUser.CurrentSidebarTab === 'DashBoard' ? 'SidebarLink SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
              <MdDashboard />
              <span className="TextoLink">DashBoard</span> </Link>
          </li>
          <li id="sidebarLink" onClick={e => SetTab('AbrirChamado')} >
            <Link to="/App/AbrirChamado" className={`${props.LoggedUser.CurrentSidebarTab === 'AbrirChamado' ? 'SidebarLink SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
              <MdPostAdd />
              <span className="TextoLink">Abrir Chamado</span> </Link>
          </li>
          <li className="sidebarLink" onClick={e => SetTab('MeusChamados')} >
            <Link to="/App/MeusChamados" className={`${props.LoggedUser.CurrentSidebarTab === 'MeusChamados' ? 'SidebarLink SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
              <FaUserEdit />
              <span className="TextoLink">
                <span>Meus Chamados</span>
                <span className="BadgeNumber">
                  <span>{props.MeusChamados.length > 0 && props.MeusChamados.length}</span>
                </span>
              </span>
            </Link>
          </li>
          <li id="sidebarLink" onClick={e => SetTab('Profile')} >
            <Link to="/App/Profile" className={`${props.LoggedUser.CurrentSidebarTab === 'Profile' ? 'SidebarLink SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
              <FaUserAlt />
              <span className="TextoLink">Perfil</span> </Link>
          </li>

          {props.Usuario.email === emailADM &&
            <li id="sidebarLink" onClick={e => SetTab('Aprovacoes')} >
              <Link to="/App/Aprovacoes" className={`${props.LoggedUser.CurrentSidebarTab === 'Aprovacoes' ? 'SidebarLink  SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
                <FaUserFriends />
                <span className="TextoLink">
                  <span>Aprovações</span>
                  <span className="BadgeNumber">
                    {props.UsuariosPendentes.length > 0 && <span>{props.UsuariosPendentes.length}</span>}
                  </span>
                </span>

              </Link>
            </li>}

          {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&
            <li id="sidebarLink" onClick={e => SetTab('ChamadosAbertos')} >
              <Link to="/App/ChamadosAbertos" className={`${props.LoggedUser.CurrentSidebarTab === 'ChamadosAbertos' ? 'SidebarLink  SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
                <MdOutlinePendingActions />
                <span className="TextoLink">
                  <span>Chamados em aberto</span>
                  <span className="BadgeNumber">
                    <span>{props.ChamadosAbertos.length > 0 && props.ChamadosAbertos.length}</span>
                  </span>
                </span>

              </Link>
            </li>
          }


          {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&
            <li id="sidebarLink" onClick={e => SetTab('AtribuidosAMim')} >
              <Link to="/App/AtribuidosAMim" className={`${props.LoggedUser.CurrentSidebarTab === 'AtribuidosAMim' ? 'SidebarLink  SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
                <FaUserClock />
                <span className="TextoLink">
                  <span>Atribuidos a mim</span>
                  <span className="BadgeNumber">
                    <span>{props.AtribuidosAMim.length > 0 && props.AtribuidosAMim.length}</span>
                  </span>
                </span>

              </Link>
            </li>
          }

          {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&
            <li id="sidebarLink" onClick={e => SetTab('TodosChamados')} >
              <Link to="/App/TodosChamados" className={`${props.LoggedUser.CurrentSidebarTab === 'TodosChamados' ? 'SidebarLink  SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
                <FaThList />
                <span className="TextoLink">
                  <span>Todos os Chamados</span>
                  <span className="BadgeNumber">
                    <span>{props.TodosChamados.length > 0 && props.TodosChamados.length}</span>
                  </span>
                </span>
              </Link>
            </li>
          }


          {(props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM) &&
            <li id="sidebarLink" onClick={e => SetTab('Categorias')} >
              <Link to="/App/Categorias" className={`${props.LoggedUser.CurrentSidebarTab === 'Categorias' ? 'SidebarLink  SidebarLinkActive' : 'SidebarLink  SidebarLinkUnActive'} `}>
                <BsFillGearFill />
                <span className="TextoLink">
                  <span>Categorias</span>

                </span>
              </Link> 
            </li>
          }



        </ul>

        <div className="RefreshButtonFixed">
          <button onClick={RefreshChamados}>
            <HiOutlineRefresh />
            <span>{RefreshMessage}</span>
          </button>

        </div>

      </nav>
    </div>



  );
}


const ConnectedSidebar = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    }),
    TodosChamados: state.Chamados,
    ChamadosAbertos: state.Chamados.filter(Chamado => {
      return Chamado.Andamento.Status === 'Aberto' || Chamado.Andamento.Status === 'Em Andamento'
    }),
    AtribuidosAMim: state.Chamados.filter(Chamado => {
      return Chamado.Andamento.Responsavel.EmailResponsavel === state.LoggedUser.email
    }),
    MeusChamados: state.Chamados.filter(Chamado => {
      return Chamado.Solicitante.EmailSolicitante === state.LoggedUser.email
    }),
    UsuariosPendentes: state.Usuarios.filter(UsuarioFilter => {
      return UsuarioFilter.aprovado === false && UsuarioFilter.rejeitado === false
    })
  }
})(Sidebar)

export default ConnectedSidebar

