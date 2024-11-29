import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 
import WelcomeBanner from "../components/WelcomeBanner";
import { createMovieList, fetchUserMovieLists, followMovieList, unfollowMovieList } from "../services/movieService";

const Home = () => {
  const { user, logout } = useAuth(); // Obtém o usuário e a função de logout do contexto
  const navigate = useNavigate();

  const [userLists, setUserLists] = useState([]); // Listas do próprio usuário
  const [newListTitle, setNewListTitle] = useState(""); // Título para criar uma nova lista
  const [newListDescription, setNewListDescription] = useState(""); // Descrição da nova lista

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchLists(); // Busca as listas do usuário
    }
  }, [user, navigate]);

  const fetchLists = async () => {
    try {
      const lists = await fetchUserMovieLists(user.uid); // Busca listas do próprio usuário
      setUserLists(lists);
    } catch (error) {
      console.error("Erro ao buscar listas do usuário:", error);
    }
  };

  const handleCreateList = async () => {
    if (!newListTitle || !newListDescription) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    try {
      await createMovieList(newListTitle, newListDescription, user.uid);
      setNewListTitle("");
      setNewListDescription("");
      fetchLists(); // Atualiza as listas após criar uma nova
    } catch (error) {
      console.error("Erro ao criar lista:", error);
    }
  };

  const handleFollowList = async (listId) => {
    try {
      await followMovieList(user.uid, listId);
      alert("Você seguiu esta lista!");
    } catch (error) {
      console.error("Erro ao seguir a lista:", error);
    }
  };

  const handleUnfollowList = async (listId) => {
    try {
      await unfollowMovieList(user.uid, listId);
      alert("Você deixou de seguir esta lista!");
    } catch (error) {
      console.error("Erro ao deixar de seguir a lista:", error);
    }
  };

  const handleEditList = (listId) => {
    navigate(`/list/${listId}`); // Redireciona para a página de edição da lista
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onLogout={logout} />
      <main className="flex-grow p-4">
        <WelcomeBanner
          title={`Bem vindo, ${user.displayName || "Usuário"}!`}
          text="Gerencie suas listas de filmes, compartilhe com amigos e acompanhe as listas que você segue."
        />

        {/* Formulário para criar nova lista */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
            Criar Nova Lista
          </h2>
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Título da Lista"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <textarea
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
            placeholder="Descrição da Lista"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreateList}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Criar Lista
            </button>
          </div>
        </div>

        {/* Listas do próprio usuário */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Minhas Listas
          </h2>
          {userLists.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {userLists.map((list) => (
                <li
                  key={list.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">
                      {list.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {list.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditList(list.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Você ainda não criou nenhuma lista.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
