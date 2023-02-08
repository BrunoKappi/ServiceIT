export const emailADM = 'admin@serviceit.com'


export const Filteroptions = [
    { value: 'Mais recentes', label: 'Mais Recentes' },
    { value: 'Mais antigos', label: 'Mais antigos' },
    { value: 'Status', label: 'Status' },
    { value: 'Descrição', label: 'Descrição' }
]
export const FilterStatusoptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Aberto', label: 'Aberto' },
    { value: 'Em Andamento', label: 'Em andamento' },
    { value: 'Concluído', label: 'Concluído' }
]


export const LoadingTime = 400


export const DefaultChamado = {
    ID: '',
    Descricao: '',
    InfoAdicional: '',
    CategoriaSelecionada: '',
    Subcategoria: '',
    Cenario: '',
    Urgencia: '',
    Solicitante: {
        NomeSolicitante: '',
        EmailSolicitante: '',
        Cidade: '',
        Estado: '',
        Telefone: '',
    },
    Andamento: {
        Responsavel: {},
        Mensagens: [],
        DataHoraAbertura: 0,
        DataHoraConclusao: 0,
        Status: 'Aberto',
    },
    AberturaDeTerceiros: {
        Status: 'Não',
        NomeSolicitante: '',
        EmailSolicitante: '',
        Telefone: ''
    },
    Anexo: {
        NomeArquivo: '',
        Url: '',
        Tipo: ''
    }
}

export const DefaultLoggedUser = {
    email: '',
    uid: '',
    photoURL: '',
    SidebarActive: true,
    CurrentSidebarTab: 'DashBoard',
    ChamadoListening: '',
    Listening: false
}


export const DropAbertoStyle = {
    display: 'flex'
}


export const DropFechadoStyle = {
    display: 'none'
}


export const DropInfoAbertoStyle = {
    display: 'flex'
}

export const DropInfoFechadoStyle = {
    height: '10px',
    overflow: 'hidden',
    minHeiht: 'none',
    padding: '0',
    paddingTop: '2rem'
}


export const DisplayFlex = {
    display: 'flex'
}


export const DisplayGrid = {
    display: 'grid'
}



export const DisplayNone = {
    display: 'none'
}


export const MaxLengthCategorias = 50

export const MaxSizeAttachFile = 10148205

export const MaxLengthDescChamado = 150

export const MaxLengthInfoAdicionalChamado = 1000

export const MaxLengthNome = 50

export const MaxLengthEmail = 60

export const MaxLengthEmpresa = 40


export const MinDateNascimento = '1899-01-01'

export const MaxDateNascimento = '2010-01-01'


