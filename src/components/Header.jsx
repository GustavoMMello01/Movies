import React from "react";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import useDarkMode from "../hooks/useDarkMode";
import { useAuth } from "../hooks/AuthContext";
import logo from "../assets/logo.png"; // Importa o logotipo

const Header = ({ onLogout }) => {
  const { user } = useAuth(); // Obtém o usuário do contexto
  const [isDarkMode, toggleDarkMode] = useDarkMode(); // Hook para alternar tema

  return (
    <header className="p-4 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between">
      {/* Logotipo na esquerda */}
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt="FlixReview Logo"
          className="w-10 h-10" // Define o tamanho do logotipo
        />
        <span className="text-gray-800 dark:text-gray-100 font-bold text-lg">
          FlixReview
        </span>
      </div>
      {/* Foto do usuário e botões à direita */}
      <div className="flex items-center space-x-4">
        <IconButton onClick={toggleDarkMode} color="inherit">
          {isDarkMode ? (
            <Brightness7Icon className="text-yellow-400" />
          ) : (
            <Brightness4Icon className="text-gray-600 dark:text-gray-300" />
          )}
        </IconButton>
        <img
          src={user?.photoURL || "/default-avatar.png"} // Foto do usuário
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <IconButton onClick={onLogout} color="inherit">
          <LogoutIcon className="text-red-500 dark:text-red-400" />
        </IconButton>
      </div>
    </header>
  );
};

export default Header;
