import React, { useEffect, useState } from "react";
import { fetchCollection, addDocument } from "../services/firestoreService";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Cabeçalho minimalista */}
      <header className="p-4 bg-white shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={user.photoURL || "/default-avatar.png"} // Foto do usuário
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-gray-800 font-medium">
            Olá, {user.displayName || "Usuário"}!
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Logout
        </button>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Minha Lista de Filmes
        </h1>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newMovie}
            onChange={(e) => setNewMovie(e.target.value)}
            placeholder="Adicione um filme"
            className="flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="bg-white shadow p-4 rounded flex justify-between items-center"
            >
              <span className="text-gray-800">{movie.title}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;
