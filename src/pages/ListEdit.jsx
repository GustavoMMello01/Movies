import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import {
  fetchMoviesFromList,
  addMovieToList,
  updateMovieInList,
  removeMovieFromList,
} from "../services/movieService";

const ListEdit = () => {
  const { listId } = useParams(); // Obtém o ID da lista da URL
  const [movies, setMovies] = useState([]); // Filmes da lista
  const [form, setForm] = useState({
    title: "",
    rating: 0,
    genre: "",
    year: "",
    country: "",
    duration: "",
    comment: "",
  }); // Formulário para adicionar ou editar filmes
  const [editingMovieId, setEditingMovieId] = useState(null); // ID do filme que está sendo editado

  const genres = ["Ação", "Comédia", "Drama", "Ficção Científica", "Terror", "Romance"]; // Gêneros disponíveis

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const moviesData = await fetchMoviesFromList(listId);
      setMovies(moviesData);
    } catch (error) {
      console.error("Erro ao buscar filmes da lista:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validação específica para o campo "rating" (nota)
    if (name === "rating") {
      const numberValue = Math.max(0, Math.min(10, Number(value))); // Limita entre 0 e 10
      setForm({ ...form, [name]: numberValue });
      return;
    }

    // Validação específica para o campo "year" (ano)
    if (name === "year") {
      const currentYear = new Date().getFullYear();
      const validYear = Math.max(0, Math.min(currentYear, Number(value))); // Não permite anos negativos ou no futuro
      setForm({ ...form, [name]: validYear });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleAddMovie = async () => {
    if (!form.title || !form.genre) {
      alert("Título e Gênero são obrigatórios!");
      return;
    }

    try {
      if (editingMovieId) {
        // Atualiza o filme existente
        await updateMovieInList(listId, editingMovieId, form);
        setEditingMovieId(null);
      } else {
        // Adiciona um novo filme
        await addMovieToList(listId, form);
      }

      setForm({
        title: "",
        rating: 0,
        genre: "",
        year: "",
        country: "",
        duration: "",
        comment: "",
      });
      fetchMovies(); // Atualiza a lista após a operação
    } catch (error) {
      console.error("Erro ao adicionar/editar filme:", error);
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovieId(movie.id); // Define o ID do filme em edição
    setForm(movie); // Preenche o formulário com os dados do filme
  };

  const handleRemoveMovie = async (movieId) => {
    if (window.confirm("Tem certeza que deseja remover este filme?")) {
      try {
        await removeMovieFromList(listId, movieId);
        fetchMovies(); // Atualiza a lista após a remoção
      } catch (error) {
        console.error("Erro ao remover filme:", error);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Editar Lista de Filmes
        </h1>

        {/* Formulário para adicionar ou editar filmes */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
            {editingMovieId ? "Editar Filme" : "Adicionar Novo Filme"}
          </h2>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Título"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <input
            type="number"
            name="rating"
            value={form.rating}
            onChange={handleInputChange}
            placeholder="Avaliação (0-10)"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            min="0"
            max="10"
          />
          <select
            name="genre"
            value={form.genre}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            placeholder="Ano"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleInputChange}
            placeholder="País"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleInputChange}
            placeholder="Duração (minutos)"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          />
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleInputChange}
            placeholder="Comentário"
            className="w-full mb-2 p-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
          ></textarea>
          <button
            onClick={handleAddMovie}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingMovieId ? "Atualizar Filme" : "Adicionar Filme"}
          </button>
        </div>

        {/* Lista de filmes */}
        <ul className="space-y-2">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nota: {movie.rating}/10 | Gênero: {movie.genre} | Ano:{" "}
                  {movie.year}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditMovie(movie)}
                  className="text-blue-500 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemoveMovie(movie.id)}
                  className="text-red-500 hover:underline"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default ListEdit;
