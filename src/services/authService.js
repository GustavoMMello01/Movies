import { auth, provider, db } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Login com Google e salvar no Firestore
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Salvar ou atualizar informações do usuário no Firestore
    const userRef = doc(db, "users", user.uid); // Documento com o UID do usuário
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
    }, { merge: true }); // 'merge: true' para atualizar sem sobrescrever

    return user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};
