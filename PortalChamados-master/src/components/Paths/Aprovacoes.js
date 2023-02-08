import { React } from "react";
import { connect } from 'react-redux'
import './css/Aprovacoes.css'

import Accordion from 'react-bootstrap/Accordion';
import { customAlphabet } from 'nanoid'
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { FaUserClock, FaUserTimes } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom'


import { SetTab, EditarUsuario, Notificar, UpdateUser } from "../utils/Utilidades";

          
const Aprovacoes = (props) => {

  const nanoid = customAlphabet('1234567890', 10)

  const HandleSubmitAprovacao = (uid) => {
    const user = props.Usuarios.filter(Usuario => {
      return Usuario.uid === uid
    })
    const EditedUser = { ...user[0], aprovado: true }
    EditarUsuario(EditedUser.uid, EditedUser)
    UpdateUser(EditedUser).then(() => {
      Notificar("Usuario Aprovado!")
    })
  }

  const HandleSubmitRejeicao = (uid) => {
    const user = props.Usuarios.filter(Usuario => {
      return Usuario.uid === uid
    })
    const EditedUser = { ...user[0], aprovado: false, rejeitado: true }
    EditarUsuario(EditedUser.uid, EditedUser)
    UpdateUser(EditedUser).then(() => {
      Notificar("Usuario Não Aprovado!")
    })
  }

  const HandleSubmitPendente = (uid) => {
    const user = props.Usuarios.filter(Usuario => {
      return Usuario.uid === uid
    })
    const EditedUser = { ...user[0], aprovado: false, rejeitado: false }
    EditarUsuario(EditedUser.uid, EditedUser)
    UpdateUser(EditedUser).then(() => {
      Notificar("Usuario colocado com Pendente!")
    })
  }


  return (
    <div className="Aprovacoes">

      <div className='BreadcrumbList'>
        <span onClick={e => SetTab('DashBoard')}>
          <Link to="../DashBoard">Página Inicial</Link>
        </span>
        <GoChevronRight />
        <span>
          Aprovações de Usuários
        </span>
      </div>
      <div>
        {props.UsuariosPendentes.length >= 1 && <div className='TabChamadoTituloAprovacoes'>
          <span></span>
          <h2 className="">Pendentes</h2>
        </div>}
        <Accordion>
          {props.UsuariosPendentes.map(Usuario => {
            return (
              <Accordion.Item key={nanoid(6)} eventKey={Usuario.uid}>
                <Accordion.Header>
                  <div>
                    <FaUserClock className="UsuarioPendenteIcone" />
                    {`${Usuario.nome} ${Usuario.sobrenome}`}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="aprovacaoBody">
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Nome: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.nome}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Sobrenome: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.sobrenome}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Email: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.email}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Data de Nascimento: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.nascimento}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Empresa: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.empresa}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Cidade: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.cidade}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Estado: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.estado}</span>
                        </div>

                      </ListGroup.Item>
                    </ListGroup>



                  </div>


                  <Button className='BodyButton' onClick={(e) => HandleSubmitAprovacao(Usuario.uid)} variant="success">Aprovar</Button>
                  <Button className='BodyButton' onClick={(e) => HandleSubmitRejeicao(Usuario.uid)} variant="danger">Rejeitar</Button>

                </Accordion.Body>
              </Accordion.Item>



            )


          })}

        </Accordion>



        {props.UsuariosAprovados.length >= 1 && <div className='TabChamadoTituloAprovacoes'>
          <span></span>
          <h2 className="TituloAprovacoesH2">Aprovados</h2>
        </div>
        }
        <Accordion>
          {props.UsuariosAprovados.map(Usuario => {
            return (
              <Accordion.Item key={nanoid(6)} eventKey={Usuario.uid}>
                <Accordion.Header>
                  <div>
                    <MdVerifiedUser className="UsuarioAprovadoIcone" />
                    {`${Usuario.nome} ${Usuario.sobrenome}`}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="aprovacaoBody">

                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Nome: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.nome}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Sobrenome: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.sobrenome}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Email: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.email}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Data de Nascimento: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.nascimento}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Empresa: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.empresa}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Cidade: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.cidade}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Estado: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.estado}</span>
                        </div>

                      </ListGroup.Item>
                    </ListGroup>



                  </div>


                  <Button className='BodyButton' onClick={(e) => HandleSubmitAprovacao(Usuario.uid)} variant="success">Aprovar</Button>
                  <Button className='BodyButton' onClick={(e) => HandleSubmitRejeicao(Usuario.uid)} variant="danger">Rejeitar</Button>
                  <Button className='BodyButton' onClick={(e) => HandleSubmitPendente(Usuario.uid)} variant="warning">Colocar como Pendente</Button>
                </Accordion.Body>
              </Accordion.Item>



            )


          })}

        </Accordion>




        {props.UsuariosRejeitados.length >= 1 &&
          <div className='TabChamadoTituloAprovacoes'>
            <span></span>
            <h2 className="TituloAprovacoesH2">Não Aprovados</h2>
          </div>
        }
        <Accordion>
          {props.UsuariosRejeitados.map(Usuario => {
            return (
              <Accordion.Item key={nanoid(6)} eventKey={Usuario.uid}>
                <Accordion.Header>
                  <div>
                    <FaUserTimes className="UsuarioNaoAprovadoIcone" />
                    {`${Usuario.nome} ${Usuario.sobrenome}`}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="aprovacaoBody">

                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Nome: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.nome}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Sobrenome: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.sobrenome}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Data de Nascimento: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.nascimento}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Email: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.email}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Empresa: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.empresa}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Cidade: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.cidade}</span>
                        </div>
                        <div className="AprovacaoItemList">
                          <strong>
                            <span className="AprovacaoItemTitulo">Estado: </span>
                          </strong>
                          <span className="AprovacaoItemValor">{Usuario.estado}</span>
                        </div>

                      </ListGroup.Item>
                    </ListGroup>



                  </div>


                  <Button className='BodyButton' onClick={(e) => HandleSubmitAprovacao(Usuario.uid)} variant="success">Aprovar</Button>
                  <Button className='BodyButton' onClick={(e) => HandleSubmitPendente(Usuario.uid)} variant="warning">Colocar como Pendente</Button>

                </Accordion.Body>
              </Accordion.Item>



            )


          })}

        </Accordion>

      </div>
    </div>
  );
}

const ConnectedAprovacoes = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    }),
    Usuarios: state.Usuarios,
    UsuariosPendentes: state.Usuarios.filter(UsuarioFilter => {
      return UsuarioFilter.aprovado === false && UsuarioFilter.rejeitado === false
    }),
    UsuariosAprovados: state.Usuarios.filter(UsuarioFilter => {
      return UsuarioFilter.aprovado === true && UsuarioFilter.email !== 'admin@serviceit.com'
    }),
    UsuariosRejeitados: state.Usuarios.filter(UsuarioFilter => {
      return UsuarioFilter.aprovado === false && UsuarioFilter.email !== 'admin@serviceit.com' && UsuarioFilter.rejeitado === true
    })
  }
})(Aprovacoes)

export default ConnectedAprovacoes
