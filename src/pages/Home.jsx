import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import WelcomeBanner from "../components/WelcomeBanner";
import ModalCreateList from "../components/modals/ModalCreateList";
import ModalConfirmDelete from "../components/modals/ModalConfirmDelete";
import toast from "react-hot-toast";
import { createMovieList, fetchUserMovieLists, fetchMoviesFromList, deleteMovieList } from "../services/movieService";
import { FaTimes } from "react-icons/fa";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userLists, setUserLists] = useState([]);
  const [listMoviesCount, setListMoviesCount] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Estado do modal de confirmação
  const [selectedListId, setSelectedListId] = useState(null); // ID da lista a ser deletada
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
      setIsModalOpen(false);
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

  const handleDeleteList = async () => {
    if (!selectedListId) return;

    try {
      await deleteMovieList(selectedListId);
      toast.success("Lista removida com sucesso!");
      fetchLists();
      setIsConfirmModalOpen(false); // Fecha o modal após a remoção
      setSelectedListId(null);
    } catch (error) {
      console.error("Erro ao remover lista:", error);
      toast.error("Erro ao remover lista!");
    }
  };

  const openConfirmModal = (listId) => {
    setSelectedListId(listId);
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onLogout={logout} />
      <main className="flex-grow p-4">
        <WelcomeBanner
          title={`Bem-vindo, ${user.displayName || "Usuário"}!`}
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
                  <div className="flex-1 mr-4">
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
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleEditList(list.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openConfirmModal(list.id)} // Abre o modal de confirmação
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
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

      {/* Modal para confirmação de exclusão */}
      <ModalConfirmDelete
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteList}
        text="Tem certeza que deseja remover esta lista? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default Home;
