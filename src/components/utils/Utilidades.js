import store from '../store/store'
import { editUsuarioAction, addUsuarioAction } from '../store/actions/UsuariosActions'
import { setNotification } from '../store/actions/NotificationActions';
import { setDados } from '../store/actions/DadosActions'
import { SetSidebarTag, ToggleSideBar, clearLoggedUser } from '../store/actions/LoggedUserActions'
import { UpdateDadosPortal } from '../firebase/metodos'
//import { useNavigate } from 'react-router-dom';
import { logout, signInWithGoogle } from '../firebase/auth'
import { addChamadoAction } from '../store/actions/ChamadosActions'
import { CreateChamado } from '../firebase/metodos'
import { setChamados } from '../store/actions/ChamadosActions'
import { setLoggedUser, setChamadoListening } from '../store/actions/LoggedUserActions'
import { login, mudarSenha } from '../firebase/auth'
import { ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from '../firebase/index'
import { updateUser, createUsuario, updateChamado, getChamados, setListeningChamado, stopListening, getDadosPortal } from '../firebase/metodos'
import { setUsuarios } from '../store/actions/UsuariosActions';
import { resetarSenha } from "../firebase/auth";

// FIREBASE

const atualizaDadosFirebase = (NovosDados) => {
    //console.log("Atualiza Dados")
    UpdateDadosPortal(NovosDados)
}

export const Login = (Email, Senha) => {
    return login(Email, Senha)
}

export const ResetarSenha = (Email) => {
    return resetarSenha(Email)
}

export const MudarSenha = (NovaSenha) => {
    return mudarSenha(NovaSenha)
}

export const ImageUpload = (ImagePath, ImageToUpload) => {
    const imageRef = ref(storage, ImagePath);
    return uploadBytes(imageRef, ImageToUpload)
}


export const FileUpload = (FilePath, FileToUpload) => {
    const fileRef = ref(storage, FilePath);
    return uploadBytesResumable(fileRef, FileToUpload)
}

export const GetUserUrlImage = (path) => {

    return getDownloadURL(ref(storage, path))


    //return getDownloadURL(item)




}

export const ListarImagens = () => {
    return listAll(ref(storage, "images/"))
}


export const UpdateUser = (EditedUser) => {
    return updateUser(EditedUser)
}

export const UpdateChamado = (Chamado) => {
    return updateChamado(Chamado)
}

export const CreateUsuarioFirebase = (NovoUsuario) => {
    return createUsuario(NovoUsuario)
}

export const LogarComGooglePopup = () => {
    return signInWithGoogle()
}

export const GetChamados = () => {
    //console.log("Get Chamados")
    return getChamados() 
}

export const InitListeningChamado = (docID) => {
    if (store.getState().LoggedUser.ChamadoListening === '')
        SetChamadoListening(docID)
    return setListeningChamado(docID)
}

export const StopListening = () => {
    return stopListening(store.getState().LoggedUser.ChamadoListening)
}

export const DeleteFile = (path) => {

    const desertRef = ref(storage, path);
    return deleteObject(desertRef)

}


export const UploadFileToFirebase = (file, path, progressCallback, FinalURLCallback) => {
    //console.log(file.name)
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_changed",
        (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            progressCallback(progress);
            return progress
        }, (error) => {
            alert(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                /* const xhr = new XMLHttpRequest();
             xhr.responseType = 'blob';
             xhr.onload = (event) => {
                 const blob = xhr.response;
             };
             xhr.open('GET', downloadURL);
             xhr.send();
             */
                //console.log("URL GERADO", downloadURL)
                FinalURLCallback(downloadURL)
            });
        }
    );
}









// REDUX STORE 


export const Notificar = (Mensagem) => {
    store.dispatch(setNotification({ descricao: Mensagem }))
}

export const SetChamadoListening = (docID) => {
    //console.log(docID)
    store.dispatch(setChamadoListening(docID))
}

export const GetListeningState = () => {
    return store.getState().Listening
}

export const EditarUsuario = (uid, usuarioEditado) => {
    store.dispatch(editUsuarioAction(uid, usuarioEditado))
}

export const SetDados = (NovosDados) => {
    //console.log("Set Dados")
    store.dispatch(setDados({ ...NovosDados }))
    atualizaDadosFirebase({ ...NovosDados })
}

export const SetUsuarios = (Usuarios) => {
    store.dispatch(setUsuarios(Usuarios))
}

export const SetTab = (Tab) => {
    store.dispatch(SetSidebarTag(Tab))
}


export const ToggleSidebar = (Valor) => {
    store.dispatch(ToggleSideBar(Valor))
}


export const AddChamado = (Chamado) => {
    store.dispatch(addChamadoAction(Chamado))
    CreateChamado(Chamado)
}

export const CreateUsuario = (UsuarioNovo) => {
    store.dispatch(addUsuarioAction(UsuarioNovo))
    CreateUsuarioFirebase(UsuarioNovo)
}


export const SetChamados = (Chamados) => {
    store.dispatch(setChamados(Chamados))
}

export const SetLoggedUser = (User) => {
    store.dispatch(setLoggedUser(User))
}

export const ClearLoggedUser = () => {
    store.dispatch(clearLoggedUser())
}


export const GetDadosPortal = () => {
    getDadosPortal().then(DATA => {
        store.dispatch(setDados(DATA[0]))
    })

}


export const SetChamado = (ChamadoAlterado) => {

    const Chamados = [...store.getState().Chamados]
    var ChamadoAtual = Chamados.find(Chamado => { return Chamado.ID === ChamadoAlterado.ID })

    if (ChamadoAlterado.Andamento.Mensagens.length !== ChamadoAtual.Andamento.Mensagens.length) {
        ////console.log("Atual", ChamadoAlterado.Andamento.Mensagens)
        ////console.log("Novo", ChamadoAtual.Andamento.Mensagens)
        ChamadoAtual = { ...ChamadoAlterado }
        const NovosChamados = Chamados.filter(Chamado => { return Chamado.ID !== ChamadoAlterado.ID })
        NovosChamados.push(ChamadoAtual)
        SetChamados(NovosChamados)
    }




}




//Geral 


export const Sair = () => {
    logout()
    //Nav()
}

export const SairUmaPagina = () => {
    logout()
    //useNavigate('../')
}

