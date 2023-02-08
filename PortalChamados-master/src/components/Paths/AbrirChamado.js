import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux'
import './css/AbrirChamado.css'
import { BiUserPin } from "react-icons/bi";
import { MdOutlineEmail, MdOutlinePlace, MdCategory, MdPriorityHigh, MdError, MdDescription, MdAttachFile, MdCancel } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { BsSubtract } from "react-icons/bs";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Select from 'react-select'
import { GoAlert } from "react-icons/go";
import { FaCity } from "react-icons/fa";
import { RiInformationLine, RiUserReceived2Fill, RiUserSharedFill } from "react-icons/ri";
import { FiChevronRight, FiFile } from "react-icons/fi";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineFieldNumber, AiFillCheckCircle, AiOutlineDown } from "react-icons/ai";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment'
import ListGroup from 'react-bootstrap/ListGroup';
import { v4 } from 'uuid';
import { customAlphabet } from 'nanoid'
import { useNavigate } from 'react-router-dom';
import { Notificar, AddChamado, UploadFileToFirebase, SetTab } from '../utils/Utilidades';
import { GoChevronRight } from "react-icons/go";
import Creatable from 'react-select/creatable';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Estados } from '../../Cidades';
import { MaxLengthDescChamado, MaxLengthInfoAdicionalChamado, MaxSizeAttachFile, DefaultChamado } from '../../GlobalVars';

