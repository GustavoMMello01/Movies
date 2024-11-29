import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUsers } from "../services/firestoreService";
import Header from "../components/Header";

const Profile = () => {
  const { userId } = useParams(); // Obtém o UID da URL
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const users = await fetchUsers(); // Busca todos os usuários
        const user = users.find((u) => u.uid === userId); // Encontra o usuário correspondente
        setProfile(user);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
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
            src={profile.photoURL || "/default-avatar.png"} // Foto do perfil
            alt={profile.displayName}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          {/* Nome do usuário */}
          <h1 className="text-2xl font-bold mb-4">{profile.displayName}</h1>
          {/* Nome do usuário */}
          <p className="mb-2">
            <span className="font-semibold">Nome:</span> {profile.email2}
          </p>
          
        </div>
      </main>
    </div>
  );
};

export default Profile;
