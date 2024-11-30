import React from "react";

const ModalAddMovie = ({
  isOpen,
  onClose,
  form,
  genres,
  onInputChange,
  onAdd,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {form.id ? "Editar Filme" : "Adicionar Novo Filme"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          >
            ✖
          </button>
        </div>
        <div>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={onInputChange}
            placeholder="Título"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <input
            type="number"
            name="rating"
            value={form.rating}
            onChange={onInputChange}
            placeholder="Avaliação (0-10)"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            min="0"
            max="10"
          />
          <select
            name="genre"
            value={form.genre}
            onChange={onInputChange}
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          >
            <option value="">Selecione um Gênero</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={onInputChange}
            placeholder="Ano do Filme"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={onInputChange}
            placeholder="País do Filme"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={onInputChange}
            placeholder="Duração (minutos)"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <textarea
            name="comment"
            value={form.comment}
            onChange={onInputChange}
            placeholder="Comentário"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          ></textarea>
          <button
            onClick={onAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {form.id ? "Atualizar Filme" : "Adicionar Filme"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddMovie;
