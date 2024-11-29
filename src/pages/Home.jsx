import React, { useEffect, useRef, useState } from "react";
import { fetchCollection, fetchUsers } from "../services/firestoreService";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 
import WelcomeBanner from "../components/WelcomeBanner";

const Home = () => {
  const { user, logout } = useAuth(); // Obtém o usuário e a função de logout do contexto
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState("");
  const [search, setSearch] = useState(""); // Input de busca de usuários
  const [users, setUsers] = useState([]); // Lista de usuários filtrados

  const searchRef = useRef(); // Referência para o input de busca

  useEffect(() => {
    if (!user) {
      navigate("/login");
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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const searchUsers = async (query) => {
    setSearch(query);

    if (query.trim() === "") {
      setUsers([]); // Limpa a lista se o input estiver vazio
      return;
    }

    try {
      const allUsers = await fetchUsers(); // Busca todos os usuários
      const filtered = allUsers.filter((u) =>
        u.displayName.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filtered); // Atualiza a lista de usuários com os resultados filtrados
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); // Redireciona para a página de perfil
  };

  // Fecha a lista de resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setUsers([]); // Fecha a lista
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onLogout={handleLogout} />
      <main className="flex-grow p-4">
        <WelcomeBanner
          title={`Bem vindo, ${user.displayName || "Usuário"}!`}
          text="Adicione suas obras favoritas, conecte-se com amigos e descubra o que eles estão assistindo"
        />

        {/* Input para buscar usuários */}
        <div className="mb-6 relative" ref={searchRef}>
          <input
            type="text"
            value={search}
            onChange={(e) => searchUsers(e.target.value)}
            placeholder="Busque por amigos..."
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
          />

          {/* Lista de resultados da busca */}
          {users.length > 0 && (
            <ul className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded max-h-40 overflow-y-auto z-10">
              {users.map((u) => (
                <li
                  key={u.uid}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white"
                  onClick={() => handleUserClick(u.uid)}
                >
                  {u.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Input e lista de filmes */}
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
            onClick={() => {}}
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
