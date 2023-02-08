import React, { useState, useEffect, useRef } from 'react'
import './css/Chamado.css'
import { connect } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { GoChevronRight } from "react-icons/go";
import { FaUserAlt, FaTrashAlt, FaUserPlus } from "react-icons/fa";
import { Link } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert';
import moment from 'moment'
import { customAlphabet } from 'nanoid'
import { AiOutlineFieldNumber, AiFillCheckCircle, AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { FaCity } from "react-icons/fa";
import { BiUserPin, BiRun, BiCheckDouble } from "react-icons/bi";
import { BsSubtract, BsClockFill, BsTelephone } from "react-icons/bs";
import { TiInfoOutline } from "react-icons/ti";
import { HiOutlineRefresh } from "react-icons/hi";
import { RiInformationLine } from "react-icons/ri";
import { MdOutlineEmail, MdPriorityHigh, MdCategory, MdOutlinePlace, MdDescription, MdSend, MdCancel, MdEdit, MdAttachFile } from "react-icons/md";
import { SetTab, Notificar, SetChamados, UpdateChamado, GetChamados, UploadFileToFirebase, DeleteFile } from '../utils/Utilidades';
//import { InitListeningChamado } from '../utils/Utilidades';
import { Oval } from 'react-loader-spinner'
import { emailADM, LoadingTime, DropAbertoStyle, DropFechadoStyle, DropInfoAbertoStyle, DropInfoFechadoStyle, DisplayFlex, DisplayNone, DisplayGrid, MaxSizeAttachFile } from '../../GlobalVars'
import ProgressBar from 'react-bootstrap/ProgressBar';

const Chamado = (props) => {

    const [InitialLoading, setInitialLoading] = useState(false);

    setTimeout(() => {
        setInitialLoading(true)
    }, LoadingTime);



    const nanoid = customAlphabet('1234567890', 10)

    const [Chamado, setChamado] = useState({});
    const [Solicitante, setSolicitante] = useState({});
    const [Responsavel, setResponsavel] = useState({});
    const [AberturaDeTerceiros, setAberturaDeTerceiros] = useState({});
    const [, setAndamento] = useState({});
    const navigate = useNavigate();
    const { ID } = useParams()
    const [ChamadoStatus, setChamadoStatus] = useState('');
    const [ComentarioStatus, setComentarioStatus] = useState('');
    const [ChamadoStatusNext, setChamadoStatusNext] = useState('');
    const [Mensagem, setMensagem] = useState('');
    const [HorarioAtualizado, setHorarioAtualizado] = useState(moment().valueOf());
    const [MensagensEventos, setMensagensEventos] = useState([]);
    const [ChamadoFluxo, setChamadoFluxo] = useState([]);
    var NovoEvento
    const [ProgressUpload, setProgressUpload] = useState(0);
    const [NextStatusPLaceholder, setNextStatusPLaceholder] = useState('');
    const [NextStatusFormVisible, setNextStatusFormVisible] = useState(false);
    const InputAnexo = useRef()
    const [MensagemPlaceholder, setMensagemPlaceholder] = useState('Enviar Mensagem');
    const [Listening, setListening] = useState(false);
    const EnviarMensagemRef = useRef()



    const getNextStatus = (StatusAtual) => {
        if (StatusAtual === 'Aberto') {
            return [
                <option value="Aberto" key={nanoid(6)}>Aberto</option>,
                <option value="Em Andamento" key={nanoid(6)}>Em Andamento</option>,
                <option value="Concluído" key={nanoid(6)}>Concluído</option>,
                <option value="Cancelado" key={nanoid(6)}>Cancelado</option>
            ]
        } else if (StatusAtual === 'Em Andamento') {
            return [
                <option value="Em Andamento" key={nanoid(6)}>Em Andamento</option>,
                <option value="Concluído" key={nanoid(6)}>Concluído</option>,
                <option value="Cancelado" key={nanoid(6)}>Cancelado</option>
            ]
        } else {
            return [
                <option value={ChamadoStatus} key={nanoid(6)}>{ChamadoStatus}</option>
            ]
        }
    }

    const getStatusSelectState = (StatusAtual, UsuarioLogado) => {
        if (

            ((StatusAtual === 'Cancelado' || StatusAtual === 'Concluído') || Responsavel.AceiteEm === 0)

            || UsuarioLogado.tipo === 'Cliente'

            || Responsavel.EmailResponsavel !== UsuarioLogado.email) {
            return true
        } else {
            return false
        }
    }


    useEffect(() => {
        if (ChamadoStatusNext && ChamadoStatusNext !== ChamadoStatus) {
            if (ChamadoStatusNext === 'Em Andamento') {
                setNextStatusPLaceholder('Comentário ao Cliente')
                setComentarioStatus('')
                setNextStatusFormVisible(true)
            } else if (ChamadoStatusNext === 'Concluído') {
                setNextStatusPLaceholder('Comentário de Resolução')
                setComentarioStatus('')
                setNextStatusFormVisible(true)
            } else if (ChamadoStatusNext === 'Cancelado') {
                setNextStatusPLaceholder('Motivo do Cancelamento')
                setComentarioStatus('')
                setNextStatusFormVisible(true)
            }
        } else {
            setNextStatusFormVisible(false)
        }
    }, [ChamadoStatusNext, ChamadoStatus]);


    useEffect(() => {
        const ChamadoFilter = props.ChamadosState.filter(Chamado => {
            if (props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM)
                return Chamado.ID === ID
            else
                return Chamado.ID === ID && Chamado.Solicitante.EmailSolicitante === props.LoggedUser.email
        })
        if (ChamadoFilter.length >= 1) {
            if (!Listening) {
                setListening(true)
                // PARA DESATIVAR O REAL TIME DATABASE BASTA COMENTAR A LINHA ABAIXO
                //const unsub = InitListeningChamado(ChamadoFilter[0].docID)
            }
            setChamado(ChamadoFilter[0])
            setChamadoFluxo(ChamadoFilter[0].Fluxo)
            setSolicitante(ChamadoFilter[0].Solicitante)
            setResponsavel(ChamadoFilter[0].Andamento.Responsavel)
            setAndamento(ChamadoFilter[0].Andamento)
            setChamadoStatus(ChamadoFilter[0].Andamento.Status)
            setAberturaDeTerceiros(ChamadoFilter[0].AberturaDeTerceiros)
            setMensagensEventos(
                ChamadoFilter[0].Andamento.Mensagens.sort((a, b) => {
                    return a.Data < b.Data ? 1 : -1
                })
            )
        }
        else
            setTimeout(() => {
                navigate("../DashBoard")
            }, 1500);
    }, [ID, props.ChamadosState, navigate, Listening, props.LoggedUser.email, props.Usuario.email, props.Usuario.tipo]);






    const AtualizaDadosDaPagina = () => {
        const ChamadoFilter = props.ChamadosState.filter(Chamado => {
            if (props.Usuario.tipo === 'Solucionador' || props.Usuario.email === emailADM)
                return Chamado.ID === ID
            else
                return Chamado.ID === ID && Chamado.Solicitante.EmailSolicitante === props.LoggedUser.email
        })
        if (ChamadoFilter.length >= 1) {
            setChamado(ChamadoFilter[0])
            setChamadoFluxo(ChamadoFilter[0].Fluxo)
            setSolicitante(ChamadoFilter[0].Solicitante)
            setResponsavel(ChamadoFilter[0].Andamento.Responsavel)
            setAndamento(ChamadoFilter[0].Andamento)
            setChamadoStatus(ChamadoFilter[0].Andamento.Status)
            setAberturaDeTerceiros(ChamadoFilter[0].AberturaDeTerceiros)
            setMensagensEventos(
                ChamadoFilter[0].Andamento.Mensagens.sort((a, b) => {
                    return a.Data < b.Data ? 1 : -1
                })
            )
        }
    }





    const getCurrentTab = () => {
        switch (props.LoggedUser.CurrentSidebarTab) {
            case 'MeusChamados':
                return 'Meus Chamados'
            case 'TodosChamados':
                return 'Todos Chamados'
            case 'AtribuidosAMim':
                return 'Atribuidos A Mim'
            case 'ChamadosAbertos':
                return 'Chamados Abertos'
            default:
                return 'Todos Chamados'
        }
    }


    const HandleSendMessage = (e) => {
        e.preventDefault()
        if (Mensagem.trim() && !FileToUpload) {
            const NovaMensagem = {
                ID: nanoid(6),
                Tipo: 'Mensagem',
                Titulo: Mensagem,
                AutorNome: `${props.Usuario.nome} ${props.Usuario.sobrenome}`,
                AutorEmail: props.Usuario.email,
                Data: moment().valueOf(),
                Mensagem: ''
            }

            const Chamados = [...props.ChamadosState]
            const ChamadoAtual = Chamados.find(Chamado => { return Chamado.ID === ID })
            ChamadoAtual.Andamento.Mensagens.push(NovaMensagem)
            const NovosChamados = Chamados.filter(Chamado => {
                return Chamado.ID !== ID
            })
            NovosChamados.push(ChamadoAtual)


            const IndexChamado = NovosChamados.findIndex(Chamado => { return Chamado.ID === ChamadoAtual.ID })
            const IndexResposta = NovosChamados[IndexChamado].Fluxo.findIndex(Fluxo => { return Fluxo.Etapa === 'Resposta' })
            const IndexAndamento = NovosChamados[IndexChamado].Fluxo.findIndex(Fluxo => { return Fluxo.Etapa === 'Trabalho em Andamento' })

            //console.log(NovosChamados[IndexChamado].Fluxo[IndexResposta].Status)

            if (props.Usuario.Tipo !== 'Cliente' && NovosChamados[IndexChamado].Fluxo[IndexResposta].Status === 'Aguardando') {
                //Atualizando Resposta
                NovosChamados[IndexChamado].Fluxo[IndexResposta].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexResposta].Status = 'Completa'

                //Atualizando Trabalho em Andamento 
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Inicio = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Em execução'
            }

            SetChamados(NovosChamados)
            Notificar('Mensagem Adicionada!')
            UpdateChamado(ChamadoAtual)
            setMensagem('')
            AtualizaDadosDaPagina()
        } else if (Mensagem.trim() && FileToUpload) {
            const NovaMensagem = {
                ID: nanoid(6),
                Tipo: 'Anexo / ' + FileToUpload.type,
                Titulo: 'Anexo de Arquivo',
                AutorNome: `${props.Usuario.nome} ${props.Usuario.sobrenome}`,
                AutorEmail: props.Usuario.email,
                Data: moment().valueOf(),
                Mensagem: FileToUpload.name,
                Url: ''
            }

            const Chamados = [...props.ChamadosState]
            const ChamadoAtual = Chamados.find(Chamado => { return Chamado.ID === ID })
            ChamadoAtual.Andamento.Mensagens.push(NovaMensagem)
            const NovosChamados = Chamados.filter(Chamado => { return Chamado.ID !== ID })



            setUploading(true)

            UploadFileToFirebase(FileToUpload, `Chamados/${Chamado.ID}/Mensagens/${NovaMensagem.ID}/${FileToUpload.name}`, ProgressBarChange,
                (URL) => {
                    //console.log("NOVOS", NovosChamados)
                    const MensagemSemUrl = ChamadoAtual.Andamento.Mensagens.find(Mensagem => { return Mensagem.Titulo === 'Anexo de Arquivo' && Mensagem.Url === '' })
                    MensagemSemUrl.Url = URL
                    NovosChamados.push(ChamadoAtual)

                    const IndexChamado = NovosChamados.findIndex(Chamado => { return Chamado.ID === ChamadoAtual.ID })
                    const IndexResposta = NovosChamados[IndexChamado].Fluxo.findIndex(Fluxo => { return Fluxo.Etapa === 'Resposta' })
                    const IndexAndamento = NovosChamados[IndexChamado].Fluxo.findIndex(Fluxo => { return Fluxo.Etapa === 'Trabalho em Andamento' })

                    if (props.Usuario.Tipo !== 'Cliente' && NovosChamados[IndexChamado].Fluxo[IndexResposta].Status === 'Aguardando') {
                        //Atualizando Resposta
                        NovosChamados[IndexChamado].Fluxo[IndexResposta].Final = moment().valueOf()
                        NovosChamados[IndexChamado].Fluxo[IndexResposta].Status = 'Completa'

                        //Atualizando Trabalho em Andamento 
                        NovosChamados[IndexChamado].Fluxo[IndexAndamento].Inicio = moment().valueOf()
                        NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Em execução'
                    }

                    EnviarMensagemComAnexo(NovosChamados, ChamadoAtual)
                }
            )

        }
    }


    const ProgressBarChange = (progress) => {
        setProgressUpload(progress)
    }

    const EnviarMensagemComAnexo = (NovosChamados, ChamadoAtual) => {
        //console.log(NovosChamados)
        SetChamados(NovosChamados)
        Notificar('Mensagem Adicionada!')
        UpdateChamado(ChamadoAtual)
        setMensagem('')
        AtualizaDadosDaPagina()
        setMensagem('')
        setFileToUpload()
        setUploading(false)
    }

    const handleDeleteMensagem = (MensagemID) => {

        const Chamados = [...props.ChamadosState]
        const ChamadoAtual = Chamados.find(Chamado => { return Chamado.ID === ID })
        const MensagemPraApagar = ChamadoAtual.Andamento.Mensagens.filter(Mensagem => { return Mensagem.ID === MensagemID })[0]
        const NovasMensagens = ChamadoAtual.Andamento.Mensagens.filter(Mensagem => { return Mensagem.ID !== MensagemID })
        ChamadoAtual.Andamento.Mensagens = [...NovasMensagens]
        const NovosChamados = Chamados.filter(Chamado => { return Chamado.ID !== ID })
        NovosChamados.push(ChamadoAtual)

        //console.log(MensagemPraApagar)

        if (MensagemPraApagar.Tipo.includes("Anexo") && !MensagemPraApagar.Tipo.includes("Abertura")) {
            DeleteFile(`Chamados/${ID}/Mensagens/${MensagemPraApagar.ID}/${MensagemPraApagar.Mensagem}`).then(() => {
                SetChamados(NovosChamados)
                Notificar('Mensagem Apagada!')
                UpdateChamado(ChamadoAtual)
                setMensagem('')
                AtualizaDadosDaPagina()
            }).catch((error) => {
                //console.log(error)
            });
        } else if (MensagemPraApagar.Tipo.includes("Anexo") && MensagemPraApagar.Tipo.includes("Abertura")) {
            DeleteFile(`Chamados/${ID}/${MensagemPraApagar.Mensagem}`).then(() => {
                ChamadoAtual.Anexo.NomeArquivo = ''
                ChamadoAtual.Anexo.Url = ''
                ChamadoAtual.Anexo.Tipo = ''
                SetChamados(NovosChamados)
                Notificar('Mensagem Apagada!')
                UpdateChamado(ChamadoAtual)
                setMensagem('')
                AtualizaDadosDaPagina()
            }).catch((error) => {
                //console.log(error)
            });
        }

        else {
            SetChamados(NovosChamados)
            Notificar('Mensagem Apagada!')
            UpdateChamado(ChamadoAtual)
            setMensagem('')
            AtualizaDadosDaPagina()
        }



        /*
        SetChamados(NovosChamados)
        Notificar('Mensagem Apagada!')
        UpdateChamado(ChamadoAtual)
        setMensagem('')
        AtualizaDadosDaPagina()
        */

    }


    function msToHMS(duration) {

        var seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)));

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }
















    const handleChangeStatusChamado = (e) => {
        e.preventDefault()



        if (ComentarioStatus.trim()) {
            if (ChamadoStatusNext === 'Em Andamento') {
                NovoEvento = {
                    ID: nanoid(6),
                    Tipo: 'Evento',
                    Titulo: 'Inicio de Atendimento',
                    AutorNome: `${props.Usuario.nome} ${props.Usuario.sobrenome}`,
                    AutorEmail: props.Usuario.email,
                    Data: moment().valueOf(),
                    Mensagem: ComentarioStatus
                }

            }

            if (ChamadoStatusNext === 'Cancelado') {
                NovoEvento = {
                    ID: nanoid(6),
                    Tipo: 'Evento',
                    Titulo: 'Cancelamento de Chamado',
                    AutorNome: `${props.Usuario.nome} ${props.Usuario.sobrenome}`,
                    AutorEmail: props.Usuario.email,
                    Data: moment().valueOf(),
                    Mensagem: ComentarioStatus
                }
            }

            if (ChamadoStatusNext === 'Concluído') {
                NovoEvento = {
                    ID: nanoid(6),
                    Tipo: 'Evento',
                    Titulo: 'Conclusão de Chamado',
                    AutorNome: `${props.Usuario.nome} ${props.Usuario.sobrenome}`,
                    AutorEmail: props.Usuario.email,
                    Data: moment().valueOf(),
                    Mensagem: ComentarioStatus
                }
            }


            const Chamados = [...props.ChamadosState]
            const ChamadoAtual = Chamados.find(Chamado => { return Chamado.ID === ID })
            ChamadoAtual.Andamento.Mensagens.push(NovoEvento)
            ChamadoAtual.Andamento.Status = ChamadoStatusNext
            const NovosChamados = Chamados.filter(Chamado => { return Chamado.ID !== ID })
            NovosChamados.push(ChamadoAtual)


            const IndexChamado = NovosChamados.findIndex(Chamado => { return Chamado.ID === ChamadoAtual.ID })




            const IndexResposta = NovosChamados[IndexChamado].Fluxo.findIndex(Fluxo => { return Fluxo.Etapa === 'Resposta' })
            const IndexAndamento = NovosChamados[IndexChamado].Fluxo.findIndex(Fluxo => { return Fluxo.Etapa === 'Trabalho em Andamento' })
            const IndexResolucao = NovosChamados[IndexChamado].Fluxo.findIndex(Fluxo => { return Fluxo.Etapa === 'Resolução' })



            if (ChamadoStatusNext === 'Em Andamento') {
                //Atualizando Resposta
                NovosChamados[IndexChamado].Fluxo[IndexResposta].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexResposta].Status = 'Completa'

                //Atualizando Trabalho em Andamento 
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Inicio = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Em execução'

            } else if (ChamadoStatusNext === 'Cancelado' && ChamadoStatus === 'Aberto') {

                //Atualizando Trabalho em Andamento 
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Finalizado'

                //Atualizando Resposta
                NovosChamados[IndexChamado].Fluxo[IndexResposta].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexResposta].Status = 'Completa'

                //Atualizando Trabalho em Andamento 
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Inicio = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Não executado'

                //Atualizando Solução 
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Inicio = NovosChamados[IndexChamado].Fluxo[IndexResposta].Inicio
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Status = 'Chamado Cancelado'

            } else if (ChamadoStatusNext === 'Cancelado' && ChamadoStatus !== 'Aberto') {

                //Atualizando Trabalho em Andamento 
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Finalizado'

                //Atualizando Solução 
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Inicio = NovosChamados[IndexChamado].Fluxo[IndexResposta].Inicio
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Status = 'Chamado Cancelado'

            } else if (ChamadoStatusNext === 'Concluído' && ChamadoStatus === 'Aberto') {
                //Atualizando Trabalho em Andamento 
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Finalizado'

                //Atualizando Resposta
                NovosChamados[IndexChamado].Fluxo[IndexResposta].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexResposta].Status = 'Completa'

                //Atualizando Trabalho em Andamento 
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Inicio = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Não executado'

                //Atualizando Solução 
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Inicio = NovosChamados[IndexChamado].Fluxo[IndexResposta].Inicio
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Status = 'Solucionado'

            } else if (ChamadoStatusNext === 'Concluído' && ChamadoStatus !== 'Aberto') {
                //Atualizando Trabalho em Andamento 
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexAndamento].Status = 'Finalizado'

                //Atualizando Solução 
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Inicio = NovosChamados[IndexChamado].Fluxo[IndexResposta].Inicio
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Final = moment().valueOf()
                NovosChamados[IndexChamado].Fluxo[IndexResolucao].Status = 'Solucionado'

            }


            setComentarioStatus('')
            setNextStatusFormVisible(false)
            setNextStatusPLaceholder('')


            SetChamados(NovosChamados)
            Notificar('Status Alterado!')
            UpdateChamado(ChamadoAtual)
            AtualizaDadosDaPagina()

        }
    }








    const getMensagemDisabled = (UsuarioLogado) => {
        if ((Responsavel.EmailResponsavel === UsuarioLogado.email || Solicitante.EmailSolicitante === UsuarioLogado.email) && !FileToUpload) {
            if (MensagemPlaceholder !== "Enviar Mensagem")
                setMensagemPlaceholder("Enviar Mensagem")
            return false
        }

        else {
            if (MensagemPlaceholder !== "Para enviar mensagens é necessário estar associado ao chamado")
                setMensagemPlaceholder("Para enviar mensagens é necessário estar associado ao chamado")
            return true
        }

    }





    const AtribuirChamado = () => {

        NovoEvento = {
            ID: nanoid(6),
            Tipo: 'Evento',
            Titulo: 'Atribuição de Chamado',
            AutorNome: `${props.Usuario.nome} ${props.Usuario.sobrenome}`,
            AutorEmail: props.Usuario.email,
            Data: moment().valueOf(),
            Mensagem: ''
        }

        const Chamados = [...props.ChamadosState]
        const ChamadoAtual = Chamados.find(Chamado => { return Chamado.ID === ID })
        ChamadoAtual.Andamento.Mensagens.push(NovoEvento)
        ChamadoAtual.Andamento.Responsavel.AceiteEm = moment().valueOf()
        ChamadoAtual.Andamento.Responsavel.NomeResponsavel = `${props.Usuario.nome} ${props.Usuario.sobrenome}`
        ChamadoAtual.Andamento.Responsavel.EmailResponsavel = props.Usuario.email


        const NovosChamados = Chamados.filter(Chamado => { return Chamado.ID !== ID })
        NovosChamados.push(ChamadoAtual)
        SetChamados(NovosChamados)
        Notificar('Chamado Atribuido!')
        UpdateChamado(ChamadoAtual)

        AtualizaDadosDaPagina()
    }


    setInterval(function () {
        setHorarioAtualizado(moment().valueOf())
    }, 3000);


    const [MensagensDropdown, setMensagensDropdown] = useState(true);
    const [InfoDropdown, setInfoDropdown] = useState(true);
    const [FluxoDropDown, setFluxoDropDown] = useState(true);
    const [ResponsavelDropDown, setResponsavelDropDown] = useState(true);
    const [StatusDropDown, setStatusDropDown] = useState(true);
    const [FileToUpload, setFileToUpload] = useState();
    const [Uploading, setUploading] = useState(false);

    const ToggleMensagensDropdown = () => {
        setMensagensDropdown(!MensagensDropdown)
    }

    const ToggleInfoDropdown = () => {
        setInfoDropdown(!InfoDropdown)
    }

    const ToggleFluxoDropDown = () => {
        setFluxoDropDown(!FluxoDropDown)
    }

    const ToggleStatusDropDown = () => {
        setStatusDropDown(!StatusDropDown)
    }

    const ToggleResponsavelDropDown = () => {
        setResponsavelDropDown(!ResponsavelDropDown)
    }


    const handleSetFileToUpload = (file) => {
        if (file.size <= MaxSizeAttachFile) {
            setFileToUpload(file);
            setMensagem(file.name)
        }

        else
            alert("O arquivo deve ter no máximo 10MB")


    }



    const CancelarUpload = () => {
        //console.log("CANCELANDO")
        setFileToUpload();
        InputAnexo.current.value = null;
        setMensagem('')
    }

    return (
        <div className='Chamado'>

            {InitialLoading && <div>

                <div className='BreadcrumbList'>
                    <span onClick={e => SetTab('DashBoard')}>
                        <Link to="../DashBoard">Página Inicial</Link>
                    </span>
                    <GoChevronRight />
                    <span>
                        <Link to={"../" + props.LoggedUser.CurrentSidebarTab} >{getCurrentTab()}</Link>
                    </span>
                    <GoChevronRight />
                    <span >
                        {Chamado.ID}
                    </span>



                </div>


                <div className='ChamadoWrap'>
                    <div className='ColunaChamado'>
                        <div className='ChamadoLayout'>
                            <div className='ChamadoHeader'>
                                {!Uploading &&
                                    <span onClick={ToggleMensagensDropdown}>
                                        {Chamado.Descricao}
                                    </span>
                                }
                                {Uploading &&
                                    <div className='BarraDeProgressoMensagem'>
                                        <ProgressBar now={ProgressUpload} label={`${ProgressUpload}%`} />
                                    </div>
                                }
                                <div>
                                    <HiOutlineRefresh onClick={GetChamados} />
                                    {!MensagensDropdown && <AiOutlineCaretDown onClick={ToggleMensagensDropdown} />}
                                    {MensagensDropdown && <AiOutlineCaretUp onClick={ToggleMensagensDropdown} />}
                                </div>

                            </div>
                            <div className='ChamadoBody' style={MensagensDropdown ? DropAbertoStyle : DropFechadoStyle}>
                                <div className='EnviarMensagem'>
                                    <form onSubmit={HandleSendMessage}>
                                        <input ref={EnviarMensagemRef} disabled={getMensagemDisabled(props.Usuario)} value={Mensagem} onChange={e => setMensagem(e.target.value)} type="text" placeholder={MensagemPlaceholder} />


                                        <div>
                                            <label className='AnexoLabelMensagem' >
                                                <MdAttachFile />
                                                <input type="file" ref={InputAnexo} id='AnexoMensagem' onChange={(event) => { handleSetFileToUpload(event.target.files[0]); }} />
                                            </label>
                                            {FileToUpload && <MdCancel className='CancellUpload' onClick={CancelarUpload} />}
                                        </div>
                                        <button>
                                            Enviar
                                            <MdSend />
                                        </button>
                                    </form>
                                </div>
                                <div className='Mensagens'>
                                    {MensagensEventos.map((Evento, i) => {
                                        return <div key={"Mensagem" + i} className={` ${Evento.AutorEmail === props.LoggedUser.email ? 'MyMessage' : 'OtherMessage'}`}>
                                            {Evento.AutorEmail === props.LoggedUser.email && Evento.Tipo !== 'Evento' && <FaTrashAlt onClick={e => handleDeleteMensagem(Evento.ID)} className='TrashDeleteMessage' />}


                                            {Evento.Tipo.includes("Anexo") && Evento.Tipo.includes("image") &&
                                                <div className='Mensagem'>
                                                    <span className='ChamadoTitulo'>{Evento.Titulo}</span>
                                                    <span className='ChamadoMensagemImagem'>
                                                        <a className='LinkArquivoAnexo' rel="noreferrer" download target="_blank" href={Evento.Url}>
                                                            <img className='ImagemAnexoMensagem' src={Evento.Url} alt="Anexo Imagem" />
                                                        </a>
                                                    </span>

                                                    <span className='ChamadoAutorNome'>
                                                        <FaUserAlt />
                                                        <span>
                                                            {Evento.AutorNome}
                                                        </span>
                                                    </span>
                                                    <span className='ChamadoData'>
                                                        <BsClockFill />
                                                        <span>
                                                            {moment(Evento.Data).format("DD/MM/YY HH:mm")}
                                                        </span>
                                                    </span>

                                                </div>
                                            }

                                            {Evento.Tipo.includes("Anexo") && !Evento.Tipo.includes("image") &&
                                                <div className='Mensagem'>
                                                    <span className='ChamadoTitulo'>{Evento.Titulo}</span>
                                                    <span className='ChamadoMensagem'>
                                                        <a className='LinkArquivoAnexo' rel="noreferrer" download target="_blank" href={Evento.Url}>{Evento.Mensagem}</a>
                                                    </span>

                                                    <span className='ChamadoAutorNome'>
                                                        <FaUserAlt />
                                                        <span>
                                                            {Evento.AutorNome}
                                                        </span>
                                                    </span>
                                                    <span className='ChamadoData'>
                                                        <BsClockFill />
                                                        <span>
                                                            {moment(Evento.Data).format("DD/MM/YY HH:mm")}
                                                        </span>
                                                    </span>

                                                </div>
                                            }

                                            {!Evento.Tipo.includes("Anexo") &&
                                                <div className='Mensagem'>
                                                    <span className='ChamadoTitulo'>{Evento.Titulo}</span>
                                                    <span className='ChamadoMensagem'>{Evento.Mensagem}</span>

                                                    <span className='ChamadoAutorNome'>
                                                        <FaUserAlt />
                                                        <span>
                                                            {Evento.AutorNome}
                                                        </span>
                                                    </span>
                                                    <span className='ChamadoData'>
                                                        <BsClockFill />
                                                        <span>
                                                            {moment(Evento.Data).format("DD/MM/YY HH:mm")}
                                                        </span>
                                                    </span>

                                                </div>
                                            }

                                            {Evento.AutorEmail === props.LoggedUser.email && <BiCheckDouble />}

                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='ChamadoFluxo'>
                                <div className={`ChamadoFluxoHeader`}>
                                    <span onClick={ToggleFluxoDropDown} >
                                        Fluxo do Chamado
                                    </span>
                                    <div>
                                        {!FluxoDropDown && <AiOutlineCaretDown onClick={ToggleFluxoDropDown} />}
                                        {FluxoDropDown && <AiOutlineCaretUp onClick={ToggleFluxoDropDown} />}
                                    </div>

                                </div>
                                <div className='ChamadoFluxoBody' style={FluxoDropDown ? DropInfoAbertoStyle : DropInfoFechadoStyle}>
                                    <div className='FluxoTabelaHeader' style={FluxoDropDown ? DisplayGrid : DisplayNone}>
                                        <span></span>
                                        <span>Etapa</span>
                                        <span>Tempo Decorrido</span>
                                        <span>Status</span>
                                    </div>
                                    {
                                        ChamadoFluxo.map((FluxoItem, i) => {
                                            return <div key={FluxoItem.Etapa + i} className='FluxoEtapa' style={FluxoDropDown ? DisplayGrid : DisplayNone}>
                                                <span className='EtapaSpan'>
                                                    {FluxoItem.Inicio !== 0 && FluxoItem.Final === 0 && <BiRun className='EtapaAndamento' />}
                                                    {FluxoItem.Inicio === 0 && FluxoItem.Final === 0 && <MdCancel className='EtapaPendente' />}
                                                    {FluxoItem.Inicio !== 0 && FluxoItem.Final !== 0 && <AiFillCheckCircle className='EtapaCompleta' />}
                                                </span>
                                                <span className='EtapaSpan'>
                                                    {FluxoItem.Etapa}
                                                </span>
                                                <span className='EtapaInicio'>
                                                    {FluxoItem.Inicio !== 0 && FluxoItem.Final === 0 && msToHMS((HorarioAtualizado - FluxoItem.Inicio))}
                                                    {FluxoItem.Inicio !== 0 && FluxoItem.Final !== 0 && msToHMS((FluxoItem.Final - FluxoItem.Inicio))}
                                                </span>
                                                <span className='EtapaStatus'>
                                                    <span>
                                                        {FluxoItem.Inicio !== 0 && FluxoItem.Status}
                                                    </span>
                                                </span>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='ChamadoAside'>



                        <div className='ChamadoStatus'>
                            <div className={`ChamadoStatusHeader ${ChamadoStatus.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`}>
                                <span onClick={ToggleStatusDropDown}>
                                    Status do Chamado
                                </span>
                                <div>
                                    {!StatusDropDown && <AiOutlineCaretDown onClick={ToggleStatusDropDown} />}
                                    {StatusDropDown && <AiOutlineCaretUp onClick={ToggleStatusDropDown} />}
                                </div>
                            </div>
                            <div className='ChamadoStatusBody' style={StatusDropDown ? DropInfoAbertoStyle : DropInfoFechadoStyle}>

                                <div className='ChamadoStatusSelect' style={StatusDropDown ? DisplayFlex : DisplayNone}>
                                    <span>Status: </span>
                                    <select value={ChamadoStatusNext} onChange={e => setChamadoStatusNext(e.target.value)} disabled={getStatusSelectState(ChamadoStatus, props.Usuario)}>
                                        <optgroup>
                                            {getNextStatus(ChamadoStatus)}
                                        </optgroup>
                                    </select>


                                </div>
                                {NextStatusFormVisible &&

                                    <form className='ComentarioStatusForm' onSubmit={handleChangeStatusChamado} style={StatusDropDown ? DisplayFlex : DisplayNone}>
                                        <textarea value={ComentarioStatus} onChange={e => setComentarioStatus(e.target.value)} placeholder={NextStatusPLaceholder} ></textarea>
                                        <button>Enviar Alteração <MdEdit /></button>
                                    </form>

                                }

                            </div>
                        </div>

                        <div className='ChamadoResponsavel'>
                            <div className={`ChamadoResponsavelHeader`}>
                                <span onClick={ToggleResponsavelDropDown} >
                                    Informações do Responsável pelo Chamado
                                </span>
                                <div>
                                    {!ResponsavelDropDown && <AiOutlineCaretDown onClick={ToggleResponsavelDropDown} />}
                                    {ResponsavelDropDown && <AiOutlineCaretUp onClick={ToggleResponsavelDropDown} />}
                                </div>
                            </div>
                            <div className='ChamadoResponsavelBody' style={ResponsavelDropDown ? DropInfoAbertoStyle : DropInfoFechadoStyle}>

                                {Responsavel.AceiteEm !== 0 &&
                                    <div className='ChamadoDescBodyRow' style={ResponsavelDropDown ? DisplayFlex : DisplayNone}>
                                        <BiUserPin />
                                        <span className='DescTituloBodyRow'>Nome: </span>
                                        <span className='DescTextoBodyRow'>{Responsavel.NomeResponsavel}</span>
                                    </div>
                                }
                                {Responsavel.AceiteEm !== 0 &&
                                    <div className='ChamadoDescBodyRow' style={ResponsavelDropDown ? DisplayFlex : DisplayNone}>
                                        <MdOutlineEmail />
                                        <span className='DescTituloBodyRow'>E-mail: </span>
                                        <span className='DescTextoBodyRow' >{Responsavel.EmailResponsavel}</span>
                                    </div>
                                }

                                {Responsavel.AceiteEm === 0 && props.Usuario.Tipo === 'Cliente' && Solicitante.EmailSolicitante === props.Usuario.email &&
                                    <div className='AlertaResponsavelDiv' style={ResponsavelDropDown ? DisplayFlex : DisplayNone}>
                                        <Alert variant="warning" className='AlertaSemResponsavel'>Ainda não atribuido a nenhum responsável</Alert>
                                    </div>

                                }

                                {Responsavel.AceiteEm === 0 && props.Usuario.Tipo !== 'Cliente' && Solicitante.EmailSolicitante === props.Usuario.email &&

                                    <div className='AlertaResponsavelDiv' style={ResponsavelDropDown ? DisplayFlex : DisplayNone}>
                                        <Alert variant="warning" className='AlertaSemResponsavel'>Ainda não atribuido a nenhum responsável</Alert>
                                    </div>
                                }

                                {Responsavel.AceiteEm === 0 && props.Usuario.Tipo !== 'Cliente' && Solicitante.EmailSolicitante !== props.Usuario.email &&
                                    <div className='AlertaResponsavelDiv' style={ResponsavelDropDown ? DisplayFlex : DisplayNone}>
                                        <button onClick={AtribuirChamado} >
                                            <FaUserPlus />
                                            Atribuir esse Chamado a mim
                                        </button>
                                    </div>
                                }




                            </div>
                        </div>



                        <div className='ChamadoDesc'>
                            <div className={`ChamadoDescHeader ${ChamadoStatus.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`}>
                                <span onClick={ToggleInfoDropdown}>
                                    Informações
                                </span>
                                <div>
                                    {!InfoDropdown && <AiOutlineCaretDown onClick={ToggleInfoDropdown} />}
                                    {InfoDropdown && <AiOutlineCaretUp onClick={ToggleInfoDropdown} />}
                                </div>
                            </div>
                            <div className='ChamadoDescBody' style={InfoDropdown ? DropInfoAbertoStyle : DropInfoFechadoStyle}>
                                <div className='ChamadoDescBodyRow'>
                                    <AiOutlineFieldNumber />
                                    <span className='DescTituloBodyRow'>Número: </span>
                                    <span className='DescTextoBodyRow'>{Chamado.ID}</span>
                                </div>

                                <div className='ChamadoDescBodyRow'>
                                    <BiUserPin />
                                    <span className='DescTituloBodyRow'>Solicitante: </span>
                                    <span className='DescTextoBodyRow'>{Solicitante.NomeSolicitante}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <MdOutlineEmail />
                                    <span className='DescTituloBodyRow'>E-mail de Contato: </span>
                                    <span className='DescTextoBodyRow' >{Solicitante.EmailSolicitante}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <BsTelephone />
                                    <span className='DescTituloBodyRow'>Telefone para Contado(Solicitante): </span>
                                    <span className='DescTextoBodyRow' >{Solicitante.Telefone}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <MdOutlinePlace />
                                    <span className='DescTituloBodyRow'>Estado: </span>
                                    <span className='DescTextoBodyRow' >{Solicitante.Estado}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <FaCity />
                                    <span className='DescTituloBodyRow'>Cidade: </span>
                                    <span className='DescTextoBodyRow' >{Solicitante.Cidade}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <MdPriorityHigh />
                                    <span className='DescTituloBodyRow'>Urgencia: </span>
                                    <span className='DescTextoBodyRow' >{Chamado.Urgencia}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <MdCategory />
                                    <span className='DescTituloBodyRow'>Categoria: </span>
                                    <span className='DescTextoBodyRow' >{Chamado.CategoriaSelecionada}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <BsSubtract />
                                    <span className='DescTituloBodyRow'>Subcategoria: </span>
                                    <span className='DescTextoBodyRow' >{Chamado.Subcategoria}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <MdDescription />
                                    <span className='DescTituloBodyRow'>Descrição do Problema: </span>
                                    <span className='DescTextoBodyRow' >{Chamado.Descricao}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <TiInfoOutline />
                                    <span className='DescTituloBodyRow'>Canário: </span>
                                    <span className='DescTextoBodyRow' >{Chamado.Cenario}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <RiInformationLine />
                                    <span className='DescTituloBodyRow'>Informações Adicionais: </span>
                                    <span className='DescTextoBodyRow' >{Chamado.InfoAdicional}</span>
                                </div>
                                <div className='ChamadoDescBodyRow'>
                                    <MdAttachFile />
                                    <span className='DescTituloBodyRow'>Anexos: </span>
                                    {Chamado.Anexo.NomeArquivo && <span className='DescTextoBodyRow' > <a rel="noreferrer" download href={Chamado.Anexo.Url} target="_blank" >{Chamado.Anexo.NomeArquivo} </a>  </span>}
                                    {!Chamado.Anexo.NomeArquivo && <span className='DescTextoBodyRow' >Nenhum</span>}
                                </div>





                                {AberturaDeTerceiros.Status === 'Sim' &&
                                    <div className='SolicitadoParaBodyRow'>
                                        <span className='TextoBodyRowTerceiros'>Este Chamado foi aberto por outra pessoa: </span>
                                        <div className='BodyRow'>
                                            <MdOutlineEmail />
                                            <span className='TituloBodyRow'>E-mail: </span>
                                            <span className='TextoBodyRow' >{AberturaDeTerceiros.EmailSolicitante}</span>
                                        </div>
                                        <div className='BodyRow'>
                                            <BiUserPin />
                                            <span className='TituloBodyRow'>Nome: </span>
                                            <span className='TextoBodyRow'>{AberturaDeTerceiros.NomeSolicitante}</span>
                                        </div>
                                        <div className='BodyRow'>
                                            <BsTelephone />
                                            <span className='TituloBodyRow'>Telefone: </span>
                                            <span className='TextoBodyRow' >{AberturaDeTerceiros.Telefone}</span>
                                        </div>
                                    </div>

                                }


                            </div>

                        </div>

                    </div>
                </div>

            </div>
            }

            {!InitialLoading && <Oval />}
        </div >
    )
}


const ConnectedChamado = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        ChamadosState: state.Chamados,
        Usuario: state.Usuarios.find(Usuario => {
            return Usuario.email === state.LoggedUser.email
        }),

    }
})(Chamado)

export default ConnectedChamado

