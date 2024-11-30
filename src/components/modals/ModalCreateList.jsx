import React from "react";

const ModalCreateList = ({
  isOpen,
  onClose,
  title,
  description,
  onChangeTitle,
  onChangeDescription,
  onCreate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Criar Nova Lista</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          >
            ✖
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={onChangeTitle}
            placeholder="Título da Lista"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <textarea
            value={description}
            onChange={onChangeDescription}
            placeholder="Descrição da Lista"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <button
            onClick={onCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Criar Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateList;
