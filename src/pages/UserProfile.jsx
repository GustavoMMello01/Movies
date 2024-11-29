import React from "react";
import { useAuth } from "../hooks/AuthContext";
import Header from "../components/Header";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header padrão */}
      <Header />
      <main className="flex-grow p-4">
        <div className="bg-blue-500 text-white shadow rounded-lg p-6 flex flex-col items-center">
          {/* Foto do usuário */}
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt={user.displayName}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          {/* Nome do usuário */}
          <h1 className="text-2xl font-bold mb-4">{user.displayName}</h1>
          {/* Email do usuário */}
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          {/* UID do usuário */}
          <p>
            <span className="font-semibold">UID:</span> {user.uid}
          </p>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
