
import { db } from '../../components/firebase/index'
import { collection } from "firebase/firestore";
import { getDocs, addDoc, updateDoc, deleteDoc, doc, where, query, onSnapshot } from "firebase/firestore";
import { SetUsuarios, SetChamados, SetChamado } from '../utils/Utilidades';
import { DefaultChamado } from '../../GlobalVars';

export var usersCollectionRef = collection(db, "tarefas")
var colecao = "tarefas"

export const setCollection = (name, uid) => {
  colecao = name + uid
  usersCollectionRef = collection(db, colecao)
}

export const setUsuariosCollection = () => {
  colecao = "usuarios"
  usersCollectionRef = collection(db, colecao)
}

export const createUsuario = async (UsuarioNovo) => {
  colecao = "usuarios"
  usersCollectionRef = collection(db, colecao)
  await addDoc(usersCollectionRef, UsuarioNovo);
};

export const CreateChamado = async (NovoChamado) => {
  colecao = "chamados"
  usersCollectionRef = collection(db, colecao)
  await addDoc(usersCollectionRef, NovoChamado);
};

//// DADOS PORTAL

export const SetDadosPortal = async (Dados) => {
  colecao = "dadosportal"
  usersCollectionRef = collection(db, colecao)
  await addDoc(usersCollectionRef, Dados);
};


export const getDadosPortal = async () => {
  colecao = "dadosportal"
  usersCollectionRef = collection(db, colecao)
  const data = await getDocs(usersCollectionRef);
  const dados = data.docs.map((doc) => ({ ...doc.data(), docID: doc.id }))
  return dados
}

//// DADOS PORTAL

export const getUsuarios = async () => {
  colecao = "usuarios"
  usersCollectionRef = collection(db, colecao)
  const data = await getDocs(usersCollectionRef);
  const dados = data.docs.map((doc) => ({ ...doc.data(), docID: doc.id }))
  SetUsuarios(dados)


  return dados
}

export const getChamados = async () => {
  colecao = "chamados"
  usersCollectionRef = collection(db, colecao)
  const data = await getDocs(usersCollectionRef)
  const dados = data.docs.map((doc) => ({ ...DefaultChamado, ...doc.data(), docID: doc.id }))
  SetChamados(dados)

  //QUERY
  const q = query(usersCollectionRef, where("Andamento.Status", "!=", "BLA"));

  const querySnapshot = await getDocs(q);
  const dados2 = querySnapshot.docs.map((doc) => {
    return (({ ...doc.data(), docID: doc.id }));
  });

  SetChamados(dados2)
  //QUERY

  return dados
}

export const updateUser = async (EditedUser) => {
  colecao = "usuarios"
  usersCollectionRef = collection(db, colecao)
  const usuaioDoc = doc(db, colecao, EditedUser.docID);
  const newFields = { ...EditedUser };
  await updateDoc(usuaioDoc, newFields);
};





export const setListeningChamado = (docID) => {
  //console.log("Iniciando o Listening", docID)
  return onSnapshot(doc(db, colecao, docID), (doc) => {
    SetChamado(doc.data())
  });
}


export const stopListening = () => {
}


export const UpdateDadosPortal = async (Dados) => {
  colecao = "dadosportal"
  usersCollectionRef = collection(db, colecao)
  const DadosDoc = doc(db, colecao, Dados.docID);
  const newFields = { ...Dados };
  await updateDoc(DadosDoc, newFields);
  //getDadosPortal().then(DATA => {  SetDados(DATA[0])})
};


export const updateChamado = async (EditedChamado) => {
  colecao = "chamados"
  usersCollectionRef = collection(db, colecao)
  const usuaioDoc = doc(db, colecao, EditedChamado.docID);
  const newFields = { ...EditedChamado };
  await updateDoc(usuaioDoc, newFields);
};

export const deleteAllTarefasFirebase = (tarefas, uid) => {
  colecao = "tarefas" + uid
  usersCollectionRef = collection(db, colecao)
  tarefas.map((tarefa) => {
    const tarefaDoc = doc(db, colecao, tarefa.id);
    deleteDoc(tarefaDoc);
    return true
  })
  SetUsuarios([])
}

export const deleteTarefasConcluidasFirebase = (apenasCompletas, uid) => {
  colecao = "tarefas" + uid
  usersCollectionRef = collection(db, colecao)
  apenasCompletas.map((tarefa) => {
    const tarefaDoc = doc(db, colecao, tarefa.id);
    deleteDoc(tarefaDoc);
    return true
  })
}