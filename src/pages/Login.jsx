import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { loginWithGoogle } from "../services/authService";
import useDarkMode from "../hooks/useDarkMode";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import logo from "../assets/logo.png"; // Importa o logotipo

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, toggleDarkMode] = useDarkMode(); // Hook para alternar tema

  useEffect(() => {
    if (user) {
      navigate("/"); // Redireciona se já estiver autenticado
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-gray-100 dark:bg-gray-900">
      {/* Modo noturno no topo */}
      <div className="p-4 flex justify-end">
        <IconButton onClick={toggleDarkMode} color="inherit">
          {isDarkMode ? (
            <Brightness7Icon className="text-yellow-400" />
          ) : (
            <Brightness4Icon className="text-gray-600 dark:text-gray-300" />
          )}
        </IconButton>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Logotipo */}
        <img
          src={logo}
          alt="FlixReview Logo"
          className="w-24 h-24 mb-4" // Define o tamanho do logotipo
        />
        <div className="text-center mb-8">
          {/* Título do app */}
          <h1 className="text-4xl font-extrabold text-blue-500 dark:text-blue-400 mb-2">
            FlixReview
          </h1>
          {/* Descrição do app */}
          <p className="text-gray-700 dark:text-gray-300 text-lg px-10">
            Descubra os filmes favoritos de seus amigos e familiares, acompanhe
            o que eles estão assistindo e compartilhe suas próprias
            experiências!
          </p>
        </div>
        {/* Botão de login */}
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
        >
          Login com Google
        </button>
      </div>

      {/* Rodapé */}
      <footer className="text-center py-4 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
        <p>© 2024 Desenvolvido por FlixReview</p>
      </footer>
    </div>
  );
};

export default Login;
