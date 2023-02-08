import './App.css';
import { Navigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Login from './components/Paths/Login';
import DashBoard from './components/Paths/DashBoard';
import NotFound from './components/Paths/NotFound';
import Layout from './components/Layout';
import Registrar from './components/Paths/Registrar'
import Forget from './components/Paths/Forget'
import { connect } from 'react-redux'
import Profile from './components/Paths/Profile'
import Cadastro from './components/Paths/Cadastro';
import { getUsuarios, getChamados } from './components/firebase/metodos'
import { useEffect, useState } from 'react';
import Chamados from './components/Paths/Chamados'
import ChamadosAbertos from './components/Paths/ChamadosAbertos'
import AtribuidosAMim from './components/Paths/AtribuidosAMim'
import TodosChamados from './components/Paths/TodosChamados'
import Chamado from './components/Paths/Chamado'
import AbrirChamado from './components/Paths/AbrirChamado'
import { useNavigate } from 'react-router-dom';
import AprovacaoPendente from './components/Paths/AprovacaoPendente'
import Aprovacoes from './components/Paths/Aprovacoes'
import Categorias from './components/Paths/Categorias';
import Feedback from './components/Paths/Feedback';

import Testes from './components/Paths/Testes'
import { GetDadosPortal } from './components/utils/Utilidades';
import Video from './components/Paths/Video/Video';


const App = (props) => {

  const [loaded, setloaded] = useState(false);

  const navigate = useNavigate();

  GetDadosPortal()

  useEffect(() => {
    if (props.LoggedUser.email === 'Vazio' && window.location.pathname !== '/App/Cadastro'
      && !window.location.pathname.includes('Forget')
      && !window.location.pathname.includes('Video')
      && !window.location.pathname.includes("Registrar")
    ) {
      //console.log("APP", window.location.pathname)
      navigate('../')
    }
    getUsuarios().then(e => {

      getChamados().then(e => {
        setloaded(true)
      })


    })
  }, [props.LoggedUser.uid, navigate, props.LoggedUser.email])



  const RequireAuth = ({ children }) => {
    if (loaded) {
      if (props.LoggedUser.email !== 'Vazio' && props.Usuario) {
        if (props.Usuario.aprovado)
          return children
        else {
          return <AprovacaoPendente />
        }


      }
      else if (props.LoggedUser.email !== 'Vazio' && !props.Usuario) {
        return <Navigate to="/Cadastro" />
      } else {
        <Navigate to="/" />
      }
    } else {
      <Navigate to="/" />
    }

  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Forget" element={<Forget />} />
        <Route path="/Video" element={<Video />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/Registrar" element={<Registrar />} >
          <Route path="*" element={<RequireAuth><NotFound /></RequireAuth>} />
        </Route>
        <Route path="/App" element={<RequireAuth><Layout /></RequireAuth>} >
          <Route path="/App/MeusChamados" element={
            <RequireAuth>
              <Chamados />
            </RequireAuth>}
          />
          <Route path="/App/Categorias" element={
            <RequireAuth>
              <Categorias />
            </RequireAuth>}
          />
          <Route path="/App/ChamadosAbertos" element={
            <RequireAuth>
              <ChamadosAbertos />
            </RequireAuth>}
          />
          <Route path="/App/AtribuidosAMim" element={
            <RequireAuth>
              <AtribuidosAMim />
            </RequireAuth>}
          />
          <Route path="/App/TodosChamados" element={
            <RequireAuth>
              <TodosChamados />
            </RequireAuth>}
          />
          <Route path="/App/Chamado/:ID" element={
            <RequireAuth>
              <Chamado />
            </RequireAuth>}
          />
          <Route path="/App/AbrirChamado" element={
            <RequireAuth>
              <AbrirChamado />
            </RequireAuth>}
          />
          <Route path="/App/DashBoard" element={
            <RequireAuth>
              <DashBoard />
            </RequireAuth>}
          />
          <Route path="/App/Profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>}
          />
          <Route path="/App/Testes" element={
            <RequireAuth>
              <Testes />
            </RequireAuth>}
          />
          <Route path="/App/Aprovacoes" element={
            <RequireAuth>
              <Aprovacoes />
            </RequireAuth>}
          />
          <Route path="/App/Feedback" element={
            <RequireAuth>
              <Feedback />
            </RequireAuth>}
          />
          <Route path="*" element={
            <RequireAuth>
              <NotFound />
            </RequireAuth>}
          />
        </Route>
        <Route path="*" element={<RequireAuth><NotFound /></RequireAuth>} />
      </Routes>
    </div>
  );
}


const ConnectedApp = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    })
  }
})(App)

export default ConnectedApp

