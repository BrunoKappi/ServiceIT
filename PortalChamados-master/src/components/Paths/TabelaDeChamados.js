import moment from 'moment'
import './css/TabelaDeChamados.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaCity } from "react-icons/fa";
import { BiUserPin } from "react-icons/bi";
import { BsSubtract } from "react-icons/bs";
import { BsTelephone } from "react-icons/bs";
import { TiInfoOutline } from "react-icons/ti";
import { HiOutlineTicket, HiArrowNarrowRight } from "react-icons/hi";
import Pagination from '@mui/material/Pagination';
import Accordion from 'react-bootstrap/Accordion';
import React, { useEffect, useState } from 'react';
import { RiInformationLine } from "react-icons/ri";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { MdOutlineEmail, MdPriorityHigh, MdCategory, MdOutlinePlace, MdDescription, MdDateRange } from "react-icons/md";
import Alert from 'react-bootstrap/Alert';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import pt from 'date-fns/locale/pt-BR';



const TabelaDeChamados = (props) => {

  registerLocale('pt-BR', pt)

  const [page, setPage] = useState(1);
  const [RangeMinPages, setRangeMinPages] = useState(1);
  const [ChamadosPorPaginaControleInterno, setChamadosPorPaginaControleInterno] = useState(6);
  const [RangeMaxPages, setRangeMaxPages] = useState(1);
  const [countPages, setcountPages] = useState(2);


  const handlePageChange = (value1, value) => {
    setPage(value);
  };

  useEffect(() => {
    setcountPages(parseInt(Math.ceil(props.Chamados.length / ChamadosPorPaginaControleInterno)) || 1)

    //console.log("PAGINAS", (Math.ceil(props.Chamados.length / ChamadosPorPagina)) || 1)
  }, [props.Chamados, ChamadosPorPaginaControleInterno])

  useEffect(() => {

    if (page === 1) {
      setRangeMinPages(0)
      setRangeMaxPages(ChamadosPorPaginaControleInterno)
    } else {
      setRangeMinPages((ChamadosPorPaginaControleInterno * page - ChamadosPorPaginaControleInterno))
      setRangeMaxPages(ChamadosPorPaginaControleInterno * page)
    }



  }, [page, props.Chamados.length, ChamadosPorPaginaControleInterno])



  useEffect(() => {
    if (ChamadosPorPaginaControleInterno < 1)
      setChamadosPorPaginaControleInterno(1)
    if (ChamadosPorPaginaControleInterno > 100)
      setChamadosPorPaginaControleInterno(100)

  }, [ChamadosPorPaginaControleInterno]);



  const [startDate, setStartDate] = useState(null);
  const [FinalDate, setFinalDate] = useState(null);
  const [, setStartDateUnix] = useState(0);
  const [, setFinalDateUnix] = useState(2135552585);



  return (
    <div className="TabelaDeChamados">







      {
        props.Chamados.length === 0 &&
        <div>
          <div className='AlertaTabelaVazia'>
            <Alert variant="warning" className='AlertaNenhumChamado'>
              Ainda não há nenhum Chamado nesta Lista ou não atendem o seu filtro!
            </Alert>
          </div>


          <div className='DataRangeDivNoChamados'>
            <span>Filtro de data</span>

            <DatePicker
              placeholderText="Inicio"
              className='TimeRangeSelector'
              selected={startDate}
              locale="pt-BR"
              dateFormat="dd/MM/yy"
              onChange={(date) => { setStartDateUnix(moment(date).valueOf()); setStartDate(date); props.HandleSetstartDateUnix(moment(date).valueOf()) }}
            />

            <HiArrowNarrowRight />

            <DatePicker
              placeholderText="Final"
              className='TimeRangeSelector'
              selected={FinalDate}
              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
              onChange={(date) => { setFinalDateUnix(moment(date).valueOf()); setFinalDate(date); props.HandleSetFinalDateUnix(moment(date).valueOf()) }}
            />

          </div>

        </div>
      }

      {
        props.Chamados.length > 0 &&
        <div className='ChamadosTableForMobile'>
          <Accordion className='AcordeonSm' defaultActiveKey="0" flush>
            {props.Chamados.map((Chamado, index) => {
              if (index >= RangeMinPages && index < RangeMaxPages) {
                return <Accordion.Item eventKey={Chamado.ID} key={Chamado.ID}>
                  <Accordion.Header >
                    <div className='FlexTableHeader'>
                      <span className='ChamadoDescriptionHeader'>
                        <MdDescription />
                        {Chamado.Descricao.length > 35 ? Chamado.Descricao.substring(0, 35) + '...' : Chamado.Descricao}
                      </span>
                      <div className='ChamadosTableForMobileItemHeader'>

                        <span>
                          <HiOutlineTicket />
                          {Chamado.ID}
                        </span>
                        <span>
                          <MdDateRange />
                          {moment(Chamado.Andamento.DataHoraAbertura).format("DD/MM/YY")}
                        </span>
                        <span>
                          <div className={`StatusCircle ${Chamado.Andamento.Status.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`}></div>
                          <span>{Chamado.Andamento.Status}</span>
                        </span>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
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
                    <div className='BodyRowLast'>
                      <Link to={`/App/Chamado/${Chamado.ID}`} >
                        <span className='ChamadoLinkTable'> Ver Detalhes</span>
                      </Link>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              } else
                return null
            })}
          </Accordion>
        </div>
      }


      {
        props.Chamados.length > 0 &&
        <div>
          <div className='ChamadosTable'>
            <div className='ChamadosTableHeader'>
              <span>Número</span>
              <span>Criado em</span>
              <span>Solicitante</span>
              <span>Descrição </span>
              <span>Estado</span>
              <span>Acesso</span>
            </div>
            <div className='ChamadosTableBody'>
              {props.Chamados.map((Chamado, index) => {
                if (index >= RangeMinPages && index < RangeMaxPages) {
                  return <div className='ChamadosBodyTableRow' key={Chamado.ID}>
                    <Link to={`/App/Chamado/${Chamado.ID}`} >
                      <span className='ChamadosTableSpan'>{Chamado.ID}</span>
                    </Link>
                    <Link to={`/App/Chamado/${Chamado.ID}`} >
                      <span>{moment(Chamado.Andamento.DataHoraAbertura).format("DD/MM/YYYY HH:mm")}</span>
                    </Link>

                    <Link to={`/App/Chamado/${Chamado.ID}`} >
                      <span className='ChamadosTableSpan'> {Chamado.Solicitante.NomeSolicitante}</span>
                    </Link>
                    <Link to={`/App/Chamado/${Chamado.ID}`} >
                      <span className='ChamadosTableSpan'> {Chamado.Descricao.length > 60 ? Chamado.Descricao.substring(0, 60) + '...' : Chamado.Descricao}</span>
                    </Link>
                    <span>
                      <Link to={`/App/Chamado/${Chamado.ID}`} >
                        <div className={`StatusCircle ${Chamado.Andamento.Status.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`}></div>
                        <span>{Chamado.Andamento.Status}</span>
                      </Link>
                    </span>
                    <Link to={`/App/Chamado/${Chamado.ID}`} >
                      <span className='ChamadoLinkTable'> Ver Detalhes</span>
                    </Link>
                  </div>
                }
                else
                  return null
              })}
            </div>
          </div>

          <div className='PaginationDiv'>
            <div className='BottomTableChamadosWrap'>
              <div className='FakeInputDiv'>
                <span>Itens/Página:</span>
                <input className='InputInvisible' value={ChamadosPorPaginaControleInterno} onChange={e => setChamadosPorPaginaControleInterno(e.target.value)} min="1" max="100" type="number" />

              </div>

              <div className='DataRangeDiv'>


                <span>Filtro de data</span>


                <DatePicker
                  placeholderText="Inicio"
                  className='TimeRangeSelector'
                  selected={startDate}
                  locale="pt-BR"
                  dateFormat="dd/MM/yy"
                  onChange={(date) => { setStartDateUnix(moment(date).valueOf()); setStartDate(date); props.HandleSetstartDateUnix(moment(date.setHours(0)).valueOf()) }}
                />

                <HiArrowNarrowRight />

                <DatePicker
                  placeholderText="Final"
                  className='TimeRangeSelector'
                  selected={FinalDate}
                  locale="pt-BR"
                  dateFormat="dd/MM/yyyy"
                  onChange={(date) => { setFinalDateUnix(moment(date).valueOf()); props.HandleSetFinalDateUnix(moment(date.setHours(23)).valueOf()); setFinalDate(date); }}
                />

              </div>




            </div>

            <Pagination count={countPages} color="primary" page={page} onChange={handlePageChange} />
          </div>




        </div>



      }

    </div >

  );
}

const ConnectedTabelaDeChamados = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    })
  }
})(TabelaDeChamados)

export default ConnectedTabelaDeChamados

