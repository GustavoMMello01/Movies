import React, { useEffect, useState } from "react";
import { fetchCollection, addDocument } from "../services/firestoreService";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Importa o Header

const Home = () => {
  const { user, logout } = useAuth(); // Obtém o usuário e a função de logout do contexto
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redireciona se o usuário não estiver autenticado
    } else {
      fetchMovies();
    }
  }, [user, navigate]);

  const fetchMovies = async () => {
    try {
      const data = await fetchCollection("movies");
      setMovies(data);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  };

  const addMovie = async () => {
    try {
      if (newMovie) {
        await addDocument("movies", { title: newMovie, userId: user.uid });
        setNewMovie("");
        fetchMovies();
      }
    } catch (error) {
      console.error("Erro ao adicionar filme:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return null; // Garante que nada seja renderizado enquanto redireciona
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Usa o componente Header */}
      <Header onLogout={handleLogout} />

      {/* Conteúdo principal */}
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Minha Lista de Filmes
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newMovie}
            onChange={(e) => setNewMovie(e.target.value)}
            placeholder="Adicione um filme"
            className="flex-grow border border-gray-300 dark:border-gray-700 rounded px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
          />
          <button
            onClick={addMovie}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Adicionar
          </button>
        </div>
        <ul className="space-y-2">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="bg-white dark:bg-gray-800 shadow p-4 rounded flex justify-between items-center"
            >
              <span className="text-gray-800 dark:text-gray-100">{movie.title}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;
