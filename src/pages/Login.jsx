import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { loginWithGoogle } from "../services/authService";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Movie Tracker</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600"
      >
        Login com Google
      </button>
    </div>
  );
};

export default Login;
