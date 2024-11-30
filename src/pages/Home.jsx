import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import WelcomeBanner from "../components/WelcomeBanner";
import ModalCreateList from "../components/modals/ModalCreateList"; // Importa o ModalCreateList
import toast from "react-hot-toast";
import { createMovieList, fetchUserMovieLists, fetchMoviesFromList } from "../services/movieService";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userLists, setUserLists] = useState([]);
  const [listMoviesCount, setListMoviesCount] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchLists();
    }
  }, [user, navigate]);

  const fetchLists = async () => {
    try {
      const lists = await fetchUserMovieLists(user.uid);
      setUserLists(lists);

      const moviesCount = {};
      for (const list of lists) {
        const movies = await fetchMoviesFromList(list.id);
        moviesCount[list.id] = movies.length;
      }
      setListMoviesCount(moviesCount);
    } catch (error) {
      console.error("Erro ao buscar listas do usuário:", error);
    }
  };

  const handleCreateList = async () => {
    if (!newListTitle || !newListDescription) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    try {
      await createMovieList(newListTitle, newListDescription, user.uid);
      setNewListTitle("");
      setNewListDescription("");
      setIsModalOpen(false); // Fecha o modal
      toast.success("Lista criada com sucesso!");
      fetchLists();
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      toast.error("Erro ao criar lista!");
    }
  };

  const handleEditList = (listId) => {
    navigate(`/list/${listId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onLogout={logout} />
      <main className="flex-grow p-4">
        <WelcomeBanner
          title={`Bem vindo, ${user.displayName || "Usuário"}!`}
          text="Gerencie suas listas de filmes, compartilhe com amigos e acompanhe as listas que você segue."
        />

        <div className="mb-6">
          <div className="flex justify-between items-center my-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Minhas Listas
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Nova Lista
            </button>
          </div>
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
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {listMoviesCount[list.id] || 0} filme(s)
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

      {/* Modal para criar nova lista */}
      <ModalCreateList
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={newListTitle}
        description={newListDescription}
        onChangeTitle={(e) => setNewListTitle(e.target.value)}
        onChangeDescription={(e) => setNewListDescription(e.target.value)}
        onCreate={handleCreateList}
      />
    </div>
  );
};

export default Home;
