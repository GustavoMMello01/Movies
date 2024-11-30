import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ModalAddMovie from "../components/modals/ModalAddMovie";
import ModalConfirmDelete from "../components/modals/ModalConfirmDelete";
import toast from "react-hot-toast";
import {
  fetchMoviesFromList,
  addMovieToList,
  updateMovieInList,
  removeMovieFromList,
  deleteMovieList,
} from "../services/movieService";

const ListEdit = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
    try {
      await removeMovieFromList(listId, movieId);
      toast.success("Filme removido com sucesso!");
      fetchMovies();
    } catch (error) {
      console.error("Erro ao remover filme:", error);
      toast.error("Erro ao remover filme!");
    }
  };

  const handleDeleteList = async () => {
    try {
      await deleteMovieList(listId);
      toast.success("Lista removida com sucesso!");
      navigate("/"); // Redireciona para a Home após remover a lista
    } catch (error) {
      console.error("Erro ao remover lista:", error);
      toast.error("Erro ao remover lista!");
    } finally {
      setIsConfirmModalOpen(false); // Fecha o modal de confirmação
    }
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true); // Abre o modal de confirmação
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false); // Fecha o modal de confirmação
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Editar Lista de Filmes
          </h1>
          <button
            onClick={handleOpenConfirmModal} // Abre o modal de confirmação
            className="text-red-500 hover:text-red-700"
          >
            Remover Lista
          </button>
        </div>

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

        <ul className="space-y-4">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">
                  {movie.title}
                </h3>
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
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-5">
                Nota: {movie.rating}/10 | Gênero: {movie.genre} | Ano: {movie.year} | País: {movie.country} | Duração: {movie.duration} min
              </p>
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

      {/* Modal de confirmação para excluir a lista */}
      <ModalConfirmDelete
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal} // Fecha o modal
        onConfirm={handleDeleteList} // Confirma a exclusão da lista
        text="Tem certeza que deseja remover esta lista? Todos os filmes associados serão excluídos permanentemente."
      />
    </div>
  );
};

export default ListEdit;
