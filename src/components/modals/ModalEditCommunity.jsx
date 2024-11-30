import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o useNavigate
import { fetchFriends, removeFriend, searchUsers, addFriend } from "../../services/communityService";
import ModalConfirmDelete from "./ModalConfirmDelete"; // Importa o ModalConfirmDelete
import toast from "react-hot-toast";
import default_avatar from '../../assets/default_avatar.png';

const ModalEditCommunity = ({ isOpen, onClose, userId, onUpdateFriends }) => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    if (isOpen) {
      fetchFriendsList();
    }
  }, [isOpen]);

  const fetchFriendsList = async () => {
    try {
      const friendsList = await fetchFriends(userId);
      setFriends(friendsList); // Agora inclui `displayName` e `photoURL`
    } catch (error) {
      console.error("Erro ao buscar amigos:", error);
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsers(query); // Pesquisa agora é case-sensitive
      setSearchResults(results);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      await addFriend(userId, friendId);
      toast.success("Amigo adicionado com sucesso!");
      fetchFriendsList(); // Atualiza a lista de amigos
      setSearchQuery(""); // Limpa a pesquisa
      setSearchResults([]); // Reseta os resultados da pesquisa
      onUpdateFriends(); // Notifica o componente pai
    } catch (error) {
      console.error("Erro ao adicionar amigo:", error);
      toast.error("Erro ao adicionar amigo!");
    }
  };

  const handleRemoveFriend = async () => {
    if (!selectedFriendId) return;
  
    try {
      await removeFriend(selectedFriendId); // Passa o relationId ao invés do friendId
      toast.success("Amigo removido com sucesso!");
      fetchFriendsList(); // Atualiza a lista de amigos
      onUpdateFriends(); // Notifica o componente pai sobre a atualização
      setIsConfirmModalOpen(false); // Fecha o modal de confirmação
      setSelectedFriendId(null); // Reseta o estado do ID selecionado
    } catch (error) {
      console.error("Erro ao remover amigo:", error);
      toast.error("Erro ao remover amigo!");
    }
  };
  
  const openConfirmModal = (relationId) => {
    setSelectedFriendId(relationId); // Define o relationId ao abrir o modal
    setIsConfirmModalOpen(true);
  };

  const handleViewProfile = (friendId) => {
    navigate(`/profile/${friendId}`); // Redireciona para o perfil do amigo
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-lg rounded-lg shadow-lg p-6">
        {/* Título e botão fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Gerenciar Amigos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Lista de Amigos */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Seus Amigos
          </h3>
          <ul className="space-y-2 mt-2">
            {friends.map((friend) => (
              <li
                key={friend.uid}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
              >
                <div
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => handleViewProfile(friend.uid)} // Redireciona ao clicar na foto ou nome
                >
                  <img
                    src={friend.photoURL || default_avatar}
                    alt={friend.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-800 dark:text-white">
                    {friend.displayName}
                  </span>
                </div>
                <button
                  onClick={() => openConfirmModal(friend.id)} // Abre o modal de confirmação
                  className="text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Busca de Usuários */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Buscar Novos Amigos
          </h3>
          <input
            type="text"
            placeholder="Digite um nome..."
            value={searchQuery}
            onChange={(e) => handleSearchUsers(e.target.value)}
            className="w-full mt-2 p-2 border rounded dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ul className="space-y-2 mt-4">
            {searchResults.map((user) => (
              <li
                key={user.uid}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.photoURL || default_avatar }
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-800 dark:text-gray-100">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={() => handleAddFriend(user.uid)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Adicionar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal de confirmação para remover amigo */}
      <ModalConfirmDelete
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleRemoveFriend}
        text="Tem certeza que deseja remover este amigo? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default ModalEditCommunity;
