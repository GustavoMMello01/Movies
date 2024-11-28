import React, { useState } from "react";

const HamburgerMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="p-2 bg-blue-500 rounded text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      {isOpen && (
        <div className="absolute top-12 right-4 bg-white shadow-lg p-4 rounded">
          <button
            onClick={onLogout}
            className="block w-full text-left p-2 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
