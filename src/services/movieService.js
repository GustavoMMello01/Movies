import { db } from "../firebaseConfig";
import { collection, doc, setDoc, addDoc, getDocs, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

/**
 * Cria uma nova lista de filmes.
 * @param {string} title - Título da lista.
 * @param {string} description - Descrição da lista.
 * @param {string} ownerId - UID do criador da lista.
 * @returns {Promise<string>} - Retorna o ID da lista criada.
 */
export const createMovieList = async (title, description, ownerId) => {
  try {
    const listRef = doc(collection(db, "movieLists")); // Cria o documento com ID automático
    await setDoc(listRef, {
      title,
      description,
      ownerId,
      followers: [], // Nenhum seguidor inicialmente
    });
    return listRef.id; // Retorna o ID da lista criada
  } catch (error) {
    console.error("Erro ao criar lista:", error);
    throw error;
  }
};

/**
 * Adiciona um filme a uma lista existente.
 * @param {string} listId - ID da lista onde o filme será adicionado.
 * @param {object} movieData - Dados do filme (title, rating, genre, etc.).
 */
export const addMovieToList = async (listId, movieData) => {
  try {
    const moviesRef = collection(db, `movieLists/${listId}/movies`);
    await addDoc(moviesRef, movieData);
  } catch (error) {
    console.error("Erro ao adicionar filme à lista:", error);
    throw error;
  }
};

/**
 * Busca todas as listas de filmes criadas por um usuário.
 * @param {string} ownerId - UID do criador das listas.
 * @returns {Promise<Array>} - Retorna um array de listas.
 */
export const fetchUserMovieLists = async (ownerId) => {
  try {
    const listsSnapshot = await getDocs(collection(db, "movieLists"));
    const lists = listsSnapshot.docs
      .filter((doc) => doc.data().ownerId === ownerId)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return lists;
  } catch (error) {
    console.error("Erro ao buscar listas de filmes do usuário:", error);
    throw error;
  }
};

/**
 * Busca os filmes de uma lista específica.
 * @param {string} listId - ID da lista.
 * @returns {Promise<Array>} - Retorna um array de filmes.
 */
export const fetchMoviesFromList = async (listId) => {
  try {
    // Acessa a subcoleção "movies" dentro de um documento específico de "movieLists"
    const moviesRef = collection(db, "movieLists", listId, "movies");
    const moviesSnapshot = await getDocs(moviesRef);

    // Mapeia os documentos encontrados para um array
    const movies = moviesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return movies;
  } catch (error) {
    console.error("Erro ao buscar filmes da lista:", error);
    throw error;
  }
};


/**
 * Remove um filme específico de uma lista.
 * @param {string} listId - ID da lista.
 * @param {string} movieId - ID do filme a ser removido.
 */
export const removeMovieFromList = async (listId, movieId) => {
  try {
    const movieRef = doc(db, `movieLists/${listId}/movies/${movieId}`);
    await deleteDoc(movieRef);
  } catch (error) {
    console.error("Erro ao remover filme da lista:", error);
    throw error;
  }
};

/**
 * Atualiza os dados de um filme em uma lista.
 * @param {string} listId - ID da lista.
 * @param {string} movieId - ID do filme.
 * @param {object} updatedData - Dados atualizados do filme.
 */
export const updateMovieInList = async (listId, movieId, updatedData) => {
  try {
    const movieRef = doc(db, `movieLists/${listId}/movies/${movieId}`);
    await updateDoc(movieRef, updatedData);
  } catch (error) {
    console.error("Erro ao atualizar filme na lista:", error);
    throw error;
  }
};

/**
 * Deleta uma lista de filmes e sua subcoleção de filmes.
 * @param {string} listId - ID da lista.
 */
export const deleteMovieList = async (listId) => {
  try {
    const moviesRef = collection(db, `movieLists/${listId}/movies`);
    const moviesSnapshot = await getDocs(moviesRef);

    // Deleta todos os filmes da subcoleção
    for (const movieDoc of moviesSnapshot.docs) {
      await deleteDoc(doc(db, `movieLists/${listId}/movies/${movieDoc.id}`));
    }

    // Deleta a lista em si
    const listRef = doc(db, `movieLists/${listId}`);
    await deleteDoc(listRef);
  } catch (error) {
    console.error("Erro ao deletar lista de filmes:", error);
    throw error;
  }
};

/**
 * Segue uma lista de filmes.
 * @param {string} userId - UID do usuário que está seguindo a lista.
 * @param {string} listId - ID da lista a ser seguida.
 */
export const followMovieList = async (userId, listId) => {
  try {
    // Atualiza a lista para incluir o usuário nos seguidores
    const listRef = doc(db, `movieLists/${listId}`);
    await updateDoc(listRef, {
      followers: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Erro ao seguir lista de filmes:", error);
    throw error;
  }
};

/**
 * Deixa de seguir uma lista de filmes.
 * @param {string} userId - UID do usuário que está deixando de seguir a lista.
 * @param {string} listId - ID da lista.
 */
export const unfollowMovieList = async (userId, listId) => {
  try {
    // Remove o usuário da lista de seguidores
    const listRef = doc(db, `movieLists/${listId}`);
    await updateDoc(listRef, {
      followers: arrayRemove(userId),
    });
  } catch (error) {
    console.error("Erro ao deixar de seguir lista de filmes:", error);
    throw error;
  }
};
