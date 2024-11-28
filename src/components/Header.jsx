import React from "react";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import useDarkMode from "../hooks/useDarkMode";
import { useAuth } from "../hooks/AuthContext";

const Header = ({ onLogout }) => {
  const { user } = useAuth(); 
  const [isDarkMode, toggleDarkMode] = useDarkMode(); 

  return (
    <header className="p-4 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Avatar do usuário */}
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-gray-800 dark:text-gray-100 font-medium">
          Olá, {user?.displayName || "Usuário"}!
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {/* Botão de alternar tema */}
        <IconButton onClick={toggleDarkMode} color="inherit">
          {isDarkMode ? (
            <Brightness7Icon className="text-yellow-400" />
          ) : (
            <Brightness4Icon className="text-gray-600 dark:text-gray-300" />
          )}
        </IconButton>
        {/* Botão de logout */}
        <IconButton onClick={onLogout} color="inherit">
          <LogoutIcon className="text-red-500 dark:text-red-400" />
        </IconButton>
      </div>
    </header>
  );
};

export default Header;
