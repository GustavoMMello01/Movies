import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchUserMovieLists, fetchMoviesFromList } from "../services/movieService";
import { fetchUserData } from "../services/userService";
import default_avatar from "../assets/default_avatar.png";

const Profile = () => {
  const { userId } = useParams(); // ID do usuário cujos dados estão sendo exibidos
  const [userData, setUserData] = useState(null); // Dados do usuário
  const [movieStats, setMovieStats] = useState({
    totalMovies: 0,
    totalHours: 0,
    avgRating: 0,
    favoriteGenre: "",
  });
  const [userLists, setUserLists] = useState([]); // Listas de filmes do usuário

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      // Busca listas de filmes do usuário
      const lists = await fetchUserMovieLists(userId);
      setUserLists(lists);

      // Calcula estatísticas
      const stats = await calculateMovieStats(lists);
      setMovieStats(stats);

      // Busca os dados do usuário
      const user = await fetchUserData(userId);
      setUserData(user);
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
    }
  };

  const calculateMovieStats = async (lists) => {
    let totalMovies = 0;
    let totalHours = 0;
    let totalRatings = 0;
    let ratingCount = 0;
    const genreCount = {};

    for (const list of lists) {
      const movies = await fetchMoviesFromList(list.id);
      totalMovies += movies.length;

      movies.forEach((movie) => {
        totalHours += Number(movie.duration || 0);
        if (movie.rating) {
          totalRatings += Number(movie.rating);
          ratingCount++;
        }
        if (movie.genre) {
          genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
        }
      });
    }

    // Calcula o gênero favorito
    const favoriteGenre = Object.keys(genreCount).reduce(
      (a, b) => (genreCount[a] > genreCount[b] ? a : b),
      ""
    );

    return {
      totalMovies,
      totalHours,
      avgRating: ratingCount ? (totalRatings / ratingCount).toFixed(1) : 0,
      favoriteGenre,
    };
  };

  if (!userData) {
    return <p className="text-gray-600 dark:text-gray-400">Carregando...</p>;
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
        <div className="grid grid-cols-2 gap-4 mb-6">
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
              {movieStats.favoriteGenre || "N/A"}
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
