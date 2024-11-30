import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

/**
 * Busca dados de um usuário pelo ID.
 * @param {string} userId - ID do usuário.
 * @returns {Promise<Object>} - Dados do usuário.
 */
export const fetchUserById = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      throw new Error("Usuário não encontrado!");
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};
