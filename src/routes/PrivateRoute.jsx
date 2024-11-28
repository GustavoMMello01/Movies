import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Adicione um spinner com Tailwind */}
        <span>Carregando...</span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
