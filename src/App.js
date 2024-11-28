import React, { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { logout } from "./services/authService";

function App() {
  const [user, setUser] = useState(null);

  // Função para gerenciar login
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  // Função para gerenciar logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Renderiza Login ou Home com base no estado do usuário */}
      {user ? (
        <Home user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
