import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import './css/TodosChamados.css'
import moment from 'moment';
import TabelaDeChamados from './TabelaDeChamados';
import Select from 'react-select'
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom'
import { SetTab } from '../utils/Utilidades';
import { FilterStatusoptions, Filteroptions, LoadingTime } from '../../GlobalVars';
import { Oval } from 'react-loader-spinner'

const TodosChamados = (props) => {

  const [InitialLoading, setInitialLoading] = useState(false);

  setTimeout(() => {
    setInitialLoading(true)
  }, LoadingTime);

  const [ChamadosPorPagina,] = useState(6);
  const [FiltroDeTexto, setFiltroDeTexto] = useState('');
  const [FiltroStatus, setFiltroStatus] = useState('Filtrar Status');
  const [Chamados, setChamados] = useState([]);
  const [Filtro, setFiltro] = useState('Ordenar por');

  const [startDate, setStartDate] = useState(null);
  const [FinalDate, setFinalDate] = useState(null);
  const [startDateUnix, setStartDateUnix] = useState(0);
  const [FinalDateUnix, setFinalDateUnix] = useState(2135552585);

  const HandleSetstartDateUnix = (valueUnix) => {
    console.log(moment.unix(valueUnix).format("MM/DD/YYYY hh:mm:ss"))
    setStartDateUnix(valueUnix)
    setStartDate(moment.unix(valueUnix).format("MM/DD/YYYY hh:mm:ss"))
  }

  const HandleSetFinalDateUnix = (valueUnix) => {
    console.log(moment.unix(valueUnix).format("MM/DD/YYYY hh:mm:ss"))
    setFinalDateUnix(valueUnix)
    setFinalDate(moment.unix(valueUnix).format("MM/DD/YYYY hh:mm:ss"))
  }

                    
  useEffect(() => {
    setChamados([...props.Chamados])
  }, [props.Chamados]);


  useEffect(() => {
    setChamados(props.Chamados.filter(Chamado => {
      const TextFilter = FiltroDeTexto === ''
        || Chamado.Descricao.toLowerCase().includes(FiltroDeTexto.toLowerCase())
        || Chamado.ID.toLowerCase().includes(FiltroDeTexto.toLowerCase())
        || Chamado.Solicitante.NomeSolicitante.toLowerCase().includes(FiltroDeTexto.toLowerCase())
      const StatusFilter = FiltroStatus === 'Todos' || FiltroStatus === 'Filtrar Status' || Chamado.Andamento.Status === FiltroStatus

      const StartDateFilter = !startDate || Chamado.Andamento.DataHoraAbertura >= startDateUnix
      const FinalDateFilter = !FinalDate || Chamado.Andamento.DataHoraAbertura <= FinalDateUnix

      return TextFilter && StatusFilter && StartDateFilter && FinalDateFilter
    }).sort((a, b) => {
      if (Filtro === 'Mais recentes' || Filtro === 'Ordenar por') {
        return a.Andamento.DataHoraAbertura < b.Andamento.DataHoraAbertura ? 1 : -1
      } else if (Filtro === 'Mais antigos') {
        return a.Andamento.DataHoraAbertura < b.Andamento.DataHoraAbertura ? - 1 : 1
      } else if (Filtro === 'Status') {
        return a.Andamento.Status.localeCompare(b.Andamento.Status);
      } else if (Filtro === 'Descrição') {
        return a.Descricao.localeCompare(b.Descricao);
      } else {
        return a.Andamento.DataHoraAbertura < b.Andamento.DataHoraAbertura ? 1 : -1
      }
    }))

    console.log(startDateUnix)

  }, [FiltroDeTexto, Filtro, FiltroStatus, props.Chamados, startDate, FinalDate, startDateUnix, FinalDateUnix]);






  return (
    <div className="TodosChamados">
      {InitialLoading && <div>
        <div className='BreadcrumbList'>
          <span onClick={e => SetTab('DashBoard')}>
            <Link to="../DashBoard">Página Inicial</Link>
          </span>
          <GoChevronRight />
          <span>
            Todos os Chamados
          </span>
        </div>

        <div className='ChamadosHeader'>
          <div className='TabChamadoTitulo'>
            <span></span>
            <h2>Todos os Chamados</h2>
          </div>
          <div className='Filtros'>
            <input type="text" className='FiltroTextoInput' value={FiltroDeTexto} placeholder='Palavra-Chave' onChange={e => setFiltroDeTexto(e.target.value)} />
            <Select value={{ value: Filtro, label: Filtro }} options={Filteroptions} onChange={e => setFiltro(e.value)} />
            <Select value={{ value: FiltroStatus, label: FiltroStatus }} options={FilterStatusoptions} onChange={e => setFiltroStatus(e.value)} />
          </div>

          <div className='FiltrosSm'>
            <input type="text" className='FiltroTextoInput' value={FiltroDeTexto} placeholder='Palavra-Chave' onChange={e => setFiltroDeTexto(e.target.value)} />
            <div className='FiltrosSmSelects'>
              <Select value={{ value: Filtro, label: Filtro }} options={Filteroptions} onChange={e => setFiltro(e.value)} />
              <Select value={{ value: FiltroStatus, label: FiltroStatus }} options={FilterStatusoptions} onChange={e => setFiltroStatus(e.value)} />
            </div>
          </div>
        </div>

        <TabelaDeChamados
          ChamadosPorPagina={ChamadosPorPagina}
          Chamados={Chamados}
          HandleSetstartDateUnix={HandleSetstartDateUnix}
          HandleSetFinalDateUnix={HandleSetFinalDateUnix}
        />



      </div>
      }

      {!InitialLoading && <Oval />}
    </div>
  );
}

const ConnectedTodosChamados = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Chamados: state.Chamados
  }
})(TodosChamados)

export default ConnectedTodosChamados

