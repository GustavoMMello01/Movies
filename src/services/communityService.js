import { db } from "../firebaseConfig"
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";

/**
 * Busca a lista de amigos do usuário autenticado com detalhes dos amigos.
 * @param {string} userId - ID do usuário autenticado.
 * @returns {Promise<Array>} - Lista de amigos do usuário com informações detalhadas.
 */
export const fetchFriends = async (userId) => {
  try {
    const friendsRef = collection(db, "friends");
    const q = query(friendsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const friends = [];
    for (const docSnapshot of querySnapshot.docs) {
      const friendData = docSnapshot.data();
      const userDoc = await getDoc(doc(db, "users", friendData.friendId));
      if (userDoc.exists()) {
        friends.push({ id: docSnapshot.id, ...userDoc.data() }); // Inclui dados do usuário amigo
      }
    }

    return friends;
  } catch (error) {
    console.error("Erro ao buscar amigos:", error);
    throw error;
  }
};

/**
 * Remove um amigo da lista de amigos do usuário autenticado.
 * @param {string} relationId - ID do documento do relacionamento de amizade no Firestore.
 * @returns {Promise<void>}
 */
export const removeFriend = async (relationId) => {
  try {
    const friendDocRef = doc(db, "friends", relationId); // Referência ao documento do relacionamento
    await deleteDoc(friendDocRef); // Remove o documento
  } catch (error) {
    console.error("Erro ao remover amigo:", error);
    throw error; // Lança o erro para ser tratado no front-end
  }
};

/**
 * Busca usuários na coleção de usuários com base em uma query.
 * @param {string} queryText - Texto da busca.
 * @returns {Promise<Array>} - Lista de usuários correspondentes à busca.
 */
export const searchUsers = async (queryText) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("displayName", ">=", queryText),
      where("displayName", "<=", queryText + "\uf8ff")
    );
    const querySnapshot = await getDocs(q);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

/**
 * Adiciona um novo amigo à lista de amigos do usuário.
 * @param {string} userId - ID do usuário autenticado.
 * @param {string} friendId - ID do amigo a ser adicionado.
 * @returns {Promise<void>}
 */
export const addFriend = async (userId, friendId) => {
  try {
    const friendsRef = collection(db, "friends");
    const q = query(
      friendsRef,
      where("userId", "==", userId),
      where("friendId", "==", friendId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Apenas adiciona se a amizade ainda não existir
      await addDoc(friendsRef, {
        userId,
        friendId,
      });
    } else {
      console.log("Amizade já existente.");
    }
  } catch (error) {
    console.error("Erro ao adicionar amigo:", error);
    throw error;
  }
};
