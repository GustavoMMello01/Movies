import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ModalConfirmDelete from "../components/modals/ModalConfirmDelete";
import { fetchUserMovieLists, fetchMoviesFromList, deleteMovieList } from "../services/movieService";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userLists, setUserLists] = useState([]);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalHours: 0,
    avgRating: 0,
    favoriteGenre: "",
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchListsAndStats();
    }
  }, [user]);

  const fetchListsAndStats = async () => {
    try {
      const lists = await fetchUserMovieLists(user.uid);
      setUserLists(lists);

      // Estatísticas
      let totalMovies = 0;
      let totalHours = 0;
      let totalRatings = 0;
      let ratingCount = 0;
      const genreCount = {};

      for (const list of lists) {
        const movies = await fetchMoviesFromList(list.id);

        totalMovies += movies.length;

        movies.forEach((movie) => {
          totalHours += Number(movie.duration || 0); // Soma a duração dos filmes
          if (movie.rating) {
            totalRatings += Number(movie.rating); // Soma as notas
            ratingCount++;
          }
          if (movie.genre) {
            genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1; // Conta os gêneros
          }
        });
      }

      const favoriteGenre = Object.keys(genreCount).reduce(
        (a, b) => (genreCount[a] > genreCount[b] ? a : b),
        "N/A"
      );

      setStats({
        totalMovies,
        totalHours,
        avgRating: ratingCount ? (totalRatings / ratingCount).toFixed(1) : 0,
        favoriteGenre: favoriteGenre || "N/A",
      });
    } catch (error) {
      console.error("Erro ao buscar listas e filmes:", error);
    }
  };

  const handleDeleteList = async () => {
    if (!selectedListId) return;

    try {
      await deleteMovieList(selectedListId);
      toast.success("Lista removida com sucesso!");
      fetchListsAndStats(); // Atualiza listas e estatísticas após remoção
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

  const navigateToListEdit = (listId) => {
    navigate(`/list/${listId}`);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow p-4">
        <div className="bg-blue-500 text-white shadow rounded-lg p-6 flex flex-col items-center mb-6">
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt={user.displayName}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{user.displayName}</h1>
          <p>{user.email}</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Filmes assistidos
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {stats.totalMovies}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Horas assistidas
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {Math.floor(stats.totalHours / 60)}h {stats.totalHours % 60}min
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Nota média
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {stats.avgRating}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Gênero favorito
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {stats.favoriteGenre}
            </p>
          </div>
        </div>

        {/* Minhas Listas */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Minhas Listas de Filmes
          </h2>
          {userLists.length > 0 ? (
            <ul className="space-y-4">
              {userLists.map((list) => (
                <li
                  key={list.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className="font-bold text-gray-800 dark:text-gray-100 cursor-pointer"
                      onClick={() => navigateToListEdit(list.id)}
                    >
                      {list.title}
                    </h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => navigateToListEdit(list.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Editar Lista
                      </button>
                      <button
                        onClick={() => openConfirmModal(list.id)}
                        className="text-red-500 hover:underline"
                      >
                        Remover Lista
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {list.description}
                  </p>
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

      <ModalConfirmDelete
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteList}
        text="Tem certeza que deseja remover esta lista? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default UserProfile;
