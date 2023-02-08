import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, } from "firebase/auth";
import { auth } from "./index";
import { GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, FacebookAuthProvider, updatePassword } from "firebase/auth";
import { SetLoggedUser, ClearLoggedUser } from "../utils/Utilidades";
import { DefaultLoggedUser } from '../../GlobalVars'

onAuthStateChanged(auth, (currentUser) => {
  //console.log("AUTHCHANGED", currentUser ? currentUser : 'VAZIO');
  if (currentUser) {
    const user = {
      ...DefaultLoggedUser,
      email: currentUser.email,
      uid: currentUser.uid,
      photoURL: currentUser.photoURL
    }
    SetLoggedUser(user)
  } else {
    ClearLoggedUser()
  }

})

export const mudarSenha = async (novaSenha) => {
  return updatePassword(auth.currentUser, novaSenha)
}


export const resetarSenha = async (email) => {
  return sendPasswordResetEmail(auth, email)
};

export const register = async (email, senha) => {
  return createUserWithEmailAndPassword(auth, email, senha)
};

export const login = (email, senha) => {
  return signInWithEmailAndPassword(auth, email, senha);
};

export const logout = async () => {
  await signOut(auth);
};


const provider = new GoogleAuthProvider();
const FacebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
    })
    .catch((error) => {
      console.log(error);
    });
};



export const signInWithFacebook = () => {
  signInWithPopup(auth, FacebookProvider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
    })
    .catch((error) => {
      console.log(error);
    });
};