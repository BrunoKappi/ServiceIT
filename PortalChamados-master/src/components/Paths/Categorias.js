import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import './css/Categorias.css'
import 'react-phone-input-2/lib/style.css'
import { FiChevronRight } from "react-icons/fi";
import { MdAddCircle, MdDelete, MdModeEditOutline, MdCancel } from "react-icons/md";
import ListGroup from 'react-bootstrap/ListGroup';
import { v4 } from 'uuid';
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom'
import { Notificar, SetDados, SetTab } from '../utils/Utilidades';
import { MaxLengthCategorias } from '../../GlobalVars';

const Categorias = (props) => {

  const [CategoriaSelecionada, setCategoriaSelecionada] = useState(props.Dados.categorias[0].descricao);
  const [CenarioSelecionado, setCenarioSelecionado] = useState();
  const [UrgenciaSelecionada, setUrgenciaSelecionada] = useState();
  const [Subcategoria, setSubcategoria] = useState();
  const [RefreshSubCategorias, setRefreshSubCategorias] = useState(false);
  const [NewCategoria, setNewCategoria] = useState('');
  const [NewCenario, setNewCenario] = useState('');
  const [NewUrgencia, setNewUrgencia] = useState('');
  const [NewSubcategoria, setNewSubcategoria] = useState('');
  const [ListaSubcategorias, setListaSubcategorias] = useState([]);
  const [EditingCategoria, setEditingCategoria] = useState(false);
  const [EditingSubcategoria, setEditingSubcategoria] = useState(false);
  const [EditingCenarios, setEditingCenarios] = useState(false);
  const [EditingUrgencias, setEditingUrgencias] = useState(false);
  const [, setCategoriaEmEdicao] = useState('');
  const [, setSubcategoriaEmEdicao] = useState('');
  const [, setCenarioEmEdicao] = useState('');
  const [, setUrgenciaEmEdicao] = useState('');

  const [ListaCategoria, setListaCategoria] = useState(props.Dados.categorias.map(item => {
    return { value: item.descricao, label: item.descricao }
  }));

  useEffect(() => {
    setListaCategoria(props.Dados.categorias.map(item => {
      return { value: item.descricao, label: item.descricao }
    }))
  }, [props.Dados]);

  useEffect(() => {
    if (CategoriaSelecionada) {
      props.Dados.categorias.map(categoria => {
        if (categoria.descricao === CategoriaSelecionada) {
          var subCategorias = categoria.subCategorias.map(item => {
            return { value: item.descricao, label: item.descricao }
          })
          setListaSubcategorias(subCategorias)
        } else
          return null

        return null
      })
    }

  }, [CategoriaSelecionada, RefreshSubCategorias, props.Dados.categorias]);



  const HandleSubmiAddCategoria = (e) => {
    e.preventDefault()
    if (NewCategoria.trim()) {
      const NewCategoriaToAdd = {
        id: v4(),
        descricao: NewCategoria,
        subCategorias: []
      }
      const NewCategorias = props.Dados.categorias.concat(NewCategoriaToAdd)
      setNewCategoria('')
      SetDados({ ...props.Dados, categorias: NewCategorias })
      Notificar('Categoria ' + NewCategoria + " Criada!")

      HandleSubmiAddSubcategoriaPadrao(NewCategorias, NewCategoria)

    }
  }

  const HandleSubmiAddCenario = (e) => {
    e.preventDefault()
    if (NewCenario.trim()) {
      const NewCenarioToAdd = {
        id: v4(),
        value: NewCenario

      }
      const NewCenarios = props.Dados.cenarios.concat(NewCenarioToAdd)
      setNewCenario('')

      SetDados({ ...props.Dados, cenarios: NewCenarios })
      Notificar('Cenário ' + NewCenario + " Criado!")
    }
  }

  const HandleSubmiAddUrgencia = (e) => {
    e.preventDefault()
    if (NewUrgencia.trim()) {
      const NewUrgenciaToAdd = {
        id: v4(),
        value: NewUrgencia
      }
      const NewUrgencias = props.Dados.urgencia.concat(NewUrgenciaToAdd)
      setNewUrgencia('')
      SetDados({ ...props.Dados, urgencia: NewUrgencias })
      Notificar('Urgência ' + NewUrgencia + " Criada!")
    }
  }


  const HandleSubmiAddSubcategoria = (e) => {
    e.preventDefault()
    if (NewSubcategoria.trim()) {
      const NewSubcaterogiaToAdd = {
        id: v4(),
        descricao: NewSubcategoria
      }

      const NewCategoriaCom = props.Dados.categorias.find(Categoria => {
        return Categoria.descricao === CategoriaSelecionada
      })

      NewCategoriaCom.subCategorias.push(NewSubcaterogiaToAdd)

      const NewCategoriasComNewCategoriaSub = props.Dados.categorias.filter(Categoria => {
        return Categoria.descricao !== CategoriaSelecionada
      }).concat(NewCategoriaCom)

      SetDados({ ...props.Dados, categorias: NewCategoriasComNewCategoriaSub })

      setListaCategoria(props.Dados.categorias.map(item => {
        return { value: item.descricao, label: item.descricao }
      }))

      setNewSubcategoria('')
      setRefreshSubCategorias(!RefreshSubCategorias)
      Notificar('Subcategoria  ' + NewSubcategoria + " Criada!")
    }
  }



  const HandleSubmiAddSubcategoriaPadrao = (CategoriasNova, Nome) => {
    if (Nome) {
      const NewSubcaterogiaToAdd = {
        id: v4(),
        descricao: Nome
      }


      const NewCategoriaCom = CategoriasNova.find(Categoria => {
        return Categoria.descricao === Nome
      })

      NewCategoriaCom.subCategorias.push(NewSubcaterogiaToAdd)

      const NewCategoriasComNewCategoriaSub = CategoriasNova.filter(Categoria => {
        return Categoria.descricao !== Nome
      }).concat(NewCategoriaCom)

      SetDados({ ...props.Dados, categorias: NewCategoriasComNewCategoriaSub })

      setListaCategoria(CategoriasNova.map(item => {
        return { value: item.descricao, label: item.descricao }
      }))

      setNewSubcategoria('')
      setRefreshSubCategorias(!RefreshSubCategorias)


    }
  }






  const HandleSubmiChangeSubCategoryName = (e, ID) => {
    e.preventDefault()



    if (document.getElementById(ID).value) {

      var CategoriaOriginalCompleta = props.Dados.categorias.find(Categoria => {
        return Categoria.descricao === CategoriaSelecionada
      })



      const newSubCategorias = CategoriaOriginalCompleta.subCategorias.filter(SubcategoriaMap => {
        return SubcategoriaMap.descricao !== Subcategoria
      })






      const NewSubcaterogiaToAdd = {
        id: v4(),
        descricao: document.getElementById(ID).value
      }

      newSubCategorias.push(NewSubcaterogiaToAdd)

      var CategoriaEditada = { ...CategoriaOriginalCompleta, subCategorias: newSubCategorias }

      const NewCategoriasComNewCategoriaSub = props.Dados.categorias.filter(Categoria => {
        return Categoria.descricao !== CategoriaSelecionada
      }).concat(CategoriaEditada)




      SetDados({ ...props.Dados, categorias: NewCategoriasComNewCategoriaSub })

      setListaCategoria(props.Dados.categorias.map(item => {
        return { value: item.descricao, label: item.descricao }
      }))

      var subCategorias = newSubCategorias.map(item => {
        return { value: item.descricao, label: item.descricao }
      })
      setListaSubcategorias(subCategorias)


      setNewSubcategoria('')
      Notificar('Subcategoria  ' + Subcategoria + " Editada!")
      setRefreshSubCategorias(!RefreshSubCategorias)

    }

  }






  /////DELEET SUBCATEGORIA
  const HandleSubmiDeleteSubcategoria = (SubToDelete) => {

    var NewCategoriaCom = props.Dados.categorias.find(Categoria => {
      return Categoria.descricao === CategoriaSelecionada
    })

    const newSubCategorias = NewCategoriaCom.subCategorias.filter(Subcategoria => {
      return Subcategoria.descricao !== SubToDelete
    })

    NewCategoriaCom = { ...NewCategoriaCom, subCategorias: newSubCategorias }

    const NewCategoriasComNewCategoriaSub = props.Dados.categorias.filter(Categoria => {
      return Categoria.descricao !== CategoriaSelecionada
    }).concat(NewCategoriaCom)




    SetDados({ ...props.Dados, categorias: NewCategoriasComNewCategoriaSub })

    setListaCategoria(props.Dados.categorias.map(item => {
      return { value: item.descricao, label: item.descricao }
    }))


    setNewSubcategoria('')
    setRefreshSubCategorias(!RefreshSubCategorias)

    Notificar('Subcategoria ' + SubToDelete + ' Excluída!')
  }




  ///DELETE CATEGORIA
  const HandleDeleteCategoria = (CategoriaToDelete) => {

    const NewCategorias = props.Dados.categorias.filter(categoria => {
      return categoria.descricao !== CategoriaToDelete
    })
    SetDados({ ...props.Dados, categorias: NewCategorias })

    setListaCategoria(props.Dados.categorias.map(item => {
      return { value: item.descricao, label: item.descricao }
    }))


    setRefreshSubCategorias(!RefreshSubCategorias)
    setCategoriaSelecionada('')
    Notificar('Categoria  ' + CategoriaToDelete + " Excluída!")

  }





  ///DELETE CATEGORIA
  const HandleDeleteCenario = (CenarioToDelete) => {

    const NewCenarios = props.Dados.cenarios.filter(cenario => {
      return cenario.value !== CenarioToDelete
    })
    SetDados({ ...props.Dados, cenarios: NewCenarios })

    setListaCategoria(props.Dados.cenarios.map(item => {
      return { value: item.descricao, label: item.descricao }
    }))


    setRefreshSubCategorias(!RefreshSubCategorias)
    setCenarioSelecionado('')
    Notificar('Cenário  ' + CenarioToDelete + " Excluído!")

  }


  ///DELETE CATEGORIA
  const HandleDeleteUrgencia = (UrgenciaToDelete) => {

    const NewUrgenciasToadd = props.Dados.urgencia.filter(urgencia => {
      return urgencia.value !== UrgenciaToDelete
    })
    SetDados({ ...props.Dados, urgencia: NewUrgenciasToadd })

    setListaCategoria(props.Dados.urgencia.map(item => {
      return { value: item.descricao, label: item.descricao }
    }))

    setRefreshSubCategorias(!RefreshSubCategorias)
    setCenarioSelecionado('')
    Notificar('Urgência  ' + UrgenciaToDelete + " Excluída!")

  }


  const initEditing = (CategoriaEdit) => {
    setEditingCategoria(true)
    setCategoriaEmEdicao(CategoriaEdit)
  }

  const EndEditing = () => {
    setEditingCategoria(false)
    setCategoriaEmEdicao('')
  }

  const initEditingSubCategoria = (CategoriaEdit) => {
    if (CategoriaEdit !== CategoriaSelecionada) {
      setEditingSubcategoria(true)
      setSubcategoriaEmEdicao(CategoriaEdit)
    }

  }

  const EndEditingSubCategoria = () => {
    setEditingSubcategoria(false)
    setSubcategoriaEmEdicao('')
  }

  const initEditingCenarios = (CenarioEdit) => {
    setEditingCenarios(true)
    setCenarioEmEdicao(CenarioEdit)
  }
  const EndEditingCenarios = () => {
    setEditingCenarios(false)
    setCenarioEmEdicao('')
  }


  const initEditingUrgencias = (UrgenciaEdit) => {
    setEditingUrgencias(true)
    setUrgenciaEmEdicao(UrgenciaEdit)
  }
  const EndEditingUrgencias = () => {
    setEditingUrgencias(false)
    setUrgenciaEmEdicao('')
  }












  const HandleSubmiChangeCategoriName = (e, ID) => {
    e.preventDefault()
    if (document.getElementById(ID).value) {

      const CategoriaOriginal = props.Dados.categorias.find(Categoria => {
        return Categoria.descricao === CategoriaSelecionada
      })

      const CategoriasSemOriginal = props.Dados.categorias.filter(categoria => {
        return categoria.descricao !== CategoriaSelecionada
      })

      CategoriaOriginal.descricao = document.getElementById(ID).value
      const NewCategorias = CategoriasSemOriginal.concat(CategoriaOriginal)

      SetDados({ ...props.Dados, categorias: NewCategorias })
      setEditingCategoria(false)

      Notificar('Nome da Categoria  ' + CategoriaSelecionada + " Editada!")

    }

  }











  const HandleSubmiChangeCenarioName = (e, ID) => {
    e.preventDefault()
    if (document.getElementById(ID).value) {
      const CenarioOriginal = props.Dados.cenarios.find(Cenario => { return Cenario.value === CenarioSelecionado })
      const CenariosSemOriginal = props.Dados.cenarios.filter(Cenario => { return Cenario.value !== CenarioSelecionado })
      CenarioOriginal.value = document.getElementById(ID).value
      const NewCenarios = CenariosSemOriginal.concat(CenarioOriginal)
      SetDados({ ...props.Dados, cenarios: NewCenarios })

      setEditingCategoria(false)
      setEditingCenarios(false)
      Notificar('Cenário  ' + CenarioSelecionado + " Editado!")
    }
  }


  const HandleSubmiChangeUrgenciaName = (e, ID) => {
    e.preventDefault()
    if (document.getElementById(ID).value) {
      const UrgenciaOriginal = props.Dados.urgencia.find(Urgencia => { return Urgencia.value === UrgenciaSelecionada })
      const UrgenciasSemOriginal = props.Dados.urgencia.filter(Urgencia => { return Urgencia.value !== UrgenciaSelecionada })
      UrgenciaOriginal.value = document.getElementById(ID).value
      const NewUrgencias = UrgenciasSemOriginal.concat(UrgenciaOriginal)
      SetDados({ ...props.Dados, urgencia: NewUrgencias })

      setEditingCategoria(false)
      setEditingUrgencias(false)
      Notificar('Urgência  ' + UrgenciaSelecionada + " Editada!")
    }
  }

  return (
    <div className="Categorias">
      <div className='BreadcrumbList'>
        <span onClick={e => SetTab('DashBoard')}>
          <Link to="../DashBoard">Página Inicial</Link>
        </span>
        <GoChevronRight />
        <span>
          Configurações de Categorias e SubCategorias
        </span>
      </div>

      <div className='TabChamadoTitulo'>
        <span></span>
        <h2>Configuração de Categorias e Subcategorias</h2>
      </div>

      <div className='ListGroupConfiguracoes'>



        <div className='CategoriasESub'>

          <div className='CategoriasListGroup'>
            <ListGroup as="ul">
              <ListGroup.Item as="li" className='CategoriasListGrouItemTitulo' active>
                Categorias
              </ListGroup.Item>

              {ListaCategoria.map(Categoria => {
                return <ListGroup.Item key={Categoria.label + v4()} action as="li">
                  <span className='CategoriaListItem' onClick={e => { setCategoriaSelecionada(Categoria.label); }}>

                    {EditingCategoria && CategoriaSelecionada !== Categoria.label &&
                      <span onClick={e => { setEditingCategoria(false); }}> {Categoria.label}</span>}

                    {!EditingCategoria &&
                      <span onDoubleClick={e => initEditing(Categoria.label)}> {Categoria.label}</span>}
         
                    {CategoriaSelecionada === Categoria.label && EditingCategoria &&
                      <form onSubmit={e => HandleSubmiChangeCategoriName(e, Categoria.label.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, ""))}>
                        <input maxLength={MaxLengthCategorias} className='InputChangeCategoryName' defaultValue={Categoria.label} id={Categoria.label.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")} type="text" />
                      </form>

                    }

                    {CategoriaSelecionada === Categoria.label && !EditingCategoria &&
                      <button onClick={e => initEditing(Categoria.label)}>
                        <MdModeEditOutline className='CategoriaEditIcon' />
                      </button>}

                    {CategoriaSelecionada === Categoria.label && EditingCategoria &&
                      <button onClick={e => EndEditing()}>
                        <MdCancel className='CategoriaEditIcon' />
                      </button>}
                    {CategoriaSelecionada === Categoria.label &&
                      <button onClick={e => HandleDeleteCategoria(CategoriaSelecionada)}>
                        <MdDelete className='CategoriaEditIcon' />
                      </button>}
                    {!CategoriaSelecionada && <FiChevronRight />}
                    {CategoriaSelecionada === Categoria.label && <FiChevronRight />}

                  </span>
                </ListGroup.Item>
              })



              }

              <ListGroup.Item action as="li">
                <span className='CategoriaListItem' >
                  <form onSubmit={HandleSubmiAddCategoria} className='CategoriaListItem'>
                    <input maxLength={MaxLengthCategorias} type="text" placeholder='Nova categoria' value={NewCategoria} onChange={e => setNewCategoria(e.target.value)} />
                    <button>
                      <MdAddCircle />
                    </button>
                  </form>

                </span>
              </ListGroup.Item>



            </ListGroup>
          </div>

















          {CategoriaSelecionada &&
            <div id='SubCategoriasListGroup2' className='SubCategoriasListGroup'>
              <ListGroup as="ul">
                <ListGroup.Item as="li" className='ListGrouItemTitulo' active>
                  Subcategorias
                  <span className='MiniSub'>{"/" + CategoriaSelecionada}</span>
                </ListGroup.Item>

                {ListaSubcategorias.map(SubcategoriaMap => {
                  return <ListGroup.Item className='CategoriaListItem' key={SubcategoriaMap.label + v4()} action as="li">
                    <span className='CategoriaListItem' onClick={e => setSubcategoria(SubcategoriaMap.label)}>
                      {EditingSubcategoria && Subcategoria !== SubcategoriaMap.label &&
                        <span onClick={e => { setEditingSubcategoria(false); }}> {SubcategoriaMap.label}</span>}

                      {!EditingSubcategoria &&
                        <span onDoubleClick={e => initEditingSubCategoria(SubcategoriaMap.label)}> {SubcategoriaMap.label}</span>}

                      {Subcategoria === SubcategoriaMap.label && EditingSubcategoria &&
                        <form onSubmit={e => HandleSubmiChangeSubCategoryName(e, SubcategoriaMap.label.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, ""))}>
                          <input maxLength={MaxLengthCategorias} className='InputChangeCategoryName' defaultValue={SubcategoriaMap.label} id={SubcategoriaMap.label.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")} type="text" />
                        </form>
                      }

                      {Subcategoria === SubcategoriaMap.label && !EditingSubcategoria && SubcategoriaMap.label !== CategoriaSelecionada &&
                        <button onClick={e => initEditingSubCategoria(SubcategoriaMap.label)}>
                          <MdModeEditOutline className='CategoriaEditIcon' />
                        </button>}

                      {Subcategoria === SubcategoriaMap.label && EditingSubcategoria &&
                        <button onClick={e => EndEditingSubCategoria()}>
                          <MdCancel className='CategoriaEditIcon' />
                        </button>}
                      {Subcategoria === SubcategoriaMap.label && SubcategoriaMap.label !== CategoriaSelecionada &&
                        <button onClick={e => HandleSubmiDeleteSubcategoria(Subcategoria)}>
                          <MdDelete className='CategoriaEditIcon' />
                        </button>}
                    </span>
                  </ListGroup.Item>
                })}


                <ListGroup.Item action as="li">
                  <span className='CategoriaListItem' >
                    <form onSubmit={HandleSubmiAddSubcategoria} className='CategoriaListItem'>
                      <input maxLength={MaxLengthCategorias} type="text" placeholder='Nova SubCategoria' value={NewSubcategoria} onChange={e => setNewSubcategoria(e.target.value)} />
                      <button>
                        <MdAddCircle />
                      </button>
                    </form>

                  </span>
                </ListGroup.Item>



              </ListGroup>
            </div>
          }

        </div>



        <div className='CenariosUrgencias'>

          <div className='CategoriasListGroup'>
            <ListGroup as="ul">
              <ListGroup.Item as="li" className='CeneariosListGrouItemTitulo' active>
                Lista de Cenários
              </ListGroup.Item>

              {props.Dados.cenarios.map(Categoria => {
                return <ListGroup.Item key={Categoria.value + v4()} action as="li">
                  <span className='CategoriaListItem' onClick={e => { setCenarioSelecionado(Categoria.value); }}>

                    {EditingCenarios && CenarioSelecionado !== Categoria.value &&
                      <span onClick={e => { setEditingCenarios(false); }}> {Categoria.value}</span>}

                    {!EditingCenarios &&
                      <span onDoubleClick={e => initEditingCenarios(Categoria.value)}> {Categoria.value}</span>}

                    {CenarioSelecionado === Categoria.value && EditingCenarios &&
                      <form onSubmit={e => HandleSubmiChangeCenarioName(e, Categoria.value.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, ""))}>
                        <input maxLength={MaxLengthCategorias} className='InputChangeCategoryName' defaultValue={Categoria.value} id={Categoria.value.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")} type="text" />
                      </form>

                    }

                    {CenarioSelecionado === Categoria.value && !EditingCenarios &&
                      <button onClick={e => initEditingCenarios(Categoria.value)}>
                        <MdModeEditOutline className='CategoriaEditIcon' />
                      </button>}

                    {CenarioSelecionado === Categoria.value && EditingCenarios &&
                      <button onClick={e => EndEditingCenarios()}>
                        <MdCancel className='CategoriaEditIcon' />
                      </button>}
                    {CenarioSelecionado === Categoria.value &&
                      <button onClick={e => HandleDeleteCenario(CenarioSelecionado)}>
                        <MdDelete className='CategoriaEditIcon' />
                      </button>}
                    {!CenarioSelecionado && <FiChevronRight />}
                    {CenarioSelecionado === Categoria.value && <FiChevronRight />}

                  </span>
                </ListGroup.Item>
              })



              }

              <ListGroup.Item action as="li">
                <span className='CategoriaListItem' >
                  <form onSubmit={HandleSubmiAddCenario} className='CategoriaListItem'>
                    <input maxLength={MaxLengthCategorias} type="text" placeholder='Novo Cenário' value={NewCenario} onChange={e => setNewCenario(e.target.value)} />
                    <button>
                      <MdAddCircle />
                    </button>
                  </form>

                </span>
              </ListGroup.Item>



            </ListGroup>
          </div>


























































          <div className='CategoriasListGroup'>
            <ListGroup as="ul">
              <ListGroup.Item as="li" className='UrgenciaListGrouItemTitulo' active>
                Lista de Urgencias
              </ListGroup.Item>

              {props.Dados.urgencia.map(Urgencia => {
                return <ListGroup.Item key={Urgencia.value + v4()} action as="li">
                  <span className='CategoriaListItem' onClick={e => { setUrgenciaSelecionada(Urgencia.value); }}>

                    {EditingUrgencias && UrgenciaSelecionada !== Urgencia.value &&
                      <span onClick={e => { setEditingUrgencias(false); }}> {Urgencia.value}</span>}

                    {!EditingUrgencias &&
                      <span onDoubleClick={e => initEditingUrgencias(Urgencia.value)}> {Urgencia.value}</span>}

                    {UrgenciaSelecionada === Urgencia.value && EditingUrgencias &&
                      <form onSubmit={e => HandleSubmiChangeUrgenciaName(e, Urgencia.value.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, ""))}>
                        <input maxLength={MaxLengthCategorias} className='InputChangeCategoryName' defaultValue={Urgencia.value} id={Urgencia.value.replaceAll(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, "")} type="text" />
                      </form>

                    }

                    {UrgenciaSelecionada === Urgencia.value && !EditingUrgencias &&
                      <button onClick={e => initEditingUrgencias(Urgencia.value)}>
                        <MdModeEditOutline className='CategoriaEditIcon' />
                      </button>}

                    {UrgenciaSelecionada === Urgencia.value && EditingUrgencias &&
                      <button onClick={e => EndEditingUrgencias()}>
                        <MdCancel className='CategoriaEditIcon' />
                      </button>}
                    {UrgenciaSelecionada === Urgencia.value &&
                      <button onClick={e => HandleDeleteUrgencia(UrgenciaSelecionada)}>
                        <MdDelete className='CategoriaEditIcon' />
                      </button>}
                    {!UrgenciaSelecionada && <FiChevronRight />}
                    {UrgenciaSelecionada === Urgencia.value && <FiChevronRight />}

                  </span>
                </ListGroup.Item>
              })



              }

              <ListGroup.Item action as="li">
                <span className='CategoriaListItem' >
                  <form onSubmit={HandleSubmiAddUrgencia} className='CategoriaListItem'>
                    <input maxLength={MaxLengthCategorias} type="text" placeholder='Nova Urgencia' value={NewUrgencia} onChange={e => setNewUrgencia(e.target.value)} />
                    <button>
                      <MdAddCircle />
                    </button>
                  </form>

                </span>
              </ListGroup.Item>



            </ListGroup>
          </div>







        </div>






      </div>

    </div>
  );
}

const ConnectedCategorias = connect((state) => {
  return {
    LoggedUser: state.LoggedUser,
    Usuario: state.Usuarios.find(Usuario => {
      return Usuario.email === state.LoggedUser.email
    }),
    Dados: state.Dados
  }
})(Categorias)

export default ConnectedCategorias

