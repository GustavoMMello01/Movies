import React from "react";

const Header = ({ user, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <div className="flex items-center space-x-4">
        <img
          src={user.photoURL || "/placeholder.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-bold">{user.displayName || "Usuário"}</span>
      </div>
      <button
        className="text-sm bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        onClick={onLogout}
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