const AbrirChamado = (props) => {

  const navigate = useNavigate();
  const nanoid = customAlphabet('1234567890', 10)




  const [Chamado, setChamado] = useState({
    ...DefaultChamado
  });


  const [Filled, setFilled] = useState(false);
  const [Solicitante, setSolicitante] = useState();
  const [CategoriaSelecionada, setCategoriaSelecionada] = useState();
  const [CategoriaSelecionadaAnterior, setCategoriaSelecionadaAnterior] = useState();
  const [Subcategoria, setSubcategoria] = useState();
  const [ListaSubcategorias, setListaSubcategorias] = useState([]);
  const [Telefone, setTelefone] = useState();
  const [Cidade, setCidade] = useState();
  const [FileToUpload, setFileToUpload] = useState();
  const [Estado, setEstado] = useState();
  const [Cenario, setCenario] = useState();
  const [Urgencia, setUrgencia] = useState();
  const [InfoAdicional, setInfoAdicional] = useState();
  const [Descricao, setDescricao] = useState(' ');
  const [ToUp, setToUp] = useState(false);
  const [show, setShow] = useState(false);
  const [ParaQuem, setParaQuem] = useState('');
  const [MensagemErroFileUpload, setMensagemErroFileUpload] = useState('');
  const [ListaEmailsUsuarios, setListaEmailsUsuarios] = useState([]);
  const [ListaNomesUsuarios, setListaNomesUsuarios] = useState([]);
  const [EmailSolicitadoPara, setEmailSolicitadoPara] = useState('');
  const [NomeSolicitadoPara, setNomeSolicitadoPara] = useState('');
  const [CidadeSolicitadoPara, setCidadeSolicitadoPara] = useState('');
  const [EstadoSolicitadoPara, setEstadoSolicitadoPara] = useState('');
  const [TelefoneSolicitadoPara, setTelefoneSolicitadoPara] = useState('');
  const [ProgressUpload, setProgressUpload] = useState(0);
  const [Uploading, setUploading] = useState(false);
  const [EstadosOpcoes, setEstadosOpcoes] = useState([]);
  const [CidadesOpcoes, setCidadesOpcoes] = useState([]);
  const InputAnexo = useRef()



  useEffect(() => {
    setSolicitante(props.Usuario)
    setEstado(props.Usuario.estado)
    setCidade(props.Usuario.cidade)
    setTelefone(props.Usuario.numero)
    if (props.Usuario.tipo === 'Cliente') {
      setParaQuem('Eu')
    }
  }, [props.Usuario]);


  useEffect(() => {
    const Emails = props.Usuarios.filter(User => User.email !== props.Usuario.email).map(User => { return { value: User.email, label: User.email } })
    const Nomes = props.Usuarios.filter(User => User.email !== props.Usuario.email).map(User => { return { value: User.nome + ' ' + User.sobrenome, label: User.nome + ' ' + User.sobrenome } })
    setListaEmailsUsuarios(Emails)
    setListaNomesUsuarios(Nomes)
  }, [props.Usuarios, props.Usuario.email]);


  const [ListaUrgencia] = useState(props.Dados.urgencia.map(item => {
    return { value: item.value, label: item.value }
  }));

  const [ListaCenario] = useState(props.Dados.cenarios.map(item => {
    return { value: item.value, label: item.value }
  }));

  const [ListaCategoria] = useState(props.Dados.categorias.map(item => {
    return { value: item.descricao, label: item.descricao }
  }));



  useEffect(() => {
    if (CategoriaSelecionada) {
      props.Dados.categorias.map(categoria => {
        if (categoria.descricao === CategoriaSelecionada) {
          var subCategorias = categoria.subCategorias.map(item => {
            return { value: item.descricao, label: item.descricao }
          })
          setListaSubcategorias(subCategorias)


          if (Subcategoria) {

            const CategoriaSelecionadaVerifica = props.Dados.categorias.find(categoria => { return categoria.descricao === CategoriaSelecionada })
            const SubDaCategoria = CategoriaSelecionadaVerifica.subCategorias.find(Sub => { return Sub.descricao === Subcategoria })

            if (!SubDaCategoria)
              setSubcategoria(subCategorias[0].value)

          }

          if (CategoriaSelecionada !== CategoriaSelecionadaAnterior) {

          }

          setCategoriaSelecionadaAnterior(CategoriaSelecionada)

        } else
          return null

        return null
      })
    }

  }, [CategoriaSelecionada, Subcategoria, props.Dados.categorias, CategoriaSelecionadaAnterior]);


  const handleAbrirChamado = () => {

    if (FileToUpload) {
      setUploading(true)
      UploadFileToFirebase(FileToUpload, `Chamados/${Chamado.ID}/${Chamado.Anexo.NomeArquivo}`, ProgressBarChange, UploadChamado)
    } else {
      handleClose()
      //console.log(Chamado)
      AddChamado(Chamado)
      Notificar('Chamado ' + Chamado.ID + ' Aberto!')
      Redirecionar()
    }

  }


  const UploadChamado = (UrlDoAnexo) => {
    Chamado.Anexo.Url = UrlDoAnexo

    const MensagemAnexo = Chamado.Andamento.Mensagens.find(Mensagem => { return Mensagem.Tipo !== 'Evento' })
    MensagemAnexo.Url = UrlDoAnexo
    const MensagensSemAnexo = Chamado.Andamento.Mensagens.filter(Mensagem => { return Mensagem.Tipo === 'Evento' })
    MensagensSemAnexo.push(MensagemAnexo)
    Chamado.Andamento.Mensagens = MensagensSemAnexo

    //console.log("UPLOAD FEITO", Chamado)
    setProgressUpload(0)
    handleClose()
    AddChamado(Chamado)
    Notificar('Chamado ' + Chamado.ID + ' Aberto!')
    Redirecionar()
    setUploading(false)

  }

  const Redirecionar = () => {
    SetTab("MeusChamados")
    navigate('../MeusChamados')
  }

  useEffect(() => {

    if (CategoriaSelecionada && Subcategoria && ToUp === false) {
      document.querySelector('.AbrirChamado').scrollTop = 0;
      setToUp(true)
    }

    if (Descricao.trim() && CategoriaSelecionada && Subcategoria && Cenario && Urgencia && Cidade && Estado && Telefone.length >= 10 && ParaQuem === 'Eu') {
      setFilled(true)
    }

    else if (Descricao.trim() && CategoriaSelecionada && Subcategoria && Cenario && Urgencia && Cidade && Estado && Telefone.length >= 10 && ParaQuem !== 'Eu' && TelefoneSolicitadoPara.length >= 10 && EmailSolicitadoPara && NomeSolicitadoPara) {
      setFilled(true)
    }

    else
      setFilled(false)

  }, [Descricao, InfoAdicional, CategoriaSelecionada, Subcategoria, Cenario, Urgencia, Cidade, Estado, Telefone, ToUp, NomeSolicitadoPara, EmailSolicitadoPara, TelefoneSolicitadoPara, ParaQuem]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    const ChamadoMontando = {
      ID: 'CHAM' + nanoid(6),
      Descricao,
      InfoAdicional: InfoAdicional || ' ',
      CategoriaSelecionada,
      Subcategoria,
      Cenario,
      Urgencia,
      Solicitante: {
        NomeSolicitante: ParaQuem === 'Eu' ? `${Solicitante.nome} ${Solicitante.sobrenome}` : NomeSolicitadoPara,
        EmailSolicitante: ParaQuem === 'Eu' ? Solicitante.email : EmailSolicitadoPara.toLocaleLowerCase(),
        Cidade: ParaQuem === 'Eu' ? Cidade : (CidadeSolicitadoPara || Cidade),
        Estado: ParaQuem === 'Eu' ? Estado : (EstadoSolicitadoPara || Estado),
        Telefone: ParaQuem === 'Eu' ? Telefone : TelefoneSolicitadoPara,
      },
      Andamento: {
        Responsavel: {
          NomeResponsavel: '',
          EmailResponsavel: '',
          AceiteEm: 0,
        },
        Mensagens: [
          {
            ID: nanoid(6),
            Tipo: 'Evento',
            Titulo: 'Abertura de Chamado',
            AutorNome: ParaQuem === 'Eu' ? `${Solicitante.nome} ${Solicitante.sobrenome}` : NomeSolicitadoPara,
            AutorEmail: ParaQuem === 'Eu' ? Solicitante.email : EmailSolicitadoPara,
            Data: moment().valueOf(),
            Mensagem: Descricao,
            Url: ''
          }
        ],
        DataHoraAbertura: moment().valueOf(),
        DataHoraConclusao: 0,
        Status: 'Aberto',
      },
      Fluxo: [
        {
          Etapa: 'Resposta',
          Inicio: moment().valueOf(),
          Final: 0,
          PorcentagemFinal: 0,
          Status: 'Aguardando'
        },
        {
          Etapa: 'Trabalho em Andamento',
          Inicio: 0,
          Final: 0,
          PorcentagemFinal: 0,
          Status: 'Não Iniciado'
        },
        {
          Etapa: 'Resolução',
          Inicio: 0,
          Final: 0,
          PorcentagemFinal: 0,
          Status: 'Sem resolução'
        },

      ],
      AberturaDeTerceiros: {
        Status: ParaQuem !== 'Eu' ? 'Sim' : 'Não',
        NomeSolicitante: ParaQuem !== 'Eu' ? `${Solicitante.nome} ${Solicitante.sobrenome}` : '',
        EmailSolicitante: ParaQuem !== 'Eu' ? Solicitante.email : '',
        Telefone: ParaQuem !== 'Eu' ? Telefone : ''
      },
      Anexo: {
        NomeArquivo: FileToUpload ? FileToUpload.name : '',
        Url: '',
        Tipo: FileToUpload ? FileToUpload.type : ''
      }

    }


    if (FileToUpload) {
      const MensagemAnexo = {
        ID: nanoid(6),
        Tipo: 'Anexo / ' + FileToUpload.type + ' Abertura',
        Titulo: 'Anexo de Arquivo',
        AutorNome: ParaQuem === 'Eu' ? `${Solicitante.nome} ${Solicitante.sobrenome}` : NomeSolicitadoPara,
        AutorEmail: ParaQuem === 'Eu' ? Solicitante.email : EmailSolicitadoPara,
        Data: moment().valueOf(),
        Mensagem: FileToUpload.name
      }

      ChamadoMontando.Andamento.Mensagens.push(MensagemAnexo)
    }

    setChamado(ChamadoMontando)
    setShow(true);
    //console.log(Chamado)

  }




  const ProgressBarChange = (progress) => {
    //console.log("Progresso", progress)
    setProgressUpload(progress)
  }


  const handleChangeEmailSolicitadoPara = (email) => {
    var UsuarioEscolhido = props.Usuarios.find(User => User.email === email)
    if (UsuarioEscolhido) {
      setEmailSolicitadoPara(UsuarioEscolhido.email)
      setNomeSolicitadoPara(UsuarioEscolhido.nome + ' ' + UsuarioEscolhido.sobrenome)
      setCidadeSolicitadoPara(UsuarioEscolhido.cidade)
      setEstadoSolicitadoPara(UsuarioEscolhido.estado)
      setTelefoneSolicitadoPara(UsuarioEscolhido.numero)
      //console.log(UsuarioEscolhido)
    } else {
      setEmailSolicitadoPara(email)
      if (props.Usuarios.find(User => User.nome + ' ' + User.sobrenome === NomeSolicitadoPara)) {
        setNomeSolicitadoPara('')
      }
    }

  }

  const handleChangeNomeSolicitadoPara = (nome) => {
    const UsuarioEscolhido = props.Usuarios.find(User => User.nome + ' ' + User.sobrenome === nome)
    if (UsuarioEscolhido) {
      setEmailSolicitadoPara(UsuarioEscolhido.email)
      setNomeSolicitadoPara(UsuarioEscolhido.nome + ' ' + UsuarioEscolhido.sobrenome)
      setCidadeSolicitadoPara(UsuarioEscolhido.cidade)
      setEstadoSolicitadoPara(UsuarioEscolhido.estado)
      setTelefoneSolicitadoPara(UsuarioEscolhido.numero)
      //console.log(UsuarioEscolhido)
    } else {
      setNomeSolicitadoPara(nome)
      if (props.Usuarios.find(User => User.email === EmailSolicitadoPara)) {
        setEmailSolicitadoPara('')
      }

    }

  }

  const handleChangNumeroSolicitadoPara = (numero) => {
    setTelefoneSolicitadoPara(numero)
  }

  const handleSetFileToUpload = (file) => {
    if (file.size <= MaxSizeAttachFile)
      setFileToUpload(file);
    else
      setMensagemErroFileUpload("O arquivo deve ter no máximo 10MB")

    setTimeout(() => { setMensagemErroFileUpload('') }, 3000);
  }


  useEffect(() => {
    setEstadosOpcoes(Estados.map(Estado => { return { value: Estado.nome, label: Estado.nome } }))
  }, []);

  useEffect(() => {
    if (Estado) {
      const EstadoEscolhido = Estados.find(EstadoMap => { return EstadoMap.nome === Estado })

      if (Cidade) {
        const CidadesDoEstado = EstadoEscolhido.cidades.map(CidadeMap => { return CidadeMap })
        const CidadeDoEstado = CidadesDoEstado.find(CidadeFilter => { return CidadeFilter === Cidade })
        if (!CidadeDoEstado)
          setCidade('')
      }

      setCidadesOpcoes(EstadoEscolhido.cidades.map(Cidade => { return { value: Cidade, label: Cidade } }))

    }
  }, [Estado, Cidade]);



  return (
    <div className="AbrirChamado">

      {Solicitante &&

        <div>
          <div className='TabChamadoTitulo tituloAberturaDeChamado'>
            <span></span>
            <h2>Reporte um Problema</h2>
          </div>

          {ParaQuem && props.Usuario.tipo !== 'Cliente' &&
            <div className='BreadcrumbList'>
              <span onClick={e => setParaQuem('')}>
                <span>Inicio</span>
              </span>
              {ParaQuem && < GoChevronRight />}

              {ParaQuem === 'Eu' &&
                <span>
                  Chamado para mim mesmo
                </span>
              }
              {ParaQuem !== 'Eu' &&
                <span>
                  Chamado para outra pessoa
                </span>
              }
            </div>
          }


          {props.Usuario.Tipo !== 'Cliente' && !ParaQuem &&
            <div className='DefinicaoSolicitante'>
              <div className='TabChamadoTituloSolicitante'>
                <span></span>
                <span>Para quem você gostaria de abrir um chamado?</span>
              </div>
              <div className='OpcoesSolicitante'>
                <button onClick={e => setParaQuem('Eu')}>
                  <RiUserReceived2Fill />
                  <span>Para mim mesmo</span>
                </button>
                <button onClick={e => setParaQuem('Outro')}>
                  <RiUserSharedFill />
                  <span>Para outra pessoa</span>
                </button>
              </div>
            </div>
          }

          {(!CategoriaSelecionada || !Subcategoria) && ParaQuem &&
            <div className='ListGroupCHamados'>
              <div className='CategoriasListGroup'>
                <ListGroup as="ul">
                  <ListGroup.Item as="li" active>
                    Categorias
                  </ListGroup.Item>

                  {ListaCategoria.map(Categoria => {
                    return <ListGroup.Item key={Categoria.label + v4()} action as="li">
                      <span className='CategoriaListItem' onClick={e => { setCategoriaSelecionada(Categoria.label); }}>
                        <span> {Categoria.label}</span>
                        {!CategoriaSelecionada && <FiChevronRight />}
                        {CategoriaSelecionada === Categoria.label && <FiChevronRight />}

                      </span>
                    </ListGroup.Item>
                  })}
                </ListGroup>
              </div>
              {CategoriaSelecionada &&
                <div className='SubCategoriaInfo'>
                  <span>Selecione uma Subcategoria</span>
                  <AiOutlineDown />
                </div>
              }
              {CategoriaSelecionada &&
                <div id='SubCategoriasListGroup2' className='SubCategoriasListGroup'>
                  <ListGroup as="ul">
                    <ListGroup.Item as="li" active>
                      Subcategorias
                    </ListGroup.Item>

                    {ListaSubcategorias.map(SubcategoriaMap => {
                      return <ListGroup.Item className='CategoriaListItem' key={SubcategoriaMap.label + v4()} onClick={e => setSubcategoria(SubcategoriaMap.label)} action as="li">
                        <span onClick={e => setSubcategoria(SubcategoriaMap.label)}>
                          {SubcategoriaMap.label}</span>
                        {!Subcategoria && <FiChevronRight />}
                        {Subcategoria === SubcategoriaMap.label && <FiChevronRight />}

                      </ListGroup.Item>
                    })}
                  </ListGroup>
                </div>
              }
            </div>
          }

          {CategoriaSelecionada && Subcategoria && ParaQuem &&
            <div className='FormWrapper'>
              <form className='AbrirChamadoForm'>
                <label>
                  <BiUserPin />
                  <span>Solicitante</span>
                </label>
                <input disabled type="text" defaultValue={`${Solicitante.nome} ${Solicitante.sobrenome}`} />

                {ParaQuem !== 'Eu' &&
                  <label className='LabelSolicitadoPara'>
                    <MdOutlineEmail />
                    <span>Nome (Solicitado Para)</span>
                  </label>
                }
                {ParaQuem !== 'Eu' &&
                  <Creatable
                    maxMenuHeight='200px'
                    className='SelectReactChamados'
                    value={{ value: NomeSolicitadoPara, label: NomeSolicitadoPara }}
                    options={ListaNomesUsuarios}
                    onChange={e => { handleChangeNomeSolicitadoPara(e.value); }} >
                  </Creatable>
                }



                <label >
                  <MdOutlineEmail />
                  <span>E-mail de Contato Solicitante</span>
                </label>
                <input disabled className='ProfileInput' type="text" defaultValue={Solicitante.email} />

                {ParaQuem !== 'Eu' &&
                  <label className='LabelSolicitadoPara'>
                    <MdOutlineEmail />
                    <span>E-mail de Contato (Solicitado Para)</span>
                  </label>
                }
                {ParaQuem !== 'Eu' &&
                  <Creatable
                    maxMenuHeight='200px'
                    className='SelectReactChamados'
                    value={{ value: EmailSolicitadoPara, label: EmailSolicitadoPara }}
                    options={ListaEmailsUsuarios}
                    onChange={e => { handleChangeEmailSolicitadoPara(e.value); }} >
                  </Creatable>
                }



                <label>
                  <BsTelephone />
                  <span>Telefone para Contato(Solicitante)</span>
                </label>

                <PhoneInput
                  inputStyle={{ width: '100%' }}
                  containerStyle={{ margin: '0', padding: '0', width: '100%', fontSize: '12px' }}
                  country={'br'}
                  value={Telefone}
                  onChange={e => setTelefone(e)}
                />


                {ParaQuem !== 'Eu' &&
                  <label className='LabelSolicitadoPara'>
                    <BsTelephone />
                    <span>Telefone de Contato (Solicitado Para)</span>
                  </label>
                }

                {ParaQuem !== 'Eu' &&
                  <PhoneInput
                    inputStyle={{ width: '100%' }}
                    containerStyle={{ margin: '0', padding: '0', width: '100%', fontSize: '12px' }}
                    country={'br'}
                    value={TelefoneSolicitadoPara}
                    onChange={e => handleChangNumeroSolicitadoPara(e)}
                  />
                }


                <div className='DoubleColumnChamado'>
                  <label>
                    <MdOutlinePlace />
                    <span>Estado</span>
                  </label>
                  <label>
                    <FaCity />
                    <span>Cidade</span>
                  </label>
                </div>

                <div className='DoubleColumnChamado'>
                  <Select
                    maxMenuHeight='120px'
                    value={{ value: Estado, label: Estado }}
                    className='SelectReactChamados' name='Estado'
                    options={EstadosOpcoes}
                    onChange={e => setEstado(e.value)}>
                  </Select>
                  <Select
                    maxMenuHeight='120px'
                    value={{ value: Cidade, label: Cidade }}
                    className='SelectReactChamados' name='Cidade'
                    options={CidadesOpcoes}
                    onChange={e => setCidade(e.value)}>
                  </Select>
                </div>

                <label>
                  <MdPriorityHigh />
                  <span>Urgencia</span>
                </label>
                <Select maxMenuHeight='120px' className='SelectReactChamados' options={ListaUrgencia} value={{ value: Urgencia, label: Urgencia }} onChange={e => setUrgencia(e.value)}></Select>



                <label>
                  <MdCategory />
                  <span>Categoria</span>
                </label>
                <Select maxMenuHeight='200px' className='SelectReactChamados' options={ListaCategoria} value={{ value: CategoriaSelecionada, label: CategoriaSelecionada }} onChange={e => { setCategoriaSelecionada(e.value); }} ></Select>


                <label>
                  <BsSubtract />
                  <span>Subcategoria</span>
                </label>
                <Select maxMenuHeight='120px' className='SelectReactChamados' options={ListaSubcategorias} value={{ value: Subcategoria, label: Subcategoria }} onChange={e => setSubcategoria(e.value)}></Select>

                <label>
                  <MdDescription />
                  <span>Descrição Curta do Problema</span>
                </label>
                <textarea maxLength={MaxLengthDescChamado} value={Descricao} onChange={e => setDescricao(e.target.value)}></textarea>

                <label>
                  <TiInfoOutline />
                  <span>Cenário</span>
                </label>
                <Select maxMenuHeight='120px' className='SelectReactChamados' options={ListaCenario} value={{ value: Cenario, label: Cenario }} onChange={e => setCenario(e.value)}></Select>

                <label>
                  <RiInformationLine />
                  <span>Informações Adicionais</span>
                </label>
                <textarea maxLength={MaxLengthInfoAdicionalChamado} placeholder='Opcional' value={InfoAdicional} onChange={e => setInfoAdicional(e.target.value)}></textarea>


                <div className='Anexo'>
                  {MensagemErroFileUpload && <span className='UploadErro'> <GoAlert /> {MensagemErroFileUpload}</span>}
                  <label className='AnexoLabel' >
                    <MdAttachFile />
                    <span> Anexar Arquivo</span>
                    <input ref={InputAnexo} type="file" id='AnexoChamado' onChange={(event) => { handleSetFileToUpload(event.target.files[0]); }} />
                  </label>
                  {FileToUpload &&
                    <span className='FliesToUpload'>
                      <FiFile />
                      <span> {FileToUpload.name} </span>
                      <MdCancel className='CancellUpload' onClick={e => { setFileToUpload(); InputAnexo.current.value = '' }} />
                    </span>}
                </div>


                <label>
                  <BsSubtract />
                  <span>LGPD - Lei Geral de Proteção de Dados (Lei 13.709, de 2018)</span>
                </label>
                <p className='AlertaLei'>De acordo com os requerimentos de conformidade com as Leis de Privacidade e Proteção de Dados vigentes nos países onde a ServiceIT opera,
                  ao preencher o formulário de abertura de chamado com dados pessoais, você está ciente e concorda com o fornecimento do uso dos dados encaminhados.
                  Esses dados serão única e exclusivamente utilizados pela ServiceIT, como controladora de dados, para fins de atendimento da demanda recebida através da Central de Atendimento do Serviços Compartilhados.
                  Para obter informações detalhadas sobre o tratamento de dados pessoais da ServiceIT, consulte a Política de Privacidade da ServiceIT,
                  disponível no site da ServiceIT ou entrando em contato diretamente com a ServiceIT através do e-mail data_protection@ServiceIT.com.
                  A Política de Privacidade contém informações sobre os direitos dos titulares de dados pessoais. Se desejado, posteriormente,
                  poderá exercer seus direitos de acesso, retificação, cancelamento e oposição garantidos pelas Leis de Proteção de Dados aplicáveis.
                </p>

                <div>
                  <Button onClick={handleShow} className='AbrirChamadoButton' variant="primary" size="md" disabled={!Filled}>
                    Submeter
                  </Button>
                </div>



                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      <p className='ModalHeader'>Reportando um problema</p>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='ModalBody'>
                      <div className='BodyRow'>
                        <AiOutlineFieldNumber />
                        <span className='TituloBodyRow'>Número: </span>
                        <span className='TextoBodyRow'>{Chamado.ID}</span>
                      </div>
                      <div className='BodyRow'>
                        <BiUserPin />
                        <span className='TituloBodyRow'>Solicitante: </span>
                        <span className='TextoBodyRow'>{Chamado.Solicitante.NomeSolicitante}</span>
                      </div>
                      <div className='BodyRow'>
                        <MdOutlineEmail />
                        <span className='TituloBodyRow'>E-mail de Contato: </span>
                        <span className='TextoBodyRow' >{Chamado.Solicitante.EmailSolicitante}</span>
                      </div>
                      <div className='BodyRow'>
                        <BsTelephone />
                        <span className='TituloBodyRow'>Telefone para Contado(Solicitante): </span>
                        <span className='TextoBodyRow' >{Chamado.Solicitante.Telefone}</span>
                      </div>
                      <div className='BodyRow'>
                        <MdOutlinePlace />
                        <span className='TituloBodyRow'>Estado: </span>
                        <span className='TextoBodyRow' >{Chamado.Solicitante.Estado}</span>
                      </div>
                      <div className='BodyRow'>
                        <FaCity />
                        <span className='TituloBodyRow'>Cidade: </span>
                        <span className='TextoBodyRow' >{Chamado.Solicitante.Cidade}</span>
                      </div>
                      <div className='BodyRow'>
                        <MdPriorityHigh />
                        <span className='TituloBodyRow'>Urgencia: </span>
                        <span className='TextoBodyRow' >{Chamado.Urgencia}</span>
                      </div>
                      <div className='BodyRow'>
                        <MdCategory />
                        <span className='TituloBodyRow'>Categoria: </span>
                        <span className='TextoBodyRow' >{Chamado.CategoriaSelecionada}</span>
                      </div>
                      <div className='BodyRow'>
                        <BsSubtract />
                        <span className='TituloBodyRow'>Subcategoria: </span>
                        <span className='TextoBodyRow' >{Chamado.Subcategoria}</span>
                      </div>
                      <div className='BodyRow'>
                        <MdDescription />
                        <span className='TituloBodyRow'>Descrição do Problema: </span>
                        <span className='TextoBodyRow' >{Chamado.Descricao}</span>
                      </div>
                      <div className='BodyRow'>
                        <TiInfoOutline />
                        <span className='TituloBodyRow'>Canário: </span>
                        <span className='TextoBodyRow' >{Chamado.Cenario}</span>
                      </div>
                      <div className='BodyRow'>
                        <RiInformationLine />
                        <span className='TituloBodyRow'>Informações Adicionais: </span>
                        <span className='TextoBodyRow' >{Chamado.InfoAdicional}</span>
                      </div>
                      <div className='BodyRow'>
                        <MdAttachFile />
                        <span className='TituloBodyRow'>Anexo: </span>
                        <span className='TextoBodyRow' >{FileToUpload ? FileToUpload.name : 'Nenhum'}</span>
                      </div>

                      {Uploading &&
                        <div className='BodyRow'>
                          <ProgressBar now={ProgressUpload} label={`${ProgressUpload}%`} />
                        </div>
                      }





                      {ParaQuem !== 'Eu' &&
                        <div className='SolicitadoParaBodyRow'>
                          <span className='TextoBodyRowTerceiros'>Informações de quem está solicitando: </span>
                          <div className='BodyRow'>
                            <MdOutlineEmail />
                            <span className='TituloBodyRow'>E-mail (Solicitado Para): </span>
                            <span className='TextoBodyRow' >{Chamado.AberturaDeTerceiros.EmailSolicitante}</span>
                          </div>
                          <div className='BodyRow'>
                            <BiUserPin />
                            <span className='TituloBodyRow'>Nome (Solocitado para): </span>
                            <span className='TextoBodyRow'>{Chamado.AberturaDeTerceiros.NomeSolicitante}</span>
                          </div>
                          <div className='BodyRow'>
                            <BsTelephone />
                            <span className='TituloBodyRow'>Telefone para Contado(Solicitante): </span>
                            <span className='TextoBodyRow' >{Chamado.AberturaDeTerceiros.Telefone}</span>
                          </div>

                        </div>

                      }


                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAbrirChamado}>
                      Enviar
                    </Button>
                  </Modal.Footer>
                </Modal>


              </form>






              <div className='SubmitFormAddChamado'>
                <Button onClick={handleShow} className='AbrirChamadoButton' variant="primary" size="md" disabled={!Filled}>
                  Submeter
                </Button>
                <div className='InfoPendente'>
                  <span className='InfoPendenteHeader'>Informações necessárias:</span>
                  <span>{Solicitante.nome ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Nome          </span>

                  {ParaQuem !== 'Eu' && <span>{NomeSolicitadoPara ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Nome  (Solicitado Para)        </span>}

                  <span>{Solicitante.email ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Email          </span>

                  {ParaQuem !== 'Eu' && <span>{EmailSolicitadoPara ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Email (Solicitado Para)       </span>}

                  <span>{Telefone.length >= 10 ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Telefone  </span>

                  {ParaQuem !== 'Eu' && <span>{TelefoneSolicitadoPara.length >= 10 ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Telefone(Solicitado Para)       </span>}

                  <span>{Cidade ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Cidade          </span>
                  <span>{Estado ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Estado          </span>
                  <span>{CategoriaSelecionada ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Categoria          </span>
                  <span>{Subcategoria ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Subcategoria          </span>

                  <span>{Cenario ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Cenario          </span>
                  <span>{Urgencia ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Urgência          </span>
                  <span>{Descricao.trim() ? <AiFillCheckCircle className='CheckedInfoPendente' /> : <MdError className='UncheckedInfoPendente' />} Descricao          </span>


                </div>
              </div>

            </div>
          }



        </div>

      }

    </div >
  );
}

const ConnectedAbrirChamado = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    }),
    Dados: state.Dados,
    Usuarios: state.Usuarios
  }
})(AbrirChamado)

export default ConnectedAbrirChamado

