import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Inicializa com base na preferência do usuário ou no sistema
    const storedPreference = localStorage.getItem("theme");
    return storedPreference
      ? storedPreference === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Alterna a classe 'dark' no elemento <html>
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
