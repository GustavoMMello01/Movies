import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import ModalAddMovie from "../components/modals/ModalAddMovie";
import toast from "react-hot-toast";
import {
  fetchMoviesFromList,
  addMovieToList,
  updateMovieInList,
  removeMovieFromList,
} from "../services/movieService";

const ListEdit = () => {
  const { listId } = useParams();
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    rating: 0,
    genre: "",
    year: "",
    country: "",
    duration: "",
    comment: "",
  });
  const [editingMovieId, setEditingMovieId] = useState(null);

  const genres = ["Ação", "Comédia", "Drama", "Ficção Científica", "Terror", "Romance"];

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
    if (name === "rating") {
      setForm({ ...form, [name]: Math.max(0, Math.min(10, Number(value))) });
      return;
    }
    if (name === "year") {
      const currentYear = new Date().getFullYear();
      setForm({ ...form, [name]: Math.max(0, Math.min(currentYear, Number(value))) });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleAddMovie = async () => {
    if (!form.title || !form.genre || !form.year) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      if (editingMovieId) {
        await updateMovieInList(listId, editingMovieId, form);
        toast.success("Filme atualizado com sucesso!");
        setEditingMovieId(null);
      } else {
        await addMovieToList(listId, form);
        toast.success("Filme adicionado com sucesso!");
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
      setIsModalOpen(false);
      fetchMovies();
    } catch (error) {
      console.error("Erro ao adicionar/editar filme:", error);
      toast.error("Erro ao adicionar ou editar filme!");
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovieId(movie.id);
    setForm(movie);
    setIsModalOpen(true);
  };

  const handleRemoveMovie = async (movieId) => {
    if (window.confirm("Tem certeza que deseja remover este filme?")) {
      try {
        await removeMovieFromList(listId, movieId);
        toast.success("Filme removido com sucesso!");
        fetchMovies();
      } catch (error) {
        console.error("Erro ao remover filme:", error);
        toast.error("Erro ao remover filme!");
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

        <div className="mb-4">
          <button
            onClick={() => {
              setEditingMovieId(null);
              setForm({
                title: "",
                rating: 0,
                genre: "",
                year: "",
                country: "",
                duration: "",
                comment: "",
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Adicionar Filme
          </button>
        </div>

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
                  Nota: {movie.rating}/10 | Gênero: {movie.genre} | Ano: {movie.year}
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

      <ModalAddMovie
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setForm({
            title: "",
            rating: 0,
            genre: "",
            year: "",
            country: "",
            duration: "",
            comment: "",
          });
          setEditingMovieId(null);
        }}
        form={form}
        genres={genres}
        onInputChange={handleInputChange}
        onAdd={handleAddMovie}
      />
    </div>
  );
};

export default ListEdit;
