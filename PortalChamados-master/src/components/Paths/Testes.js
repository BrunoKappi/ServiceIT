import { React, useState, useEffect } from "react";
import { connect } from 'react-redux'
import './css/Testes.css'
import { Estados } from "../../Cidades";
import Select from 'react-select'

const Testes = (props) => {


  const [EstadosOpcoes, setEstadosOpcoes] = useState([]);
  const [CidadesOpcoes, setCidadesOpcoes] = useState([]);
  const [Estado, setEstado] = useState('');  
  const [Cidade, setCidade] = useState('');

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
    <div className="Testes">

      <Select
        value={{ value: Estado, label: Estado }}
        className='SelectReactProfile'
        name='Estado'
        options={EstadosOpcoes}
        onChange={e => setEstado(e.value)}
      >
      </Select>

      <Select
        value={{ value: Cidade, label: Cidade }}
        className='SelectReactProfile'
        name='Cidade'
        options={CidadesOpcoes}
        onChange={e => setCidade(e.value)}
      >
      </Select>

    </div>
  );
}

const ConnectedTestes = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    })
  }
})(Testes)

export default ConnectedTestes
