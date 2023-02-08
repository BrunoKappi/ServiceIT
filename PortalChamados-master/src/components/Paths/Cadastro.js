import React, { useState, useEffect } from 'react'
import './css/Cadastro.css'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { uuidv4 } from '@firebase/util'
import Select from 'react-select'
import { MdOutlineEmail } from "react-icons/md";
import { BiUserPin } from "react-icons/bi";
import { FaUsersCog } from "react-icons/fa";
import { BiBuildings } from "react-icons/bi";
import { FaCity } from "react-icons/fa";
import { MdOutlinePlace } from "react-icons/md";
import { CgCalendarDates } from "react-icons/cg";
import { BsTelephone } from "react-icons/bs";
import { CreateUsuario, SairUmaPagina } from '../utils/Utilidades'
import { MaxDateNascimento, MaxLengthEmail, MaxLengthEmpresa, MaxLengthNome, MinDateNascimento } from '../../GlobalVars';
import PhoneInput from 'react-phone-input-2'
import { Estados } from '../../Cidades';

const Cadastro = (props) => {

    const navigate = useNavigate();

    const [Email, setEmail] = useState(props.LoggedUser.email || '');
    const [Nome, setNome] = useState('');
    const [Sobrenome, setSobrenome] = useState('');
    const [Tipo, setTipo] = useState('Cliente');
    const [Cidade, setCidade] = useState('');
    const [Estado, setEstado] = useState('');
    const [Nascimento, setNascimento] = useState('');
    const [Empresa, setEmpresa] = useState('');
    const [Mensagem, setMensagem] = useState('');
    const [Filled, setFilled] = useState(false);
    const [Telefone, setTelefone] = useState('');
    const [EstadosOpcoes, setEstadosOpcoes] = useState([]);
    const [CidadesOpcoes, setCidadesOpcoes] = useState([]);

    useEffect(() => {
        setEmail(props.LoggedUser.email)
        if (props.LoggedUser.email !== 'Vazio' && props.Usuario)
            navigate('/App/DashBoard')
        if (Email && Nome && Sobrenome && Tipo && Cidade && Estado && Nascimento && Empresa && Telefone.length >= 10)
            setFilled(true)
        else
            setFilled(false)
    }, [props.LoggedUser.email, props.Usuario, navigate, Filled, Email, Nome, Sobrenome, Tipo, Cidade, Estado, Nascimento, Empresa, Telefone]);

    const HandleSubmitCadastro = async (e) => {
        e.preventDefault()
        if (Filled) {
            if (Nome && Tipo) {
                const UsuarioNovo = {
                    uid: uuidv4(),
                    email: props.LoggedUser.email,
                    nome: Nome,
                    tipo: Tipo,
                    cidade: Cidade,
                    estado: Estado,
                    sobrenome: Sobrenome,
                    nascimento: Nascimento,
                    empresa: Empresa,
                    numero: Telefone,
                    work: { inicio: '', final: '' },
                    aprovado: Tipo === 'Cliente' ? true : false,
                    rejeitado: false
                }
                CreateUsuario(UsuarioNovo)
                setMensagem('Atualizado')
                navigate('/App/DashBoard')
            }
        }
    }



    useEffect(() => {
        setEstadosOpcoes(Estados.map(Estado => { return { value: Estado.nome, label: Estado.nome } }))
    }, []);

    useEffect(() => {
        if (Estado) {
            setCidade('')
            const EstadoEscolhido = Estados.find(EstadoMap => { return EstadoMap.nome === Estado })
            setCidadesOpcoes(EstadoEscolhido.cidades.map(Cidade => { return { value: Cidade, label: Cidade } }))
        }
    }, [Estado]);



    return (
        <div className='DivCadastroForm'>
            <div className='formContainerCadastro'>
                {Mensagem && <p className='Mensagem'>{Mensagem}</p>}
                <form onSubmit={HandleSubmitCadastro} className="CadastroForm">
                    <h1>Termine Seu Cadastro</h1>
                    <label className='InputLabelProfile' >  <MdOutlineEmail />Email</label>
                    <input maxLength={MaxLengthEmail} name="Email" disabled className='CadastroInput' type="text" defaultValue={Email} />

                    <label className='InputLabelProfile' ><BiUserPin /> Nome</label>
                    <div className='DoubleColumnCadastro'>
                        <input maxLength={MaxLengthNome} name='Nome' className='CadastroInput' type="text" placeholder='Nome' onChange={e => setNome(e.target.value)} />
                        <input maxLength={MaxLengthNome} name='Sobrenome' className='CadastroInput' type="text" placeholder='Sobrenome' onChange={e => setSobrenome(e.target.value)} />
                    </div>

                    {Tipo === 'Solucionador' && <span className='alertaAprovacao'>Perfis de Solucionadores passarão antes por aprovação</span>}
                    <label className='InputLabelProfile' > <FaUsersCog /> Tipo de Conta</label>
                    <select name="Tipo" defaultValue={"Cliente"} onChange={e => setTipo(e.target.value)} className='CadastroSelect'>
                        <option value="Cliente" key="Cliente">Cliente</option>
                        <option value="Solucionador" key="Solucionador">Solucionador</option>
                    </select>

                    <label className='InputLabelProfile' > <BsTelephone /> Telefone de Contato</label>

                    <PhoneInput
                        inputStyle={{ width: '100%', marginRight: '0', fontFamily: 'Kanit', fontSize: '12px' }}
                        containerStyle={{ margin: '0', padding: '0', width: '100%', fontSize: '12px' }}
                        country={'br'}
                        value={Telefone}
                        onChange={e => setTelefone(e)}
                    />

                    <div className='DoubleColumnCadastro'>
                        <div className='ColunaDoubleRow'>
                            <label className='InputLabelProfile' ><CgCalendarDates />Data de Nascimento</label>
                            <input min={MinDateNascimento} max={MaxDateNascimento} placeholder='Data' name="Nascimento" className='CadastroInput NascimentoSelect' type="date" onChange={e => setNascimento(e.target.value)} />
                        </div>

                        <div className='ColunaDoubleRow'>
                            <label className='InputLabelProfile' ><BiBuildings />Empresa</label>
                            <input maxLength={MaxLengthEmpresa} value={Empresa} className='CadastroInput EmpresaInput ' placeholder='Empresa' type="text" name='Empresa' onChange={e => setEmpresa(e.target.value)} />
                        </div>

                    </div>



                    <div className='DoubleColumnCadastro'>
                        <div className='ColunaDoubleRow'>
                            <label className='InputLabelProfile' > <MdOutlinePlace />Estado</label>
                            <Select
                                maxMenuHeight='120px'
                                menu={{ heigth: '50px' }}
                                className='Select'
                                name='Estado'
                                options={EstadosOpcoes}
                                onChange={e => setEstado(e.value)}>
                            </Select>
                        </div>

                        <div className='ColunaDoubleRow'>
                            <label className='InputLabelProfile' >  <FaCity />Cidade</label>
                            <Select
                                maxMenuHeight='120px'
                                className='Select'
                                name='Cidade'
                                options={CidadesOpcoes}
                                onChange={e => setCidade(e.value)}>
                            </Select>
                        </div>

                    </div>


                    <button disabled={!Filled} className='CadastroButton'>Enviar</button>

                </form>
                <a className="BackLogout" href="/" onClick={SairUmaPagina}>Voltar</a>
            </div>
        </div>
    )
}

const ConnectedCadastro = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        Usuario: state.Usuarios.find(Usuario => {
            return Usuario.email === state.LoggedUser.email
        }),
        Dados: state.Dados
    }
})(Cadastro)

export default ConnectedCadastro