import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchUserMovieLists, fetchMoviesFromList } from "../services/movieService";
import { fetchUserById } from "../services/userService";
import default_avatar from "../assets/default_avatar.png";

const Profile = () => {
  const { userId } = useParams(); // ID do usuário cujo perfil será exibido
  const [userData, setUserData] = useState(null); // Dados do usuário
  const [movieStats, setMovieStats] = useState({
    totalMovies: 0,
    totalHours: 0,
    avgRating: 0,
    favoriteGenre: "",
  }); // Estatísticas dos filmes
  const [userLists, setUserLists] = useState([]); // Listas de filmes do usuário

  // Função para buscar dados do perfil e filmes
  const fetchProfileData = useCallback(async () => {
    try {
      // Busca os dados do usuário
      const user = await fetchUserById(userId);
      setUserData(user);

      // Busca as listas de filmes do usuário
      const lists = await fetchUserMovieLists(userId);
      setUserLists(lists);

      // Calcula as estatísticas dos filmes
      const stats = await calculateMovieStats(lists);
      setMovieStats(stats);
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Função para calcular as estatísticas dos filmes
  const calculateMovieStats = async (lists) => {
    let totalMovies = 0;
    let totalHours = 0;
    let totalRatings = 0;
    let ratingCount = 0;
    const genreCount = {};

    for (const list of lists) {
      const movies = await fetchMoviesFromList(list.id);

      totalMovies += movies.length;

      for (const movie of movies) {
        const duration = Number(movie.duration || 0);
        const rating = Number(movie.rating || 0);

        totalHours += duration;
        if (rating > 0) {
          totalRatings += rating;
          ratingCount++;
        }
        if (movie.genre) {
          genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
        }
      }
    }

    const favoriteGenre = Object.keys(genreCount).reduce((a, b) =>
      genreCount[a] > genreCount[b] ? a : b,
      ""
    );

    return {
      totalMovies,
      totalHours,
      avgRating: ratingCount ? (totalRatings / ratingCount).toFixed(1) : 0,
      favoriteGenre: favoriteGenre || "N/A",
    };
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-800 dark:text-gray-100">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow p-4">
        {/* Cabeçalho do perfil */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={userData.photoURL || default_avatar}
            alt={userData.displayName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {userData.displayName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {userData.email || "Email não informado"}
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Filmes assistidos
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {movieStats.totalMovies}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Horas assistidas
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {Math.floor(movieStats.totalHours / 60)}h {movieStats.totalHours % 60}min
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Nota média
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {movieStats.avgRating}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              Gênero favorito
            </h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {movieStats.favoriteGenre}
            </p>
          </div>
        </div>

        {/* Listas de filmes */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Listas de Filmes
          </h2>
          {userLists.length > 0 ? (
            <ul className="space-y-4">
              {userLists.map((list) => (
                <li
                  key={list.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded shadow"
                >
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">
                    {list.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {list.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {list.movies?.length || 0} filme(s)
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Este usuário ainda não criou nenhuma lista.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
