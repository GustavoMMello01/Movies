import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import WelcomeBanner from "../components/WelcomeBanner";
import ModalCreateList from "../components/modals/ModalCreateList";
import ModalConfirmDelete from "../components/modals/ModalConfirmDelete";
import ModalEditCommunity from "../components/modals/ModalEditCommunity"; // Importa o ModalEditCommunity
import toast from "react-hot-toast";
import {
  createMovieList,
  fetchUserMovieLists,
  fetchMoviesFromList,
  deleteMovieList,
} from "../services/movieService";
import { fetchFriends } from "../services/communityService";
import { FaTimes } from "react-icons/fa";
import default_avatar from "../assets/default_avatar.png";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userLists, setUserLists] = useState([]);
  const [listMoviesCount, setListMoviesCount] = useState({});
  const [friends, setFriends] = useState([]);
  const [friendsLists, setFriendsLists] = useState([]); // Listas de filmes dos amigos
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchLists();
      fetchFriendsList();
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

  const fetchFriendsList = async () => {
    try {
      const friendsList = await fetchFriends(user.uid);
      setFriends(friendsList);

      // Fetch movies lists for each friend
      const friendsListsPromises = friendsList.map(async (friend) => {
        const lists = await fetchUserMovieLists(friend.uid);
        return { friend, lists };
      });

      const resolvedFriendsLists = await Promise.all(friendsListsPromises);
      setFriendsLists(resolvedFriendsLists);
    } catch (error) {
      console.error("Erro ao buscar amigos:", error);
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
      setIsConfirmModalOpen(false);
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

  const navigateToProfile = () => {
    navigate("/profile/me");
  };

  const navigateToFriendProfile = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  const navigateToFriendList = (listId) => {
    navigate(`/list/${listId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
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
            <div>
              <ul className="mt-2 space-y-2">
                {userLists.slice(0, 5).map((list) => (
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
                        onClick={() => openConfirmModal(list.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {userLists.length > 5 && (
                <div className="text-center mt-4">
                  <button
                    onClick={navigateToProfile}
                    className="text-blue-500 hover:underline"
                  >
                    Ver todas as listas
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Você ainda não criou nenhuma lista.
            </p>
          )}
        </div>

        {/* Seção de Amigos */} 
        <div className="mb-6">
          <div className="flex justify-between items-center my-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Amigos
            </h2>
            <button
              onClick={() => setIsFriendsModalOpen(true)}
              className="text-blue-500 hover:underline"
            >
              Ver mais
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {friends.slice(0, 5).map((friend) => (
              <img
                key={friend.uid}
                src={friend.photoURL || default_avatar}
                alt={friend.displayName}
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
                onClick={() => navigateToFriendProfile(friend.uid)}
              />
            ))}
          </div>
        </div>

        {/* Amigos e suas listas de filmes */}
        <div className="mb-6">
          <div className="flex justify-between items-center my-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Amigos e suas Listas
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {friendsLists.map(({ friend, lists }) => (
              <div
                key={friend.uid}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow"
              >
                <div
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => navigateToFriendProfile(friend.uid)}
                >
                  <img
                    src={friend.photoURL || default_avatar}
                    alt={friend.displayName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {friend.displayName}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {lists.slice(0, 2).map((list) => (
                    <div
                      key={list.id}
                      onClick={() => navigateToFriendList(list.id)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">
                        {list.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {listMoviesCount[list.id] || 0} filme(s)
                      </p>
                    </div>
                  ))}
                  {lists.length > 2 && (
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      +{lists.length - 2} listas
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <ModalCreateList
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={newListTitle}
        description={newListDescription}
        onChangeTitle={(e) => setNewListTitle(e.target.value)}
        onChangeDescription={(e) => setNewListDescription(e.target.value)}
        onCreate={handleCreateList}
      />

      <ModalConfirmDelete
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteList}
        text="Tem certeza que deseja remover esta lista? Esta ação não pode ser desfeita."
      />

      <ModalEditCommunity
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
        userId={user.uid}
        onUpdateFriends={fetchFriendsList}
      />
    </div>
  );
};

export default Home;
